/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RegistrationAnswerChoiceResponse} from '@/api/models/responses/RegistrationAnswerChoiceResponse';
import {RegistrationAnswerResponse} from '@/api/models/responses/RegistrationAnswerResponse';
import {IField} from '@/db/tables/IField';
import {Answer} from '@/stores/edition/Answer';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class AnswerConverter {
    public static convertAll(fields: Record<number, IField>,
                             answers: RegistrationAnswerResponse[]|RegistrationAnswerChoiceResponse[]): Answer[] {
        const values: Answer[] = [];

        for (const answer of answers) {
            if (fields[answer.field_id]) {
                const field = fields[answer.field_id];
                values.push(AnswerConverter.convert(field, answer));
            }
        }

        return values;
    }

    public static convert(field: IField,
                          answer: RegistrationAnswerResponse|RegistrationAnswerChoiceResponse): Answer {
        let value: string|string[]|null;

        switch (field.type) {
            case 'PhoneNumber':
                value = answer.value
                    ? '+' + (answer as RegistrationAnswerResponse).country + ' ' + answer.value
                    : '';
                break;

            case 'Select':
            case 'Radio':
                value = answer.value as string[];
                break;

            case 'FftriLicence':
            case 'FFALicence2':
            case 'Address':
            case 'Text':
            default:
                value = answer.value;
                break;
        }

        return new Answer(answer.id, field.reportName, value);
    }
}
