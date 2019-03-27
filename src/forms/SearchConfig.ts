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
export default class SearchConfig {
    public readonly id: string;

    public readonly searchValue: string;

    public readonly selectedCompetitions: number[];

    public readonly startPagination: number;

    constructor(searchValue: string = '',
                selectedCompetitions: number[] = [],
                startPagination: number = 1) {
        this.id = searchValue + ':' + selectedCompetitions.join(',') + ':' + startPagination;
        this.searchValue = searchValue;
        this.selectedCompetitions = selectedCompetitions;
        this.startPagination = startPagination;
    }
}
