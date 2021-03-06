/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Job} from '@/stores/registration/Job';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface RegistrationState {
    batchSize: number;
    pending: boolean;
    job: Job|null;
}
