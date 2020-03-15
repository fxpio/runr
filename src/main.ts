/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@/registerHooks';
import ApiInterceptors from '@/api/ApiInterceptors';
import {useVueRouterBackPlugin} from '@/plugins/vueRouterBack';
import RouterGuards from '@/routers/RouterGuards';
import {RootState} from '@/stores/RootState';
import Vue from 'vue';
import '@/plugins/veeValidate';
import '@/plugins/vueMeta';
import vuetify from '@/plugins/vuetify';
import '@/plugins/vueLongClick';
import i18n from '@/plugins/vueI18n';
import apiClient from '@/plugins/vueApi';
import dbClient from '@/plugins/vueDb';
import snackbar from '@/plugins/vueSnackbar';
import App from '@/App.vue';
import router from '@/router';
import {createStore} from '@/store';
import '@/registerServiceWorker';
import '@/styles/fonts.scss';
import '@/styles/app.scss';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.config.productionTip = false;
useVueRouterBackPlugin({router, forceHistory: true});

const store = createStore<RootState>(router, i18n, apiClient, dbClient, snackbar);

RouterGuards.addAuthGuard(router, store);
RouterGuards.addAuthEditionGuard(router, store);
ApiInterceptors.addAuthEditionInterceptor(apiClient, store);

new Vue({
    i18n,
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
