/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {IRegistrationAnswerBase} from '@/db/tables/IRegistrationAnswerBase';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface IRegistrationAnswer extends IRegistrationAnswerBase {
    value: string;
    country: string;
    aal1: string|null;
    aal2: string|null;
    lat: number|null;
    lng: number|null;
    locality: string|null;
    postal_code: string|null;
    type: string|null;
    street_number: string|null;
    route: string|null;
    mutation: string|null;
    certifComp: boolean;
    validatedSeason: number;
    ageCategory: string|null;
    licenseValidationDate: string|null;
    nationality: string|null;
    countRetrieved: number;
}
