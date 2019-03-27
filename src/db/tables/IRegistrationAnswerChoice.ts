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
export interface IRegistrationAnswerChoice extends IRegistrationAnswerBase {
    value: string[];
    ids: number[];
}
