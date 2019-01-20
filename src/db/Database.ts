/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ICompetition} from '@/db/tables/ICompetition';
import {IEdition} from '@/db/tables/IEdition';
import Dexie from 'dexie';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Database extends Dexie {
    public editions!: Dexie.Table<IEdition, number>;

    public competitions!: Dexie.Table<ICompetition, number>;

    constructor() {
        super('Database');

        this.version(1).stores({
            editions: 'id, name, currency, apiKey, competitions, distance, distanceUnit',
        });

        this.version(2).stores({
            competitions: 'id, editionId, name, openRegistrationDate, closeRegistrationDate, ' +
                'registrationsModificationLimit, startBirthDate, endBirthDate, participantLimit, ' +
                'sportsAndDistances, heightlevels, competitionType, startDate',
        });
    }
}
