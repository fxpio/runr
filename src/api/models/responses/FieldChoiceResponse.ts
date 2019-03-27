/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface FieldChoiceResponse {
    id: number;
    reportName: string;
    isSystem: boolean;
    systemRole: string|null;
    displayOrder: number;
    price: number|null;
}
