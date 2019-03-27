/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DateTimeResponse} from '@/api/models/responses/DateTimeResponse';
import {EditionResponse} from '@/api/models/responses/EditionResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface PingEditionResponse {
    edition: EditionResponse;
    dateTime: DateTimeResponse;
}
