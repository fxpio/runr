/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VueRouterBack from '@/routers/VueRouterBack';
import Vue from 'vue';
import VueRouter from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */

export function useVueRouterBackPlugin(router: VueRouter): void {
    Vue.use(VueRouterBack, router);
}
