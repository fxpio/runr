/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@/api/Api';
import {Database} from '@/db/Database';
import {DrawerModule} from '@/stores/drawer/DrawerModule';
import {EditionModule} from '@/stores/edition/EditionModule';
import {I18nModule} from '@/stores/i18n/I18nModule';
import {PrinterModule} from '@/stores/printer/PrinterModule';
import {RootState} from '@/stores/RootState';
import {SnackbarModule} from '@/stores/snackbar/SnackbarModule';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import Vuex, {Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.use(Vuex);

/**
 * Create the router.
 *
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export function createStore<R extends RootState>(router: VueRouter, i18n: VueI18n, api: Api, db: Database): Store<R> {
  return new Vuex.Store<R>({
    state: {} as R,
    modules: {
      drawer: new DrawerModule<R>(),
      edition: new EditionModule<R>(router, api, db),
      i18n: new I18nModule<R>(i18n),
      printer: new PrinterModule<R>(),
      snackbar: new SnackbarModule<R>(),
    },
  });
}
