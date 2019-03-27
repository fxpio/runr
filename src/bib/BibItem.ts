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
export default class BibItem {
    public distance?: string;

    public unit?: string;

    public bibNumber?: string;

    public firstName?: string;

    public phoneUrgency?: string;

    public startBirthDate?: Date;

    public endBirthDate?: Date;

    public registrationId?: number;

    constructor(distance?: string,
                unit?: string,
                bibNumber?: string,
                firstName?: string,
                phoneUrgency?: string,
                startBirthDate?: Date|string,
                endBirthDate?: Date|string,
                registrationId?: number) {
        this.distance = distance;
        this.unit = unit;
        this.bibNumber = bibNumber;
        this.firstName = firstName;
        this.phoneUrgency = phoneUrgency;
        this.startBirthDate = typeof startBirthDate === 'string' ? new Date(startBirthDate) : startBirthDate;
        this.endBirthDate = typeof endBirthDate === 'string' ? new Date(endBirthDate) : endBirthDate;
        this.registrationId = registrationId;
    }
}
