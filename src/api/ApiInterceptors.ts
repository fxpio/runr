/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@/api/Api';
import {EditionModuleState} from '@/stores/edition/EditionModuleState';
import {AxiosRequestConfig} from 'axios';
import {Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class ApiInterceptors {
    /**
     * Add the auth edition interceptor.
     */
    public static addAuthEditionInterceptor(apiClient: Api, store: Store<EditionModuleState>): void {
        apiClient.addRequestInterceptor(async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
            config.headers = config.headers || {};
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
