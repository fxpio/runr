/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class Elevatable extends Vue {
    @Prop({type: [Number, String], default: null})
    public elevation?: number;

    public get computedElevation(): string|number|undefined {
        return this.elevation;
    }

    public get elevationClasses(): Record<string, boolean> {
        if (!this.computedElevation) {
            return {};
        }

        return {
            [`elevation-${this.computedElevation}`]: true,
        };
    }
}
