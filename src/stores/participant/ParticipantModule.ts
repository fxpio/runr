/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
import SearchConfig from '@/forms/SearchConfig';
import {CacheResults} from '@/stores/participant/CacheResults';
import {ParticipantModuleState} from '@/stores/participant/ParticipantModuleState';
import {ParticipantState} from '@/stores/participant/ParticipantState';
import Router, {RawLocation, Route} from 'vue-router';
import Vue from 'vue';
import {GetterTree, Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ParticipantModule<R extends ParticipantModuleState> implements Module<ParticipantState, R> {
    private readonly router: Router;

    /**
     * Constructor.
     */
    public constructor(router: Router) {
        this.router = router;

        router.beforeEach((to: Route, from: Route,
                           next: (to?: RawLocation|false|((vm: Vue) => any)|void) => void) => {
            if (router.app.$store && !String(to.name).startsWith('participants-')) {
                router.app.$store.commit('participant/resetCache');
            }

            next();
        });
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): ParticipantState {
        return {
            pageSize: 10,
            cacheSearchConfig: null,
            cacheResults: null,
            cacheSelection: null,
        };
    }

    public get getters(): GetterTree<ParticipantState, R> {
        return {
        };
    }

    public get mutations(): MutationTree<ParticipantState> {
        return {
            setSearchConfig(state: ParticipantState, config: SearchConfig|null): void {
                state.cacheSearchConfig = config;
            },

            setResults(state: ParticipantState, results: CacheResults|null): void {
                state.cacheResults = results;
                state.cacheSelection = null;
            },

            setSelection(state: ParticipantState, selection: RegistrationResponse|null): void {
                state.cacheSelection = selection;
            },

            updateSelection(state: ParticipantState, selection: RegistrationResponse): void {
                state.cacheSelection = selection;

                if (state.cacheResults) {
                    for (const item of state.cacheResults.results) {
                        if (item.id === selection.id) {
                            Object.assign(item, selection);
                        }
                    }
                }
            },

            resetCache(state: ParticipantState): void {
                state.cacheSearchConfig = null;
                state.cacheResults = null;
                state.cacheSelection = null;
            },
        };
    }
}
