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
import {RegistrationOptions} from '@/api/models/request/RegistrationOptions';
import {ListResponse} from '@/api/models/responses/ListResponse';
import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Registration extends BaseService {
    /**
     * @inheritDoc
     */
    public static getName() {
        return 'Registration';
    }

    /**
     * Get the editions of the organization.
     */
    public async list(options?: RegistrationOptions,
                      canceler?: Canceler): Promise<ListResponse<RegistrationResponse>> {
        return await this.request<ListResponse<RegistrationResponse>>({
            method: 'POST',
            url: '/api-registrations/registrations',
            data: options,
        }, canceler) as ListResponse<RegistrationResponse>;
    }
}