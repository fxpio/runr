/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {PrinterState} from '@/stores/printer/PrinterState';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export interface PrinterModuleState {
    printer: PrinterState;
}
