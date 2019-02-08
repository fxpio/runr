/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RegistrationAnswerResponse} from '@/api/models/responses/RegistrationAnswerResponse';
import {RegistrationBibResponse} from '@/api/models/responses/RegistrationBibResponse';
import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
import BibItem from '@/bib/BibItem';
import {ICompetition} from '@/db/tables/ICompetition';
import {IField} from '@/db/tables/IField';
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class Bib extends Vue {
    public createMockBib(): BibItem {
        const bib = new BibItem();

        bib.registrationId = -1;
        bib.distance = 'Dis';
        bib.unit = 'unit';
        bib.bibNumber = '0';
        bib.firstName = 'Example';
        bib.phoneUrgency = 'Phone number';

        return bib;
    }

    /**
     * Convert the registration response into a bib item.
     */
    public async convertRegistrationToBib(reg: RegistrationResponse): Promise<BibItem> {
        const bib = new BibItem();
        bib.bibNumber = (reg.bib as RegistrationBibResponse).code;
        bib.firstName = reg.firstname;
        bib.registrationId = reg.id;

        // find competition
        const competitions: Record<number, ICompetition> = this.$store.state.edition.currentCompetitions;
        const competition = competitions[reg.competition_id] as ICompetition;

        if (competition) {
            bib.distance = competition.sportsAndDistances[0].distance;
            bib.unit = competition.sportsAndDistances[0].unit as string;

            if (competition.startBirthDate) {
                bib.startBirthDate = new Date(competition.startBirthDate);
            }

            if (competition.endBirthDate) {
                bib.endBirthDate = new Date(competition.endBirthDate);
            }
        }

        // find last phone field
        if (reg.answers) {
            const fields: Record<number, IField> = this.$store.state.edition.currentFields;
            let field: IField;

            for (const sField of Object.values(fields).reverse() as IField[]) {
                if ('PhoneNumber' === sField.type) {
                    field = sField;

                    for (const answer of reg.answers.reverse()) {
                        if (answer.field_id === sField.id) {
                            bib.phoneUrgency = answer.value as string;

                            if ((answer as RegistrationAnswerResponse).country) {
                                bib.phoneUrgency = '+' + (answer as RegistrationAnswerResponse).country
                                    + bib.phoneUrgency;
                            }
                            break;
                        }
                    }

                    break;
                }
            }
        }

        return bib;
    }
}