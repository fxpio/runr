/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ScannerModuleState} from '@/stores/scanner/ScannerModuleState';
import {ScannerState} from '@/stores/scanner/ScannerState';
import {Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class ScannerModule<R extends ScannerModuleState> implements Module<ScannerState, R> {
    private readonly storage: Storage;

    public constructor(storage?: Storage) {
        this.storage = storage ? storage : localStorage;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): ScannerState {
        const lastCameraId = this.storage.getItem('scanner:lastCameraId');

        return {
            lastCameraId: lastCameraId ? lastCameraId : null,
        };
    }

    public get mutations(): MutationTree<ScannerState> {
        const self = this;

        return {
            setLastCameraId(state: ScannerState, cameraId: string|null): void {
                state.lastCameraId = cameraId ? cameraId : null;

                if (cameraId) {
                    self.storage.setItem('scanner:lastCameraId', cameraId);
                } else {
                    self.storage.removeItem('scanner:lastCameraId');
                }
            },
        };
    }
}
