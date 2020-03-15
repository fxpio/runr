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
import {ApiCredentials} from '@/api/credentials/ApiCredentials';
import {RegistrationAnswerChoiceResponse} from '@/api/models/responses/RegistrationAnswerChoiceResponse';
import {RegistrationAnswerResponse} from '@/api/models/responses/RegistrationAnswerResponse';
import {Edition} from '@/api/services/Edition';
import {Database} from '@/db/Database';
import {ICompetition} from '@/db/tables/ICompetition';
import {IEdition} from '@/db/tables/IEdition';
import {IField} from '@/db/tables/IField';
import {SnackbarManager} from '@/snackbars/SnackbarManager';
import {SnackbarMessage} from '@/snackbars/SnackbarMessage';
import {Answer} from '@/stores/edition/Answer';
import {AnswerConverter} from '@/stores/edition/AnswerConverter';
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

    private readonly snackbar: SnackbarManager;

    private readonly storage: Storage;

    private previousRequest?: Canceler;

    /**
     * Constructor.
     */
    public constructor(router: Router, api: Api, db: Database, snackbar: SnackbarManager, storage?: Storage) {
        this.router = router;
        this.api = api;
        this.db = db;
        this.snackbar = snackbar;
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
            currentCompetitions: null,
            currentFields: null,
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

            getCompetitionName(state: EditionState) {
                return (id: number): string => {
                    const competitions = state.currentCompetitions;

                    if (competitions && competitions[id]) {
                        return (competitions[id] as ICompetition).name;
                    }

                    return String(id);
                };
            },

            convertAnswers(state: EditionState) {
                return (answers: RegistrationAnswerResponse[]|RegistrationAnswerChoiceResponse[]): Answer[] => {
                    if (!state.currentFields) {
                        return [];
                    }

                    return AnswerConverter.convertAll(state.currentFields, answers);
                };
            },
        };
    }

    public get mutations(): MutationTree<EditionState> {
        return {
            selectCurrent: (state: EditionState, current: IEdition|null) => {
                state.current = current;
                state.currentCompetitions = null;
                state.currentFields = null;

                if (current) {
                    this.storage.setItem('edition:selection', String(current.id));
                } else {
                    this.storage.removeItem('edition:selection');
                }
            },

            setCurrentCompetitions: (state: EditionState, competitions: Record<number, ICompetition>) => {
                state.currentCompetitions = competitions;
            },

            setCurrentFields: (state: EditionState, fields: Record<number, IField>) => {
                state.currentFields = fields;
            },

            setEditions: (state: EditionState, editions: IEdition[]) => {
                state.initialized = true;
                state.all.splice(0, state.all.length);

                for (const edition of editions) {
                    state.all.push(edition);
                }
            },

            addEdition: (state: EditionState, edition: IEdition) => {
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

            removeEdition: (state: EditionState, id: number) => {
                const existingEditionPosition = state.all.findIndex((savedEdition: IEdition): boolean => {
                    return id === savedEdition.id;
                });

                if (existingEditionPosition >= 0) {
                    state.all.splice(existingEditionPosition, 1);
                }
            },

            ping: (state: EditionState) => {
                state.serverPending = true;
            },
            pingSuccess: (state: EditionState) => {
                state.serverPending = false;
            },
            pingError: (state: EditionState) => {
                state.serverPending = false;
            },
        };
    }

    public get actions(): ActionTree<EditionState, R> {
        const self = this;

        return {
            async init({commit, dispatch, state}): Promise<void> {
                if (!state.initialized) {
                    commit('setEditions', await self.db.editions.orderBy('id').reverse().toArray());
                    const val = self.storage.getItem('edition:selection');
                    const current = await Util.getOne(commit, state, val ? Number(val) : null, true);
                    await dispatch('select', current);
                }
            },

            async refresh({commit, dispatch, state}): Promise<void> {
                const id = state.current ? state.current.id : null;
                commit('setEditions', await self.db.editions.orderBy('id').reverse().toArray());
                const current = await Util.getOne(commit, state, id, true);
                await dispatch('select', current);
            },

            async select({commit, dispatch, state}, edition: IEdition|number|null): Promise<void> {
                if (typeof edition === 'number') {
                    edition = await Util.getOne(commit, state, edition, false, true);
                }

                try {
                    if (edition && !edition.isLoaded) {
                        await dispatch('ping', new ApiCredentials(String(edition.id), edition.apiKey, false));
                        edition = await Util.getOne(commit, state, edition.id, false);
                    }

                    commit('selectCurrent', edition);

                    if (edition) {
                        // find all competitions
                        const competitions = {} as Record<number, ICompetition>;
                        const edCompetitions = await self.db.competitions.where('editionId')
                            .equals(edition.id).toArray();

                        for (const comp of edCompetitions) {
                            competitions[comp.id] = comp;
                        }
                        commit('setCurrentCompetitions', competitions);

                        // find all fields
                        const fields = {} as Record<number, IField>;
                        const edFields = await self.db.fields.where('editionId')
                            .equals(edition.id).toArray();

                        for (const field of edFields) {
                            fields[field.id] = field;
                        }
                        commit('setCurrentFields', fields);
                    }

                } catch (e) {
                    const mess = self.router.app.$i18n.t('error.invalid-authorization') as string;
                    commit('selectCurrent', null);
                    self.snackbar.snack(new SnackbarMessage(mess, 'error'));
                }
            },

            async unselect({commit}): Promise<void> {
                commit('selectCurrent', null);
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
                if (competitions.length > 0) {
                    const competitionIds: number[] = [];
                    for (const competition of competitions) {
                        competitionIds.push(competition.id);
                    }

                    await self.db.competitions.where('editionId').equals(competitions[0].editionId)
                        .and((competition: ICompetition): boolean => {
                            return -1 === competitionIds.indexOf(competition.id);
                        })
                        .delete();
                }

                await self.db.competitions.bulkPut(competitions);
            },

            async putEditions({commit, dispatch, state}, editions: IEdition[]): Promise<void> {
                await self.db.editions.bulkPut(editions);

                for (const edition of editions) {
                    commit('addEdition', edition);
                }
            },

            async put({commit, state}, edition: IEdition): Promise<void> {
                await self.db.editions.put(edition);
                commit('addEdition', edition);
            },

            async delete({commit, state}, id: number): Promise<void> {
                await self.db.fields.where('editionId').equals(id).delete();
                await self.db.competitions.where('editionId').equals(id).delete();
                await self.db.editions.where('id').equals(id).delete();
                await self.db.registrations.where('editionId').equals(id).delete();
                commit('removeEdition', id);

                if (state.current && id === state.current.id) {
                    commit('selectCurrent', null);
                }
            },

            async deleteAll({commit}): Promise<void> {
                await self.db.fields.toCollection().delete();
                await self.db.competitions.toCollection().delete();
                await self.db.editions.toCollection().delete();
                await self.db.registrations.toCollection().delete();
                commit('setEditions', []);
                commit('selectCurrent', null);
            },

            async ping({commit, dispatch, state}, credentials: ApiCredentials): Promise<void> {
                commit('ping');

                try {
                    if (self.previousRequest) {
                        self.previousRequest.cancel();
                    }

                    self.previousRequest = new Canceler();
                    const redirect = null !== credentials.redirect
                        ? credentials.redirect
                        : self.router.currentRoute.query.redirect as string;

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
                    await dispatch('putFields', fields);
                    await dispatch('putCompetitions', Object.values(competitions));
                    await dispatch('put', edition);

                    if (typeof redirect === 'string') {
                        commit('selectCurrent', edition);
                        commit('setCurrentCompetitions', competitions);
                        commit('setCurrentFields', fields);
                        await self.router.push(redirect);
                    } else if (redirect) {
                        commit('selectCurrent', edition);
                        commit('setCurrentCompetitions', competitions);
                        commit('setCurrentFields', fields);
                        await self.router.push({name: 'editions'});
                    }

                    commit('pingSuccess');
                } catch (e) {
                    commit('pingError');
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
