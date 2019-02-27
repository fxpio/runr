<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container>
    <v-fab-transition>
      <v-btn v-if="!$store.state.registration.pending"
             key="sync"
             color="accent"
             ripple
             fab
             fixed
             bottom
             right
             @click.prevent="sync">
        <v-icon>sync</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-layout row justify-center>
      <transition name="fade" mode="out-in">
        <sync-pending key="pending" v-if="$store.state.registration.pending"></sync-pending>

        <v-flex key="search" sm10 md8 lg6 xl4 v-else>
          <v-card flat>
            <v-card-title primary-title>
              <div class="headline primary--text">
                {{ $t('views.bib-labels-print-mass.title') }}
              </div>
            </v-card-title>

            <v-card-text class="pb-0">
              <v-form ref="form" @submit.prevent>
                <v-text-field
                        type="text"
                        :readonly="building"
                        :label="$i18n.t('views.bib-labels-print-mass.bib-number-range')"
                        :hint="$i18n.t('views.bib-labels-print-mass.bib-number-range-description')"
                        v-model="bibNumbers"
                        data-vv-name="bibNumbers"
                        :data-vv-as="$i18n.t('views.bib-labels-print-mass.bib-number-range')"
                        v-validate="{regex: /^[0-9,\- ]+$/}"
                        :error-messages="errors.collect('bibNumbers')"
                        @keydown.enter.prevent="search"
                        outline
                        clearable
                        required>
                </v-text-field>
              </v-form>
            </v-card-text>

            <v-card-actions class="pl-3 pr-3">
              <v-fade-transition mode="out-in">
                <v-btn depressed block ripple color="accent"
                       :loading="building"
                       @click.prevent="search">
                  <v-icon>search</v-icon>
                </v-btn>
              </v-fade-transition>
            </v-card-actions>
          </v-card>

          <transition name="fade" mode="out-in">
            <error-message icon-size="12em"
                           icon="error"
                           icon-color="info"
                           :message="$t('views.bib-labels-print.bib-not-found')"
                           v-if="!isPrintable && null !== bibs">
            </error-message>
          </transition>
        </v-flex>
      </transition>
    </v-layout>

    <v-dialog v-model="isPrintable"
              fullscreen
              dark
              scrollable
              lazy
              content-class="printer-dialog"
              transition="dialog-bottom-transition"
              hide-overlay>
      <v-card flat class="printer-card">
        <v-toolbar dark flat>
          <v-btn icon dark @click.prevent="reset">
            <v-icon>close</v-icon>
          </v-btn>

          <v-toolbar-title v-if="null !== bibs">
            {{ $tc('views.bib-labels-print-mass.print-labels', bibs.length) }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn depressed ripple icon color="accent"
                 :loading="building"
                 @click.prevent="print">
            <v-icon>print</v-icon>
          </v-btn>
        </v-toolbar>

        <v-container fluid fill-height>
          <v-layout row align-start justify-center>
            <div :class="bibWrapperClasses">
              <bib-label v-for="bib in bibs"
                         :key="bib.registrationId"
                         :distance="bib.distance"
                         :unit="bib.unit"
                         :firstName="bib.firstName"
                         :bibNumber="bib.bibNumber"
                         :phoneUrgency="bib.phoneUrgency"
                         :startBirthDate="bib.startBirthDate"
                         :endBirthDate="bib.endBirthDate"
              ></bib-label>
            </div>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
  import BibItem from '@/bib/BibItem';
  import BibUtil from '@/bib/BibUtil';
  import BibLabel from '@/components/BibLabel.vue';
  import ErrorMessage from '@/components/ErrorMessage.vue';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {Bib} from '@/mixins/Bib';
  import {Printerable} from '@/mixins/Printerable';
  import SyncPending from '@/views/BibLabels/components/SyncPending.vue';
  import {mixins} from 'vue-class-component';
  import {Component, Watch} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {ErrorMessage, BibLabel, SyncPending},
  })
  export default class PrintMass extends mixins(AjaxContent, Bib, Printerable) {
    public bibNumbers: string|null = null;

    public bibs: BibItem[]|null = null;

    public building: boolean = false;

    public get isPrintable(): boolean {
      return null !== this.bibs && this.bibs.length > 0;
    }

    public get bibWrapperClasses(): object {
      return {
        'bib-label-wrapper': true,
        'hidden': !this.isPrintable,
      };
    }

    @Watch('bibNumbers', {immediate: true})
    public watchBibNumbers(): void {
      if (this.building) {
        this.building = false;
      } else {
        this.reset();
      }
    }

    public reset(): void {
      this.bibs = null;
    }

    public async sync(): Promise<void> {
      await this.$store.dispatch('registration/sync', this.$store.state.edition.current);
      this.reset();
    }

    public async search() {
      if (!await this.$validator.validateAll()) {
        return;
      }

      this.building = true;
      const editionId = this.$store.state.edition.current.id;
      const ranges = BibUtil.convertFilter(this.bibNumbers);
      const registrations = await this.$store.getters['registration/list']({
        editionId,
        ranges,
      });
      this.bibs = await this.convertRegistrationsToBibs(registrations);
      this.building = this.updateBibNumbers();
    }

    public async print(): Promise<void> {
      if (this.isPrintable) {
        this.printer.print([...document.querySelectorAll('.bib-label-wrapper .bib-label').values()]);
      }
    }

    private updateBibNumbers(): boolean {
      if (!this.bibNumbers && null !== this.bibs && this.bibs.length > 0) {
        this.bibNumbers = String(this.bibs[0].bibNumber);

        if (this.bibs.length > 1) {
          this.bibNumbers += '-' + this.bibs[this.bibs.length - 1].bibNumber;
        }

        return true;
      }

      return false;
    }
  }
</script>
