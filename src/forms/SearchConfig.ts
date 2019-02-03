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
export default class SearchConfig {
    public readonly registrationId: string|null;
    public readonly searchValue: string;
    public readonly selectedCompetition: number[];
    public readonly startPagination: number;

    constructor(registrationId: string|null,
                searchValue: string = '',
                selectedCompetition: number[] = [],
                startPagination: number = 1) {
        this.registrationId = registrationId;
        this.searchValue = searchValue;
        this.selectedCompetition = selectedCompetition;
        this.startPagination = startPagination;
    }
}
