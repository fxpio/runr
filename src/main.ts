/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'babel-polyfill';
import '@/registerHooks';
import ApiInterceptors from '@/api/ApiInterceptors';
import {useVueRouterBackPlugin} from '@/plugins/vueRouterBack';
import RouterGuards from '@/routers/RouterGuards';
import {RootState} from '@/stores/RootState';
import Vue from 'vue';
import '@/plugins/veeValidate';
import '@/plugins/vueEventBus';
import '@/plugins/vueMeta';
import '@/plugins/vuetify';
import i18n from '@/plugins/vueI18n';
import apiClient from '@/plugins/vueApi';
import dbClient from '@/plugins/vueDb';
import App from '@/App.vue';
import router from '@/router';
import {createStore} from '@/store';
import '@/registerServiceWorker';
import '@/styles/app.scss';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.config.productionTip = false;
useVueRouterBackPlugin(router);

const store = createStore<RootState>(router, i18n, apiClient, dbClient);

RouterGuards.addAuthGuard(router, store);
ApiInterceptors.addAuthInterceptor(apiClient, store);

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
