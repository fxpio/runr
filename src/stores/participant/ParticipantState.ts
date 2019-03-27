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

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface ParticipantState {
    pageSize: number;
    cacheSearchConfig: SearchConfig|null;
    cacheResults: CacheResults|null;
    cacheSelection: RegistrationResponse|null;
}
