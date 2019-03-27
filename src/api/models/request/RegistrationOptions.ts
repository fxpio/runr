/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RegistrationOptionsSearch} from '@/api/models/request/RegistrationOptionsSearch';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface RegistrationOptions {
    from?: number;
    itemsPerPage?: number;
    answers?: boolean;
    orderBy?: string;
    order?: string;
    search?: RegistrationOptionsSearch;
}
