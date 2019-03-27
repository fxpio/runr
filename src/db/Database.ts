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
import {IRegistration} from '@/db/tables/IRegistration';
import Dexie from 'dexie';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Database extends Dexie {
    public editions!: Dexie.Table<IEdition, number>;

    public competitions!: Dexie.Table<ICompetition, number>;

    public fields!: Dexie.Table<IField, number>;

    public registrations!: Dexie.Table<IRegistration, number>;

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

        this.version(3).stores({
            fields: 'id, editionId, reportName, isSystem, isPermissionSlip, systemRole, type, ' +
                'displayOrder, price, canBeRetrieved, choices',
        });

        this.version(4).stores({
            registrations: 'id, editionId, syncAt, registrationCode, firstname, lastname, birthdate, email, ' +
                'gender, competition_id, answers, order_id, created, updated, group_id, status, ' +
                'isRegistered, bib, hasBib, paid, amount, balance, bibRetrieved, language',
        });
    }
}
