/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosError, AxiosResponse} from 'axios';
import Vue from 'vue';

/**
 *  Get the error message of the request.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function getRequestErrorMessage(vue: Vue, err: Error, isAuth: boolean = false): string {
    const i18n = null !== vue.$i18n ? vue.$i18n : vue.$root.$i18n;

    if ((err as AxiosError).response && ((err as AxiosError).response as AxiosResponse).status) {
        if (((err as AxiosError).response as AxiosResponse)
                && ((err as AxiosError).response as AxiosResponse).data
                && ((err as AxiosError).response as AxiosResponse).data.detail) {
            return ((err as AxiosError).response as AxiosResponse).data.detail;
        } else if (((err as AxiosError).response as AxiosResponse).status === 403) {
            return i18n.t('error.invalid-' + (isAuth ? 'credentials' : 'authorization')) as string;
        }
    }

    return i18n.t('error.network') as string;
}
