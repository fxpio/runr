/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@/api/Api';
import {Canceler} from '@/api/Canceler';
import {AuthCredentials} from '@/api/credentials/AuthCredentials';
import {Organization} from '@/api/services/Organization';
import {Database} from '@/db/Database';
import {IEdition} from '@/db/tables/IEdition';
import {AuthModuleState} from '@/stores/auth/AuthModuleState';
import {AuthState} from '@/stores/auth/AuthState';
import {EditionModuleState} from '@/stores/edition/EditionModuleState';
import {Util} from '@/stores/edition/Util';
import {VueRouter} from 'vue-router/types/router';
import {ActionTree, Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AuthModule<R extends AuthModuleState & EditionModuleState> implements Module<AuthState, R> {
    private readonly router: VueRouter;

    private readonly api: Api;

    private readonly db: Database;

    private readonly storage: Storage;

    private previousRequest?: Canceler;

    /**
     * Constructor.
     */
    public constructor(router: VueRouter, api: Api, db: Database, storage?: Storage) {
        this.router = router;
        this.api = api;
        this.db = db;
        this.storage = storage ? storage : localStorage;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): AuthState {
        const authFullName = this.storage.getItem('auth:name');

        return {
            authenticated: !!authFullName,
            authenticationPending: false,
            fullName: authFullName,
            email: this.storage.getItem('auth:email'),
            password: null,
        };
    }

    public get mutations(): MutationTree<AuthState> {
        return {
            LOGIN(state: AuthState): void {
                state.authenticationPending = true;
            },
            LOGIN_SUCCESS(state: AuthState, credentials: AuthCredentials): void {
                state.authenticated = true;
                state.fullName = credentials.fullName;
                state.email = credentials.email;
                state.password = credentials.password;
            },
            LOGIN_SUCCESS_END(state: AuthState): void {
                state.authenticationPending = false;
            },
            LOGIN_ERROR(state: AuthState): void {
                state.authenticated = false;
                state.authenticationPending = false;
            },
            LOGOUT(state: AuthState): void {
                state.authenticated = false;
            },
        };
    }

    public get actions(): ActionTree<AuthState, R> {
        const self = this;

        return {
            async login({commit, dispatch, state, rootState}, credentials: AuthCredentials): Promise<void> {
                commit('LOGIN');

                try {
                    self.cancelPreviousRequest();
                    let uEditions: IEdition[] = [];
                    const redirect = null !== credentials.redirect
                        ? credentials.redirect
                        : self.router.currentRoute.query.redirect as string;

                    if (credentials.email && credentials.password) {
                        self.previousRequest = new Canceler();
                        const res = await self.api.get<Organization>(Organization)
                            .listEditions(credentials, self.previousRequest);
                        uEditions = Util.convertOrganizationEditions(res);
                        await dispatch('edition/putEditions', uEditions, {root: true});

                        if (credentials.mustBeSaved) {
                            self.storage.setItem('auth:email', credentials.email);
                        } else {
                            self.storage.removeItem('auth:email');
                        }
                    }

                    self.previousRequest = undefined;
                    self.storage.setItem('auth:name', credentials.fullName);
                    commit('LOGIN_SUCCESS', credentials);

                    let current = rootState.edition.current;

                    if (!current && uEditions.length > 0) {
                        current = uEditions[uEditions.length - 1];
                    }

                    if (current) {
                        await dispatch('edition/select', current.id, {root: true});
                    }

                    if (typeof redirect === 'string') {
                        self.router.replace(redirect);
                    } else if (false !== redirect) {
                        self.router.replace({name: 'home'});
                    }

                    commit('LOGIN_SUCCESS_END');
                } catch (e) {
                    commit('LOGIN_ERROR');
                    self.previousRequest = undefined;
                    throw e;
                }
            },

            logout({commit, state}): void {
                state.fullName = null;
                state.email = null;
                state.password = null;
                self.storage.removeItem('auth:name');
                self.storage.removeItem('auth:email');

                commit('LOGOUT');

                self.router.replace({name: 'home'});
            },

            async cancel(): Promise<void> {
                self.cancelPreviousRequest();
            },
        };
    }

    protected cancelPreviousRequest(): void {
        if (this.previousRequest) {
            this.previousRequest.cancel();
            this.previousRequest = undefined;
        }
    }
}
