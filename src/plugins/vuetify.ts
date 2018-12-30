/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import Vuetify from 'vuetify';
import vuetifyTranslationFr from '@/translations/vuetify/fr';
import 'vuetify/src/stylus/app.styl';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#00a58c',
    secondary: '#00b2a5',
    accent: '#1E88E5',
    error: '#f44336',
    warning: '#F9A825',
    info: '#4FC3F7',
    success: '#4caf50',
  },
  lang: {
    locales: {
      fr: vuetifyTranslationFr,
    },
  },
});
