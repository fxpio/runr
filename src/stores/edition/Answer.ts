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
export class Answer {
    public readonly id: number;

    public readonly name: string;

    public readonly value: string|string[]|null;

    constructor(id: number, name: string, value: string|string[]|null) {
        this.id = id;
        this.name = name;
        this.value = value;
    }

    public get isArray(): boolean {
        return typeof this.value !== 'string';
    }
}
