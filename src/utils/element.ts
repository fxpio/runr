/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Vue} from 'vue/types/vue';

/**
 * Get the parent by type (checked by instanceof).
 */
export function getParent<T extends Vue>(el: HTMLElement, type: any): T|null {
    const $target = (el as any).__vue__ as Vue|undefined;

    if ($target) {
        if ($target instanceof type) {
            return $target as T;
        }

        if (($target as any).$parent) {
            return getParent<T>(($target as any).$parent.$el, type);
        }
    }

    return null;
}
