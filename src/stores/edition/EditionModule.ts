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
import {Credentials} from '@/api/Credentials';
import {Edition} from '@/api/services/Edition';
import {Database} from '@/db/Database';
import {ICompetition} from '@/db/tables/ICompetition';
import {IEdition} from '@/db/tables/IEdition';
import {IField} from '@/db/tables/IField';
import {EditionModuleState} from '@/stores/edition/EditionModuleState';
import {EditionState} from '@/stores/edition/EditionState';
import {Util} from '@/stores/edition/Util';
import Router from 'vue-router';
import {ActionTree, GetterTree, Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class EditionModule<R extends EditionModuleState> implements Module<EditionState, R> {
    private readonly router: Router;

    private readonly api: Api;

    private readonly db: Database;

    private readonly storage: Storage;

    private previousRequest?: Canceler;

    /**
     * Constructor.
     */
    public constructor(router: Router, api: Api, db: Database, storage?: Storage) {
        this.router = router;
        this.api = api;
        this.db = db;
        this.storage = storage ? storage : localStorage;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): EditionState {
        return {
            initialized: false,
            all: [],
            current: null,
            serverPending: false,
        } as EditionState;
    }

    public get getters(): GetterTree<EditionState, R> {
        return {
            isSelected(state: EditionState) {
                return (id: number): boolean => {
                    return (state.current && state.current.id === id) as boolean;
                };
            },
        };
    }

    public get mutations(): MutationTree<EditionState> {
        return {
            SELECT_CURRENT: (state: EditionState, current: IEdition|null) => {
                state.current = current;

                if (current) {
                    this.storage.setItem('edition:selection', String(current.id));
                } else {
                    this.storage.removeItem('edition:selection');
                }
            },

            SET_EDITIONS: (state: EditionState, editions: IEdition[]) => {
                state.initialized = true;
                state.all.splice(0, state.all.length);

                for (const edition of editions) {
                    state.all.push(edition);
                }
            },

            ADD_EDITION: (state: EditionState, edition: IEdition) => {
                const existingEditionPosition = state.all.findIndex((savedEdition: IEdition): boolean => {
                    return edition.id === savedEdition.id;
                });

                // Replace the existing edition
                if (existingEditionPosition >= 0) {
                    state.all.splice(existingEditionPosition, 1, edition);
                } else {
                    state.all.push(edition);
                }

                // Sort the list in descending order
                state.all = state.all.sort((ed1: IEdition, ed2: IEdition) => {
                    if (ed1.id > ed2.id) {
                        return -1;
                    }

                    return ed1.id < ed2.id ? 1 : 0;
                });
            },

            REMOVE_EDITION: (state: EditionState, id: number) => {
                const existingEditionPosition = state.all.findIndex((savedEdition: IEdition): boolean => {
                    return id === savedEdition.id;
                });

                if (existingEditionPosition >= 0) {
                    state.all.splice(existingEditionPosition, 1);
                }
            },

            PING: (state: EditionState) => {
                state.serverPending = true;
            },
            PING_SUCCESS: (state: EditionState) => {
                state.serverPending = false;
            },
            PING_ERROR: (state: EditionState) => {
                state.serverPending = false;
            },
        };
    }

    public get actions(): ActionTree<EditionState, R> {
        const self = this;

        return {
            async init({commit, state}): Promise<void> {
                if (!state.initialized) {
                    commit('SET_EDITIONS', await self.db.editions.orderBy('id').reverse().toArray());
                    const val = self.storage.getItem('edition:selection');
                    await Util.getOne(commit, state, val ? Number(val) : null, true);
                }
            },

            async refresh({commit, state}): Promise<void> {
                const id = state.current ? state.current.id : null;
                commit('SET_EDITIONS', await self.db.editions.orderBy('id').reverse().toArray());
                await Util.getOne(commit, state, id, true);
            },

            async select({commit, state}, id: number): Promise<void> {
                commit('SELECT_CURRENT', await Util.getOne(commit, state, id, false));
            },

            async unselect({commit}): Promise<void> {
                commit('SELECT_CURRENT', null);
            },

            async putFields({commit, state}, fields: IField[]): Promise<void> {
                if (fields.length > 0) {
                    const fieldIds: number[] = [];
                    for (const field of fields) {
                        fieldIds.push(field.id);
                    }

                    await self.db.fields.where('editionId').equals(fields[0].editionId)
                        .and((field: IField): boolean => {
                            return -1 === fieldIds.indexOf(field.id);
                        })
                        .delete();
                }

                await self.db.fields.bulkPut(fields);
            },

            async putCompetitions({commit, state}, competitions: ICompetition[]): Promise<void> {
                await self.db.competitions.bulkPut(competitions);
            },

            async put({commit, state}, edition: IEdition): Promise<void> {
                await self.db.editions.put(edition);
                commit('ADD_EDITION', edition);
            },

            async delete({commit, state}, id: number): Promise<void> {
                await self.db.fields.where('editionId').equals(id).delete();
                await self.db.competitions.where('editionId').equals(id).delete();
                await self.db.editions.where('id').equals(id).delete();
                commit('REMOVE_EDITION', id);

                if (state.current && id === state.current.id) {
                    commit('SELECT_CURRENT', null);
                }
            },

            async ping({commit, state}, credentials: Credentials): Promise<void> {
                commit('PING');

                try {
                    if (self.previousRequest) {
                        self.previousRequest.cancel();
                    }

                    self.previousRequest = new Canceler();
                    const redirect = self.router.currentRoute.query.redirect as string;
                    const res = await self.api.get<Edition>(Edition).ping(credentials, self.previousRequest);

                    self.previousRequest = new Canceler();
                    const resCompetitions = await self.api.get<Edition>(Edition).listCompetitions(credentials,
                        self.previousRequest);

                    self.previousRequest = new Canceler();
                    const resFields = await self.api.get<Edition>(Edition).listFields(credentials,
                        self.previousRequest);

                    const edition = Util.convertEdition(res.edition, credentials.apiKey);
                    const competitions = Util.convertCompetitions(resCompetitions.competitions, edition.id);
                    const fields = Util.convertFields(resFields, edition.id);

                    self.previousRequest = undefined;
                    await self.db.fields.bulkPut(fields);
                    await self.db.competitions.bulkPut(competitions);
                    await self.db.editions.put(edition);
                    commit('ADD_EDITION', edition);
                    commit('SELECT_CURRENT', edition);

                    if (redirect) {
                        self.router.push(redirect);
                    } else {
                        self.router.push({name: 'editions'});
                    }

                    commit('PING_SUCCESS');
                } catch (e) {
                    commit('PING_ERROR');
                    self.previousRequest = undefined;
                    throw e;
                }
            },

            async cancel(): Promise<void> {
                if (self.previousRequest) {
                    self.previousRequest.cancel();
                    self.previousRequest = undefined;
                }
            },
        };
    }
}
