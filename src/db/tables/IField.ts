/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {IFieldChoice} from '@/db/tables/IFieldChoice';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface IField {
    id: number;
    editionId: number;
    reportName: string;
    isSystem: boolean;
    isPermissionSlip: boolean;
    systemRole: string|null;
    type: string;
    displayOrder: number;
    price: number|null;
    canBeRetrieved: boolean;
    choices?: IFieldChoice[];
}
