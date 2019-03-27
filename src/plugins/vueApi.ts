/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@/api/Api';
import VueApi from '@/api/VueApi';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
const apiClient = new Api(process.env.VUE_APP_API_URL);

Vue.use(VueApi, apiClient);

export default apiClient;
