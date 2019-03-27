/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import BibRange from '@/bib/BibRange';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class BibUtil {
    public static convertFilter(value: string|null): Array<number|BibRange> {
        const values: string[] = String(value).split(',').map((val: string) => val.trim());
        const numbers: Array<number|BibRange> = [];

        values.forEach((val: string) => {
            if (-1 !== val.indexOf('-')) {
                const ranges = val.split('-');
                const start = Number(ranges[0]);
                const end = Number(ranges[ranges.length - 1]);

                if (!isNaN(start) && !isNaN(end)) {
                    numbers.push(new BibRange(start, end));
                }
            } else if (!isNaN(Number(val))) {
                numbers.push(Number(val));
            }
        });

        return numbers;
    }
}
