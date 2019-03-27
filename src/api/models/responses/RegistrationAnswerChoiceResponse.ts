/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RegistrationAnswerBaseResponse} from '@/api/models/responses/RegistrationAnswerBaseResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface RegistrationAnswerChoiceResponse extends RegistrationAnswerBaseResponse {
    value: string[];
    ids: number[];
}
