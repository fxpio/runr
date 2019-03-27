/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ICompetitionSimple} from '@/db/tables/ICompetitionSimple';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface IEdition {
    id: number;
    name: string;
    currency?: string;
    apiKey: string;
    competitions: ICompetitionSimple[];
    isLoaded: boolean;
}
