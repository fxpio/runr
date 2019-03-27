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
export default class BibRange {
    public readonly start: number;

    public readonly end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}
