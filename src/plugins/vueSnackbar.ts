/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackbarManager} from '@/snackbars/SnackbarManager';
import VueSnackbar from '@/snackbars/VueSnackbar';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
const snackbarManager = new SnackbarManager();

Vue.use(VueSnackbar, snackbarManager);

export default snackbarManager;
