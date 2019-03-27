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
export class AuthCredentials extends Credentials {
    public readonly fullName: string;

    public readonly email: string|null;

    public readonly password: string|null;

    public readonly mustBeSaved: boolean;

    public readonly redirect: string|false|null;

    constructor(fullName: string, email: string|null = null, password: string|null = null,
                mustBeSaved: boolean = false, redirect: string|false|null = null) {
        super();
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.mustBeSaved = mustBeSaved;
        this.redirect = redirect;
    }
}
