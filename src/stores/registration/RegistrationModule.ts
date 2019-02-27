/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@/api/Api';
import {Database} from '@/db/Database';
import {IEdition} from '@/db/tables/IEdition';
import {JobError} from '@/errors/JobError';
import {SnackbarManager} from '@/snackbars/SnackbarManager';
import {SnackbarMessage} from '@/snackbars/SnackbarMessage';
import {Job} from '@/stores/registration/Job';
import {RegistrationModuleState} from '@/stores/registration/RegistrationModuleState';
import {RegistrationState} from '@/stores/registration/RegistrationState';
import {ActionTree, Module} from 'vuex';

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
