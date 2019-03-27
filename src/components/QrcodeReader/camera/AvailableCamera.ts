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
export default class AvailableCamera {
    public readonly id: string|null;

    public label: string;

    constructor(id: string|null, label: string) {
        this.id = id;
        this.label = label;
    }
}
