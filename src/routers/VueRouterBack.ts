/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RouterBack} from '@/routers/RouterBack';
import {RouterBackOptions} from '@/routers/RouterBackOptions';
import _Vue, {PluginObject} from 'vue';

/**
 * Router back vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
class VueRouterBack {
    public static get plugin(): PluginObject<RouterBackOptions> {
        return {
            install: (Vue: typeof _Vue, options?: RouterBackOptions): void => {
                if (options) {
                    Vue.prototype.$routerBack = new RouterBack(options);
                }
            },
        };
    }
}

export default VueRouterBack.plugin;
