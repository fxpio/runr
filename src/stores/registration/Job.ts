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
import {Registration} from '@/api/services/Registration';
import {RegistrationOptions} from '@/api/models/request/RegistrationOptions';
import {Database} from '@/db/Database';
import {IEdition} from '@/db/tables/IEdition';
import {IRegistration} from '@/db/tables/IRegistration';
import {JobError} from '@/errors/JobError';
import {Util} from '@/stores/registration/Util';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Job {
    public readonly api: Api;

    public readonly db: Database;

    public readonly edition: IEdition;

    public readonly batchSize: number;

    public startedAt: Date|null = null;

    public size: number|null = null;

    public progress: number|null = null;

    private readonly callback: () => void;

    private readonly error: (reason: any) => void;

    private previousRequest?: Canceler;

    constructor(api: Api,
                db: Database,
                edition: IEdition,
                batchSize: number,
                callback: () => void,
                error: (reason: JobError) => void = () => {/**/}) {
        this.api = api;
        this.db = db;
        this.edition = edition;
        this.batchSize = batchSize;
        this.callback = callback;
        this.error = error;
        this.startedAt = new Date();
    }

    public get progression(): number {
        return null !== this.size && null !== this.progress && this.size > 0
            ? (this.progress / this.size) * 100
            : 0;
    }

    public start(): void {
        this.startedAt = new Date();

        this.run()
            .then(this.callback)
            .catch(this.error)
        ;
    }

    public terminate(): void {
        if (this.previousRequest) {
            this.previousRequest.cancel();
            this.previousRequest = undefined;
        }

        this.callback();
    }

    private update(size: number, progress: number): void {
        this.size = size;
        this.progress = (this.progress || 0) + progress;
    }

    private async run(): Promise<void> {
        try {
            this.previousRequest = new Canceler();
            const requestOpts = {
                itemsPerPage: this.batchSize,
                from: this.progress || 0,
            } as RegistrationOptions;
            const headers = {
                Edition: this.edition.id,
                Authorization: this.edition.apiKey,
            };

            const res = await this.api.get<Registration>(Registration)
                .list(requestOpts, this.previousRequest, headers);

            if (!res) {
                return;
            }

            await this.db.registrations.bulkPut(Util.convertRegistrations(res.results, this.startedAt as Date));
            this.update(res.totalHits, res.resultsSize);

            if ((this.progress || 0) < (this.size || 0)) {
                await this.run();
            } else {
                this.previousRequest = undefined;
                await this.db.registrations.where('editionId').equals(this.edition.id)
                    .and((registration: IRegistration): boolean => {
                        return registration.syncAt < (this.startedAt as Date).getTime();
                    })
                    .delete();

                this.terminate();
            }
        } catch (e) {
            throw new JobError(e.message);
        }
    }
}
