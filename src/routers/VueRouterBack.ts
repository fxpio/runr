/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RouterBack} from '@/routers/RouterBack';
import _Vue, {PluginObject} from 'vue';
import {VueRouter} from 'vue-router/types/router';

/**
 * Router back vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
class VueRouterBack {
    public static get plugin(): PluginObject<VueRouter> {
        return {
            install: (Vue: typeof _Vue, options?: VueRouter): void => {
                if (options) {
                    Vue.prototype.$routerBack = new RouterBack(options);
                }
            },
        };
    }
}

export default VueRouterBack.plugin;
