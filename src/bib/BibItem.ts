/*
 * This file is part of the BibScan for Njuko package.
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
    public competition?: string|number;

    public competitionUnit?: string;

    public bibNumber?: string|number;

    public firstName?: string;

    public phoneUrgency?: string;

    constructor(competition?: string|number,
                competitionUnit?: string,
                bibNumber?: string|number,
                firstName?: string,
                phoneUrgency?: string) {
        this.competition = competition;
        this.competitionUnit = competitionUnit;
        this.bibNumber = bibNumber;
        this.firstName = firstName;
        this.phoneUrgency = phoneUrgency;
    }
}
