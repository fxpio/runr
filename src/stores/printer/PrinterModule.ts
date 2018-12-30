/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {PrinterModuleState} from '@/stores/printer/PrinterModuleState';
import {PrinterState} from '@/stores/printer/PrinterState';
import {Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class PrinterModule<R extends PrinterModuleState> implements Module<PrinterState, R> {
    public get namespaced(): boolean {
        return true;
    }

    public get state(): PrinterState {
        return {
            closeAfterPrint: null === localStorage.getItem('printer:closeAfterPrint')
                ? true
                : 'true' === (localStorage.getItem('printer:closeAfterPrint')),
        };
    }

    public get mutations(): MutationTree<PrinterState> {
        return {
            toggle(state: PrinterState, closeAfterPrint?: boolean): void {
                state.closeAfterPrint = undefined === closeAfterPrint ? !state.closeAfterPrint : closeAfterPrint;
                localStorage.setItem('printer:closeAfterPrint', state.closeAfterPrint ? 'true' : 'false');
            },
        };
    }
}
