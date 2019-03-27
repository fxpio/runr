/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CompetitionSimpleResponse} from '@/api/models/responses/CompetitionSimpleResponse';
import {CompetitionSportResponse} from '@/api/models/responses/CompetitionSportResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface CompetitionResponse extends CompetitionSimpleResponse {
    openRegistrationDate: string;
    closeRegistrationDate: string;
    registrationsModificationLimit: string;
    startBirthDate: string|null;
    endBirthDate: string|null;
    participantLimit: number;
    sportsAndDistances: CompetitionSportResponse[];
    heightlevels: any[];
    competitionType: string;
    startDate: string;
}
