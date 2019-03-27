/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ICompetition} from '@/db/tables/ICompetition';
import {IEdition} from '@/db/tables/IEdition';
import {IField} from '@/db/tables/IField';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface EditionState {
    initialized: boolean;
    all: IEdition[];
    current: IEdition|null;
    currentCompetitions: Record<number, ICompetition>|null;
    currentFields: Record<number, IField>|null;
    serverPending: boolean;
}
