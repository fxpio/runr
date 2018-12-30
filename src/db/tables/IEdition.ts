/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ICompetition} from '@/db/tables/ICompetition';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface IEdition {
    id: number;
    name: string;
    currency: string;
    apiKey: string;
    competitions: ICompetition[];
    distance?: number;
    distanceUnit?: string;
}
