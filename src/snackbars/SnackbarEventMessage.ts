/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackConfig} from '@/stores/snackbar/SnackConfig';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class SnackbarEventMessage implements SnackConfig {
    public readonly type: string = 'snackbar-event-message';

    public message: string;

    public color?: string;

    public closeButton?: boolean;

    public translatable: boolean;

    constructor(message: string, translatable: boolean = false, closeButton?: boolean, color?: string) {
        this.message = message;
        this.translatable = translatable;
        this.closeButton = closeButton;
        this.color = color;
    }
}
