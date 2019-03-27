/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BibModuleState} from '@/stores/bib/BibModuleState';
import {BibState} from '@/stores/bib/BibState';
import {GetterTree, Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class BibModule<R extends BibModuleState> implements Module<BibState, R> {
    private static readonly DISTANCE_ALIASES: Record<string, string> = {
        '42 km': 'M',
        '21 km': 'SM',
    };

    private readonly storage: Storage;

    public constructor(storage?: Storage) {
        this.storage = storage ? storage : localStorage;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): BibState {
        const useAlias = this.storage.getItem('bib:useAlias');
        const startPrintingImmediately = this.storage.getItem('bib:startPrintingImmediately');

        return {
            useAlias: null === useAlias ? true : 'true' === useAlias,
            startPrintingImmediately: null === startPrintingImmediately ? true : 'true' === startPrintingImmediately,
        };
    }

    public get getters(): GetterTree<BibState, R> {
        return {
            getAlias() {
                return (distance: number, unit: string): string => {
                    return BibModule.DISTANCE_ALIASES[distance + ' ' + unit];
                };
            },
        };
    }

    public get mutations(): MutationTree<BibState> {
        const self = this;

        return {
            toggleUseAlias(state: BibState, useAlias?: boolean): void {
                state.useAlias = undefined === useAlias ? !state.useAlias : useAlias;
                self.storage.setItem('bib:useAlias', state.useAlias ? 'true' : 'false');
            },
            toggleStartPrintingImmediately(state: BibState, startPrinting?: boolean): void {
                state.startPrintingImmediately = undefined === startPrinting
                    ? !state.startPrintingImmediately
                    : startPrinting;
                self.storage.setItem('bib:startPrintingImmediately', state.startPrintingImmediately ? 'true' : 'false');
            },
        };
    }
}
