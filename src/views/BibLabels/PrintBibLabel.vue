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
          <v-card>
            <v-card-title primary-title>
              <div class="headline">{{ $t('views.bib-labels-print-one.title') }}</div>
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
                        autofocus
                        outline
                        clearable
                        required>
                </v-text-field>
              </v-form>
            </v-card-text>

            <v-list dense>
              <v-list-tile>
                <v-list-tile-action>
                  <v-switch v-model="startPrintingImmediately"></v-switch>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{ $t('views.settings.start-printing-immediately') }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>

            <v-card-actions>
              <v-list-tile class="grow">
                <v-layout align-center justify-center>
                  <v-btn depressed block ripple color="accent" v-on:click="search"><v-icon>search</v-icon></v-btn>
                  <v-btn depressed block ripple color="success" v-on:click="print" :disabled="!isPrintable"><v-icon>print</v-icon></v-btn>
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

          <v-layout column align-center justify-center v-else-if="bibResult === false">
            <v-icon size="14em" color="info">search</v-icon>
            <h2 :class="$store.state.darkMode.enabled ? null : 'grey--text'">{{ $t('views.bib-labels-print.bib-not-found') }}</h2>
          </v-layout>
        </v-flex>

        <loading v-if="loading"></loading>
      </transition>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {ListResponse} from '@/api/models/responses/ListResponse';
  import {RegistrationAnswerResponse} from '@/api/models/responses/RegistrationAnswerResponse';
  import {RegistrationBibResponse} from '@/api/models/responses/RegistrationBibResponse';
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {Registration} from '@/api/services/Registration';
  import BibItem from '@/bib/BibItem';
  import BibLabel from '@/components/BibLabel.vue';
  import Loading from '@/components/Loading.vue';
  import {ICompetition} from '@/db/tables/ICompetition';
  import {IField} from '@/db/tables/IField';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {Printer} from '@/printers/Printer';
  import {mixins} from 'vue-class-component';
  import {MetaInfo} from 'vue-meta';
  import {Component} from 'vue-property-decorator';
  import '@/styles/views/BibLabels.scss';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {Loading, BibLabel},
  })
  export default class BibLabels extends mixins(AjaxContent) {
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
        title: this.$i18n.t('views.bib-labels-print-one.title') as string,
      };
    }

    public beforeMount(): void {
      this.bibResult = new BibItem();
      this.bibResult.registrationId = -1;
      this.bibResult.distance = 'Dis';
      this.bibResult.unit = 'unit';
      this.bibResult.bibNumber = '0';
      this.bibResult.firstName = 'Example';
      this.bibResult.phoneUrgency = 'Phone number';
    }

    public destroyed(): void {
      this.printer.destroy();
    }

    public async search() {
      if (!await this.$validator.validateAll()) {
        return;
      }

      this.loading = true;
      this.launchPrint = false;
      this.bibResult = false;
      const res = await this.fetchData<ListResponse<RegistrationResponse>>(() =>
              this.$api.get<Registration>(Registration).list({
        itemsPerPage: 1,
        search: {
          bibNumber: this.searchBibNumber,
        },
      }));

      if (res && res.resultsSize > 0 && res.results[0].bib) {
        const reg = res.results[0];

        // find competition
        const competitions: Record<number, ICompetition> = this.$store.state.edition.currentCompetitions;
        const competition = competitions[reg.competition_id] as ICompetition;
        const bib = new BibItem();
        bib.bibNumber = (reg.bib as RegistrationBibResponse).code;
        bib.firstName = reg.firstname;
        bib.registrationId = reg.id;

        if (competition) {
          bib.distance = competition.sportsAndDistances[0].distance;
          bib.unit = competition.sportsAndDistances[0].unit as string;

          if (competition.startBirthDate) {
            bib.startBirthDate = new Date(competition.startBirthDate);
          }

          if (competition.endBirthDate) {
            bib.endBirthDate = new Date(competition.endBirthDate);
          }
        }

        // find last phone field
        if (reg.answers) {
          const fields: Record<number, IField> = this.$store.state.edition.currentFields;
          let field: IField;

          for (const sField of Object.values(fields).reverse() as IField[]) {
            if ('PhoneNumber' === sField.type) {
              field = sField;

              for (const answer of reg.answers.reverse()) {
                if (answer.field_id === sField.id) {
                  bib.phoneUrgency = answer.value as string;

                  if ((answer as RegistrationAnswerResponse).country) {
                    bib.phoneUrgency = '+' + (answer as RegistrationAnswerResponse).country + bib.phoneUrgency;
                  }
                  break;
                }
              }
              break;
            }
          }
        }

        this.bibResult = bib;
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
  }
</script>
