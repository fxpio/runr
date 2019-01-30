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
export default class Camera {
    public readonly id: string;

    public readonly label: string;

    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }
}
