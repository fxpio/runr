/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CompetitionResponse} from '@/api/models/responses/CompetitionResponse';
import {CompetitionSimpleResponse} from '@/api/models/responses/CompetitionSimpleResponse';
import {EditionResponse} from '@/api/models/responses/EditionResponse';
import {FieldResponse} from '@/api/models/responses/FieldResponse';
import {OrganizationEditionResponse} from '@/api/models/responses/OrganizationEditionResponse';
import {ICompetition} from '@/db/tables/ICompetition';
import {ICompetitionSimple} from '@/db/tables/ICompetitionSimple';
import {ICompetitionSport} from '@/db/tables/ICompetitionSport';
import {IEdition} from '@/db/tables/IEdition';
import {IField} from '@/db/tables/IField';
import {IFieldChoice} from '@/db/tables/IFieldChoice';
import {EditionState} from '@/stores/edition/EditionState';
import {Commit} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Util {
    public static async getOne(commit: Commit, state: EditionState, id: number|null,
                               findFirst: boolean = false, force: boolean = false): Promise<IEdition|null> {
        let current = state.current;

        if (!force && current && id && current.id === id) {
            return current;
        }

        if (current && id !== current.id) {
            current = null;
        }

        if (null === current || force) {
            if (id) {
                for (const edition of state.all) {
                    if (id === edition.id) {
                        current = edition;
                        break;
                    }
                }
            }

            if (null === current && findFirst) {
                current = state.all.length > 0 ? state.all[0] : null;
            }
        }

        return current;
    }

    public static convertOrganizationEditions(editions: Record<number, OrganizationEditionResponse>): IEdition[] {
        const dEditions: IEdition[] = [];

        for (const edition of Object.values(editions)) {
            dEditions.push({
                id: Number(edition.id),
                name: edition.name,
                competitions: Util.convertCompetitionSimples(edition.competitions),
                apiKey: edition.apiKey,
                isLoaded: false,
            });
        }

        return dEditions;
    }

    public static convertEdition(edition: EditionResponse, apiKey: string): IEdition {
        return {
            id: Number(edition.id),
            name: edition.name,
            currency: edition.currency,
            competitions: Util.convertCompetitionSimples(edition.competitions),
            isLoaded: true,
            apiKey,
        };
    }

    public static convertCompetitionSimples(competitions: CompetitionSimpleResponse[]): ICompetitionSimple[] {
        const dCompetitions: ICompetitionSimple[] = [];

        for (const comp of competitions) {
            dCompetitions.push({
                id: Number(comp.id),
                name: comp.name,
            } as ICompetitionSimple);
        }

        return dCompetitions;
    }

    public static convertCompetitions(competitions: CompetitionResponse[],
                                      editionId: number): Record<number, ICompetition> {
        const dCompetitions: Record<number, ICompetition> = {};

        for (const comp of competitions) {
            dCompetitions[comp.id] = {
                editionId,
                id: Number(comp.id),
                name: comp.name,
                openRegistrationDate: comp.openRegistrationDate,
                closeRegistrationDate: comp.closeRegistrationDate,
                registrationsModificationLimit: comp.registrationsModificationLimit,
                startBirthDate: comp.startBirthDate,
                endBirthDate: comp.endBirthDate,
                participantLimit: comp.participantLimit,
                sportsAndDistances: comp.sportsAndDistances as ICompetitionSport[],
                heightlevels: comp.heightlevels,
                competitionType: comp.competitionType,
                startDate: comp.startDate,
            } as ICompetition;
        }

        return dCompetitions;
    }

    public static convertFields(fields: Record<number, FieldResponse>, editionId: number): IField[] {
        const dFields: IField[] = [];

        for (const field of Object.values(fields)) {
            dFields.push({
                editionId,
                id: Number(field.id),
                reportName: field.reportName,
                isSystem: field.isSystem,
                isPermissionSlip: field.isPermissionSlip,
                systemRole: field.systemRole,
                type: field.type,
                displayOrder: field.displayOrder,
                price: field.price,
                canBeRetrieved: field.canBeRetrieved,
                choices: field.choices as IFieldChoice[],
            } as IField);
        }

        return dFields;
    }
}
