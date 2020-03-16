/*
 * This file is part of the Runr package.
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
        default: () => import(/* webpackChunkName: "home" */ '@/views/Home/Home.vue'),
        toolbar: () => import(/* webpackChunkName: "home" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/editions',
      name: 'editions',
      meta: {requiresAuth: true},
      components: {
        default: () => import(/* webpackChunkName: "editions" */ '@/views/Editions/Editions.vue'),
        toolbar: () => import(/* webpackChunkName: "editions" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/editions/add',
      name: 'editions-add',
      meta: {requiresAuth: true, transitionName: 'slide'},
      components: {
        default: () => import(/* webpackChunkName: "editions" */ '@/views/Editions/EditionAdd.vue'),
        toolbar: () => import(/* webpackChunkName: "editions" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/bib-labels/print-one',
      name: 'bib-labels-print-one',
      meta: {requiresAuth: true},
      components: {
        default: () => import(/* webpackChunkName: "bib-labels" */ '@/views/BibLabels/PrintOne.vue'),
        toolbar: () => import(/* webpackChunkName: "bib-labels" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/bib-labels/print-mass',
      name: 'bib-labels-print-mass',
      meta: {requiresAuth: true},
      components: {
        default: () => import(/* webpackChunkName: "bib-labels" */ '@/views/BibLabels/PrintMass.vue'),
        toolbar: () => import(/* webpackChunkName: "bib-labels" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/participants/results',
      name: 'participants-results',
      meta: {requiresAuth: true, transitionName: 'slide'},
      components: {
        default: () => import(/* webpackChunkName: "participants" */ '@/views/Participants/Results.vue'),
        toolbar: () => import(/* webpackChunkName: "participants" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/participants/:id',
      name: 'participants-details',
      meta: {requiresAuth: true, transitionName: 'slide'},
      components: {
        default: () => import(/* webpackChunkName: "participants" */ '@/views/Participants/Details.vue'),
        toolbar: () => import(/* webpackChunkName: "participants" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/participants',
      name: 'participants',
      meta: {requiresAuth: true},
      components: {
        default: () => import(/* webpackChunkName: "participants" */ '@/views/Participants/Search.vue'),
        toolbar: () => import(/* webpackChunkName: "participants" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/settings',
      name: 'settings',
      components: {
        default: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'),
        toolbar: () => import(/* webpackChunkName: "settings" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/login',
      name: 'login',
      components: {
        default: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
        toolbar: () => import(/* webpackChunkName: "login" */'@/components/Toolbar.vue'),
      },
    },
    {
      path: '/about',
      name: 'about',
      components: {
        default: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
        toolbar: () => import(/* webpackChunkName: "about" */'@/components/Toolbar.vue'),
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
