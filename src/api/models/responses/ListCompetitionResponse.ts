/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CompetitionResponse} from '@/api/models/responses/CompetitionResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface ListCompetitionResponse {
    id: number;
    name: string;
    competitions: CompetitionResponse[];
}
