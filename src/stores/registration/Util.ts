/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
import {IRegistration} from '@/db/tables/IRegistration';
import {IRegistrationAnswer} from '@/db/tables/IRegistrationAnswer';
import {IRegistrationAnswerChoice} from '@/db/tables/IRegistrationAnswerChoice';
import {IRegistrationBib} from '@/db/tables/IRegistrationBib';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Util {
    public static convertRegistrations(registrations: RegistrationResponse[], syncAt: Date): IRegistration[] {
        const dRegistrations: IRegistration[] = [];

        for (const registration of registrations) {
            dRegistrations.push(Util.convertRegistration(registration, syncAt));
        }

        return dRegistrations;
    }

    public static convertRegistration(registration: RegistrationResponse, syncAt: Date): IRegistration {
        return {
            id: Number(registration.id),
            editionId: registration.edition_id,
            syncAt: syncAt.getTime(),
            registrationCode: registration.registrationCode,
            firstname: registration.firstname,
            lastname: registration.lastname,
            birthdate: registration.birthdate,
            email: registration.email,
            gender: registration.gender,
            competition_id: registration.competition_id,
            edition_id: registration.edition_id,
            answers: registration.answers as Array<IRegistrationAnswer|IRegistrationAnswerChoice>,
            order_id: registration.order_id,
            created: registration.created,
            updated: registration.updated,
            group_id: registration.group_id,
            payment_method_id: registration.payment_method_id,
            paymentStatus: registration.paymentStatus,
            permissionSlipStatus: registration.permissionSlipStatus,
            permissionSlipNotes: registration.permissionSlipNotes,
            permissionSlipValidUntil: registration.permissionSlipValidUntil,
            permissionSlipSports: registration.permissionSlipSports,
            permission_slip: registration.permission_slip,
            status: registration.status,
            statusIsForced: registration.statusIsForced,
            isRegistered: registration.isRegistered,
            isRegisteredIsForced: registration.isRegisteredIsForced,
            bib: registration.bib as IRegistrationBib|null,
            hasBib: registration.hasBib,
            paid: registration.paid,
            amount: registration.amount,
            balance: registration.balance,
            additionalPermissionSlips: registration.additionalPermissionSlips,
            registration_code: registration.registration_code,
            imported: registration.imported,
            imported_on: registration.imported_on,
            reductions: registration.reductions,
            registrationDate: registration.registrationDate,
            paymentNotes: registration.paymentNotes,
            paymentBanks: registration.paymentBanks,
            paymentReferences: registration.paymentReferences,
            bibRetrieved: registration.bibRetrieved,
            campaign: registration.campaign,
            language: registration.language,
            needPermissionSlipValidation: registration.needPermissionSlipValidation,
            nbPermissionSlipToValidate: registration.nbPermissionSlipToValidate,
            comment: registration.comment,
            activationCode: registration.activationCode,
            facebookToken: registration.facebookToken,
            similarRegistrations: registration.similarRegistrations,
            previousRegistrationId: registration.previousRegistrationId,
            team_position: registration.team_position,
            bibRetrievedAt: registration.bibRetrievedAt,
            fromApi: registration.fromApi,
            extendedData: registration.extendedData,
            isInsured: registration.isInsured,
            clientExternalID: registration.clientExternalID,
        };
    }
}
