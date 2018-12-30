/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import translationEn from '@/translations/en';
import translationFr from '@/translations/fr';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
Vue.use(VueI18n);

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  missing: (locale, key) => {
    console.warn(`I18n :: Key "${key}" is missing for locale "${locale}"`);
  },
  messages: {
    en: translationEn,
    fr: translationFr,
  },
});
