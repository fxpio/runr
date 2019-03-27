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
export default class RegistrationStatusItem {
    public readonly value: boolean;

    public readonly label: string;

    constructor(value: boolean, label: string) {
        this.value = value;
        this.label = label;
    }
}
