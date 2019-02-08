<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height>
    <v-layout justify-center row>
      <transition name="fade" mode="out-in" @after-enter="onAfterEnter">
        <v-flex sm10 md8 lg6 xl4 v-if="!loading">
          <v-card flat>
            <v-card-title primary-title>
              <div class="headline primary--text">
                {{ $t('views.bib-labels-print-one.title') }}
              </div>
            </v-card-title>

            <v-card-text class="pb-0">
              <v-form ref="form" @submit.prevent>
                <v-text-field
                        type="number"
                        :label="$i18n.t('views.bib-labels-print.bib-number')"
                        v-model="searchBibNumber"
                        data-vv-name="searchBibNumber"
                        :data-vv-as="$i18n.t('views.bib-labels-print.bib-number')"
                        v-validate="'required'"
                        :error-messages="errors.collect('searchBibNumber')"
                        @keyup.enter="search"
                        outline
                        clearable
                        required>
                </v-text-field>

                <v-switch v-model="startPrintingImmediately"
                          :label="$t('views.settings.start-printing-immediately')">
                </v-switch>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-list-tile class="grow">
                <v-layout align-center justify-center>
                  <v-tooltip top class="v-btn v-btn--block" v-if="!!$store.state.scanner.enabled">
                    <v-btn slot="activator" depressed ripple dark color="blue-grey"
                           @click="$store.commit('scanner/open')">
                      <v-icon>fas fa-qrcode</v-icon>
                    </v-btn>
                    <span>{{ $t('scanner.scan-bib-withdrawal-card') }}</span>
                  </v-tooltip>
                  <v-btn depressed block ripple color="accent" v-on:click="search">
                    <v-icon>search</v-icon>
                  </v-btn>
                  <v-btn depressed block ripple color="success" v-on:click="print" :disabled="!isPrintable">
                    <v-icon>print</v-icon>
                  </v-btn>
                </v-layout>
              </v-list-tile>
            </v-card-actions>
          </v-card>

          <div :class="bibWrapperClasses" v-if="bibResult">
            <bib-label :key="bibResult.bibNumber"
                       :distance="bibResult.distance"
                       :unit="bibResult.unit"
                       :firstName="bibResult.firstName"
                       :bibNumber="bibResult.bibNumber"
                       :phoneUrgency="bibResult.phoneUrgency"
                       :startBirthDate="bibResult.startBirthDate"
                       :endBirthDate="bibResult.endBirthDate"
            ></bib-label>
          </div>

          <error-message v-else-if="bibResult === false"
                         icon-size="12em"
                         :icon="previousError ? 'error' : 'search'"
                         :icon-color="previousError ? 'red' : 'info'"
                         :message="previousError ? previousError.message : $t('views.bib-labels-print.bib-not-found')">
          </error-message>
        </v-flex>

        <loading v-if="loading"></loading>
      </transition>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {Canceler} from '@/api/Canceler';
  import {RegistrationOptionsSearch} from '@/api/models/request/RegistrationOptionsSearch';
  import {ListResponse} from '@/api/models/responses/ListResponse';
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {Registration} from '@/api/services/Registration';
  import BibItem from '@/bib/BibItem';
  import BibLabel from '@/components/BibLabel.vue';
  import ErrorMessage from '@/components/ErrorMessage.vue';
  import Loading from '@/components/Loading.vue';
  import Scanner from '@/components/Scanner.vue';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {Bib} from '@/mixins/Bib';
  import {Printer} from '@/printers/Printer';
  import {mixins} from 'vue-class-component';
  import {MetaInfo} from 'vue-meta';
  import {Component} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {ErrorMessage, Scanner, Loading, BibLabel},
  })
  export default class BibLabels extends mixins(AjaxContent, Bib) {
    public bibResult: BibItem|false|null = null;

    public searchBibNumber?: string = '';

    private launchPrint: boolean = false;

    private printer: Printer = new Printer();

    public get startPrintingImmediately(): boolean {
      return this.$store.state.bib.startPrintingImmediately;
    }

    public set startPrintingImmediately(value: boolean) {
      this.$store.commit('bib/toggleStartPrintingImmediately', value);
    }

    public get isPrintable(): boolean {
      return !!this.bibResult && -1 !== this.bibResult.registrationId;
    }

    public get bibWrapperClasses(): object {
      return {
        'bib-label-wrapper': true,
        ' mt-3': true,
        'hidden': !this.isPrintable,
      };
    }

    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.bib-labels-print-one.title') as string,
      };
    }

    public async beforeMount(): Promise<void> {
      this.bibResult = this.createMockBib();
      this.$root.$on('scanner-decode', this.onDecode);
    }

    public destroyed(): void {
      this.$root.$off('scanner-decode', this.onDecode);
      this.printer.destroy();
    }

    public async search() {
      if (!await this.$validator.validateAll()) {
        return;
      }

      await this.doSearch({
        bibNumber: this.searchBibNumber,
      });
    }

    public async doSearch(searchOptions: RegistrationOptionsSearch) {
      this.loading = true;
      this.launchPrint = false;
      this.bibResult = false;
      const res = await this.fetchData<ListResponse<RegistrationResponse>>((canceler: Canceler) =>
              this.$api.get<Registration>(Registration).list({
        itemsPerPage: 1,
        search: searchOptions,
      }, canceler), true);

      if (res && res.resultsSize > 0 && res.results[0].bib) {
        this.bibResult = await this.convertRegistrationToBib(res.results[0]);

        if (this.searchBibNumber !== this.bibResult.bibNumber) {
          this.searchBibNumber = this.bibResult.bibNumber;
        }
      }

      this.loading = false;

      if (this.startPrintingImmediately) {
        this.launchPrint = true;
      }
    }

    public print(): void {
      if (this.isPrintable) {
        this.printer.print([...document.querySelectorAll('.bib-label-wrapper .bib-label').values()]);
      }
    }

    public onAfterEnter(): void {
      if (this.launchPrint) {
        this.launchPrint = false;
        this.print();
      }
    }

    public async onDecode(value: string): Promise<void> {
      await this.doSearch({
        id: Number(value),
      });
    }
  }
</script>
