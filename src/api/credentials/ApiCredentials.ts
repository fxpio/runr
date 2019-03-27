/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Credentials} from '@/api/credentials/Credentials';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ApiCredentials extends Credentials {
    public readonly identifier: string;

    public readonly apiKey: string;

    public readonly redirect: string|false|null;

    constructor(identifier: string, apiKey: string, redirect: string|false|null = null) {
        super();
        this.identifier = identifier;
        this.apiKey = apiKey;
        this.redirect = redirect;
    }
}
