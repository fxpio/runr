/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Api} from '@/api/Api';
import {Database} from '@/db/Database';
import {SnackbarManager} from '@/snackbars/SnackbarManager';
import {AuthModule} from '@/stores/auth/AuthModule';
import {AuthModuleState} from '@/stores/auth/AuthModuleState';
import {BibModule} from '@/stores/bib/BibModule';
import {BibModuleState} from '@/stores/bib/BibModuleState';
import {DarkModeModule} from '@/stores/darkMode/DarkModeModule';
import {DarkModeModuleState} from '@/stores/darkMode/DarkModeModuleState';
import {DrawerModule} from '@/stores/drawer/DrawerModule';
import {DrawerModuleState} from '@/stores/drawer/DrawerModuleState';
import {EditionModule} from '@/stores/edition/EditionModule';
import {EditionModuleState} from '@/stores/edition/EditionModuleState';
import {I18nModule} from '@/stores/i18n/I18nModule';
import {I18nModuleState} from '@/stores/i18n/I18nModuleState';
import {ParticipantModule} from '@/stores/participant/ParticipantModule';
import {ParticipantModuleState} from '@/stores/participant/ParticipantModuleState';
import {RegistrationModule} from '@/stores/registration/RegistrationModule';
import {RegistrationModuleState} from '@/stores/registration/RegistrationModuleState';
import {ScannerModule} from '@/stores/scanner/ScannerModule';
import {ScannerModuleState} from '@/stores/scanner/ScannerModuleState';
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
                            AuthModuleState
                          & BibModuleState
                          & DarkModeModuleState
                          & DrawerModuleState
                          & EditionModuleState
                          & I18nModuleState
                          & ParticipantModuleState
                          & RegistrationModuleState
                          & ScannerModuleState>(router: VueRouter,
                                                i18n: VueI18n,
                                                api: Api,
                                                db: Database,
                                                snackbar: SnackbarManager): Store<R> {
  return new Vuex.Store<R>({
    state: {} as R,
    modules: {
      auth: new AuthModule<R>(router, api, db),
      bib: new BibModule<R>(),
      darkMode: new DarkModeModule<R>(),
      drawer: new DrawerModule<R>(),
      edition: new EditionModule<R>(router, api, db, snackbar),
      i18n: new I18nModule<R>(i18n),
      participant: new ParticipantModule<R>(router),
      registration: new RegistrationModule<R>(api, db, snackbar),
      scanner: new ScannerModule<R>(),
    },
  });
}
