/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {IRegistrationAnswer} from '@/db/tables/IRegistrationAnswer';
import {IRegistrationAnswerChoice} from '@/db/tables/IRegistrationAnswerChoice';
import {IRegistrationBib} from '@/db/tables/IRegistrationBib';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface IRegistration {
    id: number;
    editionId: number;
    syncAt: number;
    registrationCode: string;
    firstname: string;
    lastname: string;
    birthdate: string;
    email: string;
    gender: string;
    competition_id: number;
    edition_id: number;
    answers?: Array<IRegistrationAnswer|IRegistrationAnswerChoice>;
    order_id: number;
    created: number;
    updated: number;
    group_id: number;
    payment_method_id: number;
    paymentStatus: number;
    permissionSlipStatus: number;
    permissionSlipNotes: string;
    permissionSlipValidUntil: number;
    permissionSlipSports: any[];
    permission_slip: any|null;
    status: number;
    statusIsForced: boolean;
    isRegistered: boolean;
    isRegisteredIsForced: boolean;
    bib: IRegistrationBib|null;
    hasBib: boolean;
    paid: number;
    amount: number;
    balance: number;
    additionalPermissionSlips: any[];
    registration_code: string;
    imported: boolean;
    imported_on: any|null;
    reductions: any[];
    registrationDate: number;
    paymentNotes: any[];
    paymentBanks: any[];
    paymentReferences: number[];
    bibRetrieved: boolean;
    campaign: any|null;
    language: number;
    needPermissionSlipValidation: boolean;
    nbPermissionSlipToValidate: number;
    comment: string;
    activationCode: string;
    facebookToken: string;
    similarRegistrations: number[];
    previousRegistrationId: number;
    team_position: number[];
    bibRetrievedAt: number;
    fromApi: boolean;
    extendedData: any[];
    isInsured: boolean;
    clientExternalID: string|null;
}
