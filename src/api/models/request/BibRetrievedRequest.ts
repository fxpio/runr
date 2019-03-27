/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ChangeRegistrationRequest} from '@/api/models/request/ChangeRegistrationRequest';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BibRetrievedRequest implements ChangeRegistrationRequest {
    public readonly regid: number;

    public readonly description: string;

    public readonly who: string;

    public readonly date: string;

    public readonly data: string;

    constructor(registrationId: number, who: string, date: Date, retrieved: boolean = true) {
        this.regid = registrationId;
        this.description = 'bibRetrieved';
        this.who = who;
        this.date = date.toISOString();
        this.data = retrieved ? '1' : '0';
    }
}
