/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Database} from '@/db/Database';
import _Vue, {PluginObject} from 'vue';

/**
 * Database vue plugin.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
class VueDb {
    public static get plugin(): PluginObject<Database> {
        return {
            install: (Vue: typeof _Vue, options?: Database): void => {
                Vue.prototype.$db = options;
            },
        };
    }
}

export default VueDb.plugin;
