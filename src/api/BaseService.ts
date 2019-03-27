/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ApiService} from '@/api/ApiService';
import {Canceler} from '@/api/Canceler';
import {ListResponse} from '@/api/models/responses/ListResponse';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BaseService implements ApiService {
    protected readonly axios: AxiosInstance;

    /**
     * Constructor.
     *
     * @param {AxiosInstance} axiosInstance
     */
    constructor(axiosInstance: AxiosInstance) {
        this.axios = axiosInstance;
    }

    /**
     * Build and run the request.
     *
     * @param {AxiosRequestConfig} config
     * @param {Canceler}           [canceler]
     *
     * @return {Promise<T|null>}
     */
    protected async request<T>(config: AxiosRequestConfig, canceler?: Canceler): Promise<T|null> {
        if (canceler) {
            config.cancelToken = new axios.CancelToken(function executor(c) {
                canceler.setExecutor(c);
            });
        }

        try {
            const res = await this.axios.request(config);

            return res.data;
        } catch (e) {
            if (!axios.isCancel(e)) {
                throw e;
            }
        }

        return null;
    }

    /**
     * Build and run the request.
     *
     * @param {AxiosRequestConfig} config
     * @param {Canceler}           [canceler]
     *
     * @return {Promise<ListResponse<T>>}
     */
    protected async requestList<T>(config: AxiosRequestConfig, canceler?: Canceler): Promise<ListResponse<T>> {
        if (!config.method) {
            config.method = 'POST';
        }

        const res = await this.request<ListResponse<T>>(config, canceler);

        return res ? res : {results: [], resultsSize: 0, totalHits: 0} as ListResponse<T>;
    }
}
