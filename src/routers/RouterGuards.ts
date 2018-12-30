/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RootState} from '@/stores/RootState';
import Vue from 'vue';
import Router, {RawLocation, Route} from 'vue-router';
import {Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class RouterGuards {
  /**
   * Add the auth router guard.
   *
   * @param {VueRouter}        router
   * @param {Store<RootState>} store
   */
  public static addAuthGuard(router: Router, store: Store<RootState>): void {
    router.beforeEach(async (to: Route, from: Route,
                             next: (to?: RawLocation|false|((vm: Vue) => any)|void) => void) => {
      let guard;

      if (to.matched.some((record) => record.meta.requiresEdition)) {
        await store.dispatch('edition/init');

        if (null === store.state.edition.current) {
          guard = {
            name: 'edition-add',
            params: {
              locale: store.state.i18n.locale,
            },
            query: {
              redirect: to.fullPath,
            },
          };
        }
      }

      next(guard);
    });
  }
}
