/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@/api/Api';
import {RootState} from '@/stores/RootState';
import {AxiosRequestConfig} from 'axios';
import {Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class ApiInterceptors {
    /**
     * Add the auth interceptor.
     *
     * @param {Api}              apiClient
     * @param {Store<RootState>} store
     */
    public static addAuthInterceptor(apiClient: Api, store: Store<RootState>): void {
        apiClient.addRequestInterceptor(async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
            await store.dispatch('edition/init');

            if (!config.auth && !config.headers.Authorization && store.state.edition.current) {
                config.headers.Edition = store.state.edition.current.id;
                config.headers.Authorization = store.state.edition.current.apiKey;
            }

            if (config.auth && 0 === Object.keys(config.auth as object).length) {
                config.auth = undefined;
            }

            return config;
        });
    }
}
