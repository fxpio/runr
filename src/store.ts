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
import {AuthModule} from '@/stores/auth/AuthModule';
import {AuthModuleState} from '@/stores/auth/AuthModuleState';
import {DarkModeModule} from '@/stores/darkMode/DarkModeModule';
import {DarkModeModuleState} from '@/stores/darkMode/DarkModeModuleState';
import {DrawerModule} from '@/stores/drawer/DrawerModule';
import {DrawerModuleState} from '@/stores/drawer/DrawerModuleState';
import {EditionModule} from '@/stores/edition/EditionModule';
import {EditionModuleState} from '@/stores/edition/EditionModuleState';
import {I18nModule} from '@/stores/i18n/I18nModule';
import {I18nModuleState} from '@/stores/i18n/I18nModuleState';
import {PrinterModule} from '@/stores/printer/PrinterModule';
import {PrinterModuleState} from '@/stores/printer/PrinterModuleState';
import {SnackbarModule} from '@/stores/snackbar/SnackbarModule';
import {SnackbarModuleState} from '@/stores/snackbar/SnackbarModuleState';
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
export function createStore<R extends
                            DarkModeModuleState
                          & DrawerModuleState
                          & AuthModuleState
                          & EditionModuleState
                          & I18nModuleState
                          & PrinterModuleState
                          & SnackbarModuleState>(router: VueRouter, i18n: VueI18n, api: Api, db: Database): Store<R> {
  return new Vuex.Store<R>({
    state: {} as R,
    modules: {
      darkMode: new DarkModeModule<R>(),
      drawer: new DrawerModule<R>(),
      auth: new AuthModule<R>(router, api, db),
      edition: new EditionModule<R>(router, api, db),
      i18n: new I18nModule<R>(i18n),
      printer: new PrinterModule<R>(),
      snackbar: new SnackbarModule<R>(),
    },
  });
}
