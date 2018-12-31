/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VueConstructor} from 'vue';
import {DirectiveBinding} from 'vue/types/options';

export interface LongPressOptions {
    duration?: number;
}

export default (Vue: VueConstructor, options?: LongPressOptions) => {
    if (!options) {
        options = {};
    }

    if (!options.duration) {
        options.duration = 1000;
    }

    Vue.directive('longpress', {
        bind: (el: LongPressHTMLElement, binding: DirectiveBinding) => {
            const onPressHandler = () => {
                el.$longPressTimeout = setTimeout(() => {
                    el.$isLongPress = true;
                }, (options as LongPressOptions).duration);
            };
            const onUnPressHandler = (e: Event) => {
                let longAction: any;
                let shortAction: any;

                if (binding.value) {
                    const typeofVal = typeof binding.value;

                    if (typeofVal === 'function') {
                        longAction = binding.value;
                    } else if (typeofVal === 'object') {
                        if (binding.value.long && typeof binding.value.long === 'function') {
                            longAction = binding.value.long;
                        }

                        if (binding.value.short && typeof binding.value.short === 'function') {
                            shortAction = binding.value.short;
                        }
                    }
                }

                if (el.$isLongPress) {
                    if (longAction) {
                        e.preventDefault();
                        longAction();
                    }
                } else {
                    if (shortAction) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        shortAction();
                    }
                }

                clearTimeout(el.$longPressTimeout);
                delete el.$longPressTimeout;
                delete el.$isLongPress;
            };

            el.$destroy = () => {
                el.removeEventListener('mousedown', onPressHandler);
                el.removeEventListener('touchstart', onPressHandler);
                el.removeEventListener('mouseup', onUnPressHandler);
                el.removeEventListener('touchend', onUnPressHandler);
                el.removeEventListener('touchcancel', onUnPressHandler);
                el.removeEventListener('touchleave', onUnPressHandler);
            };

            el.addEventListener('mousedown', onPressHandler);
            el.addEventListener('touchstart', onPressHandler);
            el.addEventListener('mouseup', onUnPressHandler);
            el.addEventListener('touchend', onUnPressHandler);
            el.addEventListener('touchcancel', onUnPressHandler);
            el.addEventListener('touchleave', onUnPressHandler);
        },

        unbind: (el: LongPressHTMLElement) => {
            if (el.$destroy) {
                el.$destroy();
            }

            delete el.$destroy;
            delete el.$longPressTimeout;
            delete el.$isLongPress;
        },
    });
};

interface LongPressHTMLElement extends HTMLElement {
    $destroy?: () => void;
    $longPressTimeout?: number;
    $isLongPress?: boolean;
}
