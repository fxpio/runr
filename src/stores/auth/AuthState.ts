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
export interface AuthState {
    authenticated: boolean;
    authenticationPending: boolean;
    fullName: string|null;
    email: string|null;
    password: string|null;
}
