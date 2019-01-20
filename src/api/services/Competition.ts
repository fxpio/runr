/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseService} from '@/api/BaseService';
import {Canceler} from '@/api/Canceler';
import {Credentials} from '@/api/Credentials';
import {ListCompetitionResponse} from '@/api/models/responses/ListCompetitionResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Competition extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'Competition';
    }

    /**
     * Get the competitions of the edition.
     */
    public async list(credentials?: Credentials, canceler?: Canceler): Promise<ListCompetitionResponse> {
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
}
