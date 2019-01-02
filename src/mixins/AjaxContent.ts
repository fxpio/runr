/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@/api/Canceler';
import {getRequestErrorMessage} from '@/utils/error';
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export class AjaxContent<D, O> extends Vue {
    public loading: boolean = false;

    public previousRequest?: Canceler;

    public beforeDestroy(): void {
        if (this.previousRequest) {
            this.previousRequest.cancel();
            this.previousRequest = undefined;
        }
    }

    /**
     * Fetch data.
     */
    public async fetchData(request: () => D): Promise<D|undefined> {
        try {
            this.loading = true;

            if (this.previousRequest) {
                this.previousRequest.cancel();
            }
            this.previousRequest = new Canceler();

            const res = await request();
            this.previousRequest = undefined;
            this.loading = false;

            return res;
        } catch (e) {
            this.loading = false;
            this.$store.commit('snackbar/snack', {message: getRequestErrorMessage(this, e), color: 'error'});
        }
    }
}
