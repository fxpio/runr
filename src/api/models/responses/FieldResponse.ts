/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {FieldChoiceResponse} from '@/api/models/responses/FieldChoiceResponse';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface FieldResponse {
    id: number;
    reportName: string;
    isSystem: boolean;
    isPermissionSlip: boolean;
    systemRole: string|null;
    type: string;
    displayOrder: number;
    price: number|null;
    canBeRetrieved: boolean;
    choices?: FieldChoiceResponse[];
}
