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
export interface RegistrationOptionsSearch {
    id?: number;
    registrationCode?: string;
    order_id?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    date_from?: string;
    date_to?: string;
    competition?: number[];
    gender?: string;
    registered?: string;
    not_registered?: string;
    bibNumber?: number|string;
}
