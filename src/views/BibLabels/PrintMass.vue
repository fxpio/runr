<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <div class="fill-height">
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

    <transition name="fade" mode="out-in">
      <sync-pending key="pending" v-if="$store.state.registration.pending"></sync-pending>

      <v-container key="search" v-else>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            <v-card flat>
              <v-card-title primary-title>
                <div class="headline primary--text">
                  {{ $t('views.bib-labels-print-mass.title') }}
                </div>
              </v-card-title>

              <v-card-text class="pb-0">
                <v-form ref="form" @submit.prevent>
                  <v-select
                          :items="competitions"
                          :loading="0 === competitions.length"
                          v-model="selectedCompetition"
                          item-value="id"
                          item-text="label"
                          :label="$t('forms.competitions.all')"
                          return-object
                          chips
                          single-line
                          clearable
                          outlined>
                    <template slot="item" slot-scope="data">{{ data.item.label }}</template>
                  </v-select>

                  <v-select
                          :items="registrationStatusItems"
                          v-model="selectedRegistrationStatus"
                          item-value="value"
                          item-text="label"
                          :label="$t('forms.registration-status.all')"
                          :menu-props="{closeOnContentClick: true}"
                          multiple
                          chips
                          deletable-chips
                          single-line
                          clearable
                          outlined>
                    <template slot="item" slot-scope="data">{{ data.item.label }}</template>
                  </v-select>

                  <v-select
                          :items="statusItems"
                          v-model="selectedStatus"
                          item-value="value"
                          item-text="label"
                          :label="$t('forms.status.all')"
                          :menu-props="{closeOnContentClick: true}"
                          multiple
                          chips
                          deletable-chips
                          single-line
                          clearable
                          outlined>
                    <template slot="item" slot-scope="data">{{ data.item.label }}</template>
                  </v-select>

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
                          outlined
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
          </v-col>
        </v-row>
      </v-container>
    </transition>

    <v-dialog v-model="isPrintable"
              eager
              ref="printerDialog"
              fullscreen
              dark
              scrollable
              content-class="printer-dialog"
              transition="dialog-bottom-transition"
              hide-overlay>
      <v-card shaped class="printer-card">
        <v-toolbar dark flat>
          <v-btn icon dark @click.prevent="reset">
            <v-icon>close</v-icon>
          </v-btn>

          <v-toolbar-title v-if="null !== bibs">
            {{ $tc('views.bib-labels-print-mass.print-labels', bibs.length) }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn depressed ripple icon
                 :loading="building"
                 @click.prevent="print">
            <v-icon>print</v-icon>
          </v-btn>
        </v-toolbar>

        <v-container fluid fill-height>
          <v-row align="start" justify="center">
            <div :class="bibWrapperClasses" v-if="showBibLabels">
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
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
  import BibItem from '@/bib/BibItem';
  import BibUtil from '@/bib/BibUtil';
  import BibLabel from '@/components/BibLabel.vue';
  import ErrorMessage from '@/components/ErrorMessage.vue';
  import {ICompetition} from '@/db/tables/ICompetition';
  import CompetitionItem from '@/forms/CompetitionItem';
  import RegistrationStatusItem from '@/forms/RegistrationStatusItem';
  import StatusItem from '@/forms/StatusItem';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {Bib} from '@/mixins/Bib';
  import {Printerable} from '@/mixins/Printerable';
  import {EditionModuleState} from '@/stores/edition/EditionModuleState';
  import SyncPending from '@/views/BibLabels/components/SyncPending.vue';
  import {mixins} from 'vue-class-component';
  import {Component, Vue, Watch} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {ErrorMessage, BibLabel, SyncPending},
  })
  export default class PrintMass extends mixins(AjaxContent, Bib, Printerable) {
    public bibNumbers: string|null = null;

    public selectedCompetition: CompetitionItem|null = null;

    public competitions: CompetitionItem[] = [];

    public selectedRegistrationStatus: boolean[] = [];

    public selectedStatus: number[] = [];

    public bibs: BibItem[]|null = null;

    public building: boolean = false;

    public showBibLabels: boolean = false;

    private dialog!: HTMLElement;

    private stateUnwatch?: () => void;

    public get isPrintable(): boolean {
      return null !== this.bibs && this.bibs.length > 0;
    }

    public get bibWrapperClasses(): object {
      return {
        'bib-label-wrapper': true,
        'hidden': !this.isPrintable,
      };
    }

    public get registrationStatusItems(): RegistrationStatusItem[] {
      return [
        new RegistrationStatusItem(true, this.$t('views.participants.choices.registered.true') as string),
        new RegistrationStatusItem(false, this.$t('views.participants.choices.registered.false') as string),
      ];
    }

    public get statusItems(): StatusItem[] {
      return [
        new StatusItem(0, this.$t('views.participants.choices.status.0') as string),
        new StatusItem(1, this.$t('views.participants.choices.status.1') as string),
        new StatusItem(2, this.$t('views.participants.choices.status.2') as string),
      ];
    }

    public beforeMount(): void {
      this.watchEditionCompetitions(this.$store.state.edition.currentCompetitions);
      this.stateUnwatch = this.$store.watch((state: EditionModuleState) => state.edition.currentCompetitions,
              this.watchEditionCompetitions);
    }

    public mounted(): void {
      this.dialog = (this.$refs.printerDialog as Vue).$refs.dialog as HTMLElement;
    }

    public destroyed(): void {
      if (this.stateUnwatch) {
        this.stateUnwatch();
      }

      this.dialog.removeEventListener('transitionend', this.delayShowBibLabels);
    }

    @Watch('isPrintable')
    public watchIsPrintable(opened: boolean): void {
      if (opened) {
        this.dialog.addEventListener('transitionend', this.delayShowBibLabels);
      } else {
        this.dialog.removeEventListener('transitionend', this.delayShowBibLabels);
        this.showBibLabels = false;
      }
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
        competitionIds: this.selectedCompetition ? [this.selectedCompetition.id] : [],
        registrationStatus: this.selectedRegistrationStatus,
        status: this.selectedStatus,
      });
      this.bibs = await this.convertRegistrationsToBibs(registrations);
      this.building = this.updateBibNumbers();
    }

    public async print(): Promise<void> {
      if (this.isPrintable) {
        this.printer.print([...document.querySelectorAll('.bib-label-wrapper .bib-label').values()]);
      }
    }

    public delayShowBibLabels(): void {
      this.dialog.removeEventListener('transitionend', this.delayShowBibLabels);
      this.showBibLabels = true;
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

    private watchEditionCompetitions(currentCompetitions: Record<number, ICompetition>|null): void {
      if (currentCompetitions) {
        this.competitions = [];
        const selectedIds: number[] = this.$store.state.participant.cacheSearchConfig
                ? this.$store.state.participant.cacheSearchConfig.selectedCompetitions
                : [];

        for (const item of Object.values(currentCompetitions) as ICompetition[]) {
          const compItem = new CompetitionItem(item.id, item.name);
          this.competitions.push(compItem);

          if (selectedIds.indexOf(item.id) > -1) {
            this.selectedCompetition = compItem;
          }
        }
      }
    }
  }
</script>
