/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseService} from '@/api/BaseService';
import {Canceler} from '@/api/Canceler';
import {ApiCredentials} from '@/api/credentials/ApiCredentials';
import {FieldResponse} from '@/api/models/responses/FieldResponse';
import {ListCompetitionResponse} from '@/api/models/responses/ListCompetitionResponse';
import {PingEditionResponse} from '@/api/models/responses/PingEditionResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Edition extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'Edition';
    }

    /**
     * Get the editions of the organization.
     */
    public async ping(credentials: ApiCredentials,
                      canceler?: Canceler): Promise<PingEditionResponse> {
        return await this.request<PingEditionResponse>({
            method: 'GET',
            url: '/api-registrations/ping',
            headers: {
                Edition: credentials.identifier,
                Authorization: credentials.apiKey,
            },
        }, canceler) as PingEditionResponse;
    }

    /**
     * Get the competitions of the edition.
     */
    public async listCompetitions(credentials?: ApiCredentials, canceler?: Canceler): Promise<ListCompetitionResponse> {
        const headers: Record<string, any> = {};

        if (credentials) {
            headers.Edition = credentials.identifier;
            headers.Authorization = credentials.apiKey;
        }

        return await this.request<ListCompetitionResponse>({
            method: 'GET',
            url: '/api-registrations/competition',
            headers,
        }, canceler) as ListCompetitionResponse;
    }

    /**
     * Get the form fields of the edition.
     */
    public async listFields(credentials?: ApiCredentials, canceler?: Canceler): Promise<Record<number, FieldResponse>> {
        const headers: Record<string, any> = {};

        if (credentials) {
            headers.Edition = credentials.identifier;
            headers.Authorization = credentials.apiKey;
        }

        return await this.request<Record<number, FieldResponse>>({
            method: 'GET',
            url: '/api-registrations/fields',
            headers,
        }, canceler) as Record<number, FieldResponse>;
    }
}
