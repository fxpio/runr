/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DarkModeModuleState} from '@/stores/darkMode/DarkModeModuleState';
import {DarkModeState} from '@/stores/darkMode/DarkModeState';
import {Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class DarkModeModule<R extends DarkModeModuleState> implements Module<DarkModeState, R> {
    public get namespaced(): boolean {
        return true;
    }

    public get state(): DarkModeState {
        const darkMode: string|null = localStorage.getItem('darkMode:enabled');

        return {
            enabled: null === darkMode ? false : 'true' === darkMode,
        };
    }

    public get mutations(): MutationTree<DarkModeState> {
        return {
            toggle(state: DarkModeState, enabled?: boolean): void {
                state.enabled = undefined === enabled ? !state.enabled : enabled;
                localStorage.setItem('darkMode:enabled', state.enabled ? 'true' : 'false');
            },
        };
    }
}