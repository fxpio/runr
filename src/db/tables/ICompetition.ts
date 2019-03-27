/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ICompetitionSimple} from '@/db/tables/ICompetitionSimple';
import {ICompetitionSport} from '@/db/tables/ICompetitionSport';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface ICompetition extends ICompetitionSimple {
    editionId: number;
    openRegistrationDate: string;
    closeRegistrationDate: string;
    registrationsModificationLimit: string;
    startBirthDate: string|null;
    endBirthDate: string|null;
    participantLimit: number;
    sportsAndDistances: ICompetitionSport[];
    heightlevels: any[];
    competitionType: string;
    startDate: string;
}
