/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import Router from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '',
      redirect: 'home',
    },
    {
      path: '/home',
      name: 'home',
      components: {
        default: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        toolbar: () => import(/* webpackChunkName: "home" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/editions',
      name: 'editions',
      components: {
        default: () => import(/* webpackChunkName: "editions" */ '@/views/Editions/Editions.vue'),
        toolbar: () => import(/* webpackChunkName: "editions" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/editions/add',
      name: 'edition-add',
      meta: {transitionName: 'slide'},
      components: {
        default: () => import(/* webpackChunkName: "editions" */ '@/views/Editions/EditionAdd.vue'),
        toolbar: () => import(/* webpackChunkName: "editions" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '*',
      name: 'not-found',
      components: {
        default: () => import('@/views/NotFound.vue'),
        toolbar: () => import('@/components/Toolbar.vue'),
      },
    },
  ],
});
