/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@/api/Api';
import BibRange from '@/bib/BibRange';
import {Database} from '@/db/Database';
import {IEdition} from '@/db/tables/IEdition';
import {IRegistration} from '@/db/tables/IRegistration';
import {JobError} from '@/errors/JobError';
import {SnackbarManager} from '@/snackbars/SnackbarManager';
import {SnackbarMessage} from '@/snackbars/SnackbarMessage';
import {Job} from '@/stores/registration/Job';
import {ListFilter} from '@/stores/registration/ListFilter';
import {RegistrationModuleState} from '@/stores/registration/RegistrationModuleState';
import {RegistrationState} from '@/stores/registration/RegistrationState';
import {ActionTree, GetterTree, Module} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class RegistrationModule<R extends RegistrationModuleState> implements Module<RegistrationState, R> {
    private readonly api: Api;

    private readonly db: Database;

    private readonly snackbar: SnackbarManager;

    /**
     * Constructor.
     */
    public constructor(api: Api, db: Database, snackbar: SnackbarManager) {
        this.api = api;
        this.db = db;
        this.snackbar = snackbar;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): RegistrationState {
        return {
            batchSize: 100,
            pending: false,
            job: null,
        };
    }

    public get getters(): GetterTree<RegistrationState, R> {
        const self = this;

        return {
            list() {
                return async (filter: ListFilter): Promise<IRegistration[]> => {
                    const items = await self.db.registrations
                        .where('editionId')
                        .equals(filter.editionId)
                        .and((registration: IRegistration): boolean => {
                            const bib = registration.bib;
                            let valid = false;

                            if (null !== bib && undefined !== bib.codeAsInteger) {
                                if (filter.ranges && filter.ranges.length > 0) {
                                    for (const range of filter.ranges) {
                                        if (range instanceof BibRange) {
                                            if (bib.codeAsInteger >= range.start
                                                    && bib.codeAsInteger <= range.end) {
                                                valid = true;
                                                break;
                                            }
                                        } else {
                                            if (bib.codeAsInteger === range) {
                                                valid = true;
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    valid = true;
                                }

                                if (valid && filter.competitionIds && filter.competitionIds.length > 0) {
                                    valid = -1 !== filter.competitionIds.indexOf(registration.competition_id);
                                }

                                if (valid && filter.registrationStatus && filter.registrationStatus.length > 0) {
                                    let valueFound = false;

                                    for (const status of filter.registrationStatus) {
                                        if (status === registration.isRegistered) {
                                            valueFound = true;
                                            break;
                                        }
                                    }

                                    valid = valueFound;
                                }

                                if (valid && filter.status && filter.status.length > 0) {
                                    valid = -1 !== filter.status.indexOf(registration.status);
                                }
                            }

                            return valid;
                        });

                    return await items.sortBy('bib.codeAsInteger');
                };
            },
        };
    }

    public get actions(): ActionTree<RegistrationState, R> {
        const self = this;

        return {
            sync({commit, dispatch, state}, edition: IEdition): void {
                state.pending = true;
                state.job = new Job(self.api, self.db, edition, state.batchSize, () => {
                    state.pending = false;
                    state.job = null;
                }, (reason: JobError) => {
                    const message = (new SnackbarMessage(reason.message, 'error')).setTimeout(0);
                    self.snackbar.snack(message);
                    state.pending = false;
                    state.job = null;
                });
                state.job.start();
            },

            stop({state}): void {
                if (state.job) {
                    state.job.terminate();
                }
            },
        };
    }
}
