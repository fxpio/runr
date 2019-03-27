/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
import {RequestError} from '@/errors/RequestError';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class CacheResults {
    public readonly id: string;

    public readonly total: number;

    public readonly results: RegistrationResponse[];

    public readonly error: RequestError|null;

    constructor(id: string, total: number, results: RegistrationResponse[], error: RequestError|null = null) {
        this.id = id;
        this.total = total;
        this.results = results;
        this.error = error;
    }
}
