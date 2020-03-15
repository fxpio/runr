/*
 * This file is part of the Runr package.
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
import {RawLocation, VueRouter} from 'vue-router/types/router';
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
            login(state: AuthState): void {
                state.authenticationPending = true;
            },
            loginSuccess(state: AuthState, credentials: AuthCredentials): void {
                state.authenticated = true;
                state.fullName = credentials.fullName;
                state.email = credentials.email;
                state.password = credentials.password;
            },
            loginSuccessEnd(state: AuthState): void {
                state.authenticationPending = false;
            },
            loginError(state: AuthState): void {
                state.authenticated = false;
                state.authenticationPending = false;
            },
            logout(state: AuthState): void {
                state.authenticated = false;
            },
        };
    }

    public get actions(): ActionTree<AuthState, R> {
        const self = this;

        return {
            async login({commit, dispatch, state, rootState}, credentials: AuthCredentials): Promise<void> {
                commit('login');

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
                    commit('loginSuccess', credentials);

                    let current = rootState.edition.current;

                    if (!current && uEditions.length > 0) {
                        current = uEditions[uEditions.length - 1];
                    }

                    if (current) {
                        await dispatch('edition/select', current.id, {root: true});
                    }

                    if (typeof redirect === 'string') {
                        await self.router.replace(redirect);
                    } else if (redirect) {
                        await self.router.replace({name: 'home'});
                    }

                    commit('loginSuccessEnd');
                } catch (e) {
                    commit('loginError');
                    self.previousRequest = undefined;
                    throw e;
                }
            },

            async logout({commit, dispatch, state}, redirect?: RawLocation): Promise<void> {
                await dispatch('edition/deleteAll', null, {root: true});
                state.fullName = null;
                state.email = null;
                state.password = null;
                self.storage.removeItem('auth:name');
                self.storage.removeItem('auth:email');
                commit('logout');

                if (!redirect) {
                    redirect = {name: 'home'};
                }

                await self.router.replace(redirect);
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
