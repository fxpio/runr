/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@/api/Api';
import _Vue, {PluginObject} from 'vue';

/**
 * Api vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
class VueApi {
    public static get plugin(): PluginObject<Api> {
        return {
            install: (Vue: typeof _Vue, options?: Api): void => {
                Vue.prototype.$api = options;
            },
        };
    }
}

export default VueApi.plugin;
