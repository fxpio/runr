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
import {AuthCredentials} from '@/api/credentials/AuthCredentials';
import {OrganizationEditionResponse} from '@/api/models/responses/OrganizationEditionResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Organization extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'Organization';
    }

    /**
     * Get the editions of the organization.
     */
    public async listEditions(credentials: AuthCredentials,
                              canceler?: Canceler): Promise<Record<number, OrganizationEditionResponse>> {
        return await this.request<Record<number, OrganizationEditionResponse>>({
            method: 'GET',
            url: '/api-organisation',
            headers: {
                Email: credentials.email,
                Password: credentials.password,
            },
        }, canceler) as Record<number, OrganizationEditionResponse>;
    }
}
