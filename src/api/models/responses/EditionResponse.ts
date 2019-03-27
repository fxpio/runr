/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CompetitionSimpleResponse} from '@/api/models/responses/CompetitionSimpleResponse';
import {UserResponse} from '@/api/models/responses/UserResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface EditionResponse {
    id: number;
    name: string;
    currency: string;
    competitions: CompetitionSimpleResponse[];
    users: UserResponse[];
}
