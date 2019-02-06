<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <transition name="fade" mode="out-in">
    <error-message :message="previousError.message" v-if="!loading && !!previousError">
      <v-btn class="mt-3" @click.prevent="requestContent">{{ $t('retry') }}</v-btn>
    </error-message>

    <v-card flat v-else-if="!loading">
      <v-card-title class="headline accent--text">
        <span>{{ registration.firstname }}</span>
        &nbsp;
        <span class="text-uppercase">{{ registration.lastname }}</span>
        <v-tooltip bottom>
          <v-icon slot="activator" large right :color="'male' === registration.gender ? 'light-blue' : 'pink'">
            fas fa-{{ 'male' === registration.gender ? 'mars' : 'venus' }}
          </v-icon>
          <span>{{ $t('views.participants.choices.gender.' + registration.gender) }}</span>
        </v-tooltip>
      </v-card-title>

      <table class="v-datatable v-table participant-detail">
        <tbody>

        <!-- Chips of registration -->
        <tr>
          <td colspan="2">
            <v-chip color="indigo" text-color="white">
              <v-icon dark left>directions</v-icon>
              {{ getCompetitionName(registration.competition_id) }}
            </v-chip>

            <v-chip small :color="registration.isRegistered ? 'teal' : 'red'" text-color="white">
              {{ $t('views.participants.choices.registered.' + registration.isRegistered) }}
            </v-chip>

            <v-chip small :color="0 === registration.status ? 'teal' : 'red'" text-color="white">
              {{ $t('views.participants.choices.status.' + registration.status) }}
            </v-chip>

            <v-chip small :color="0 === registration.paymentStatus ? 'teal' : 'red'" text-color="white">
              {{ $t('views.participants.choices.payment-status.' + registration.paymentStatus) }}
            </v-chip>

            <v-chip small :color="[0, '0'].indexOf(registration.permissionSlipStatus) > -1 ? 'teal' : 'warning'"
                    text-color="white">
              {{ $t('views.participants.choices.permission-slip-status.' + registration.permissionSlipStatus) }}
            </v-chip>
          </td>
        </tr>

        <!-- Bib section -->
        <field-spacer></field-spacer>

        <tr>
          <td colspan="2" class="text-xs-center pt-3 pb-3" v-if="registration.hasBib">
            <span class="font-weight-bold accent--text display-2">
              {{ $t('views.participants.fields.short-number') }}&nbsp;{{ registration.bib.code }}
            </span>
            &nbsp;
            <v-tooltip left v-if="registration.bibRetrieved">
              <v-icon large color="green" slot="activator">directions_run</v-icon>
              <span>{{ $t('views.participants.bib-retrieved') }}</span>
            </v-tooltip>
            <v-tooltip left v-else>
              <v-icon large color="grey" slot="activator">inbox</v-icon>
              <span>{{ $t('views.participants.bib-not-retrieved') }}</span>
            </v-tooltip>
          </td>
          <td colspan="2" class="text-xs-center pt-3 pb-3" v-else>
            <span class="font-weight-bold warning--text display-2 text-uppercase">
              {{ $t('views.participants.not-has-bib') }}
            </span>
          </td>
        </tr>

        <field-spacer></field-spacer>

        <!-- Registration section -->
        <field-section>
          {{ $t('views.participants.sections.registration') }}
        </field-section>

        <field-item :label="$t('views.participants.fields.competition')">
          {{ getCompetitionName(registration.competition_id) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.amount')">
          {{ formatCurrency(registration.amount) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.registration-date')">
          {{ formatDate(registration.registrationDate) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.registration-code')">
          {{ registration.registrationCode }}
        </field-item>

        <field-item :label="$t('views.participants.fields.registration-status')">
          {{ $t('views.participants.choices.registered.' + registration.isRegistered) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.file-status')">
          {{ $t('views.participants.choices.status.' + registration.status) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.comment')">
          {{ registration.comment }}
        </field-item>

        <!-- Permission slip section -->
        <field-section>
          {{ $t('views.participants.sections.permission-slip') }}
        </field-section>

        <field-item :label="$t('views.participants.fields.permission-slip-status')">
          {{ $t('views.participants.choices.permission-slip-status.' + registration.permissionSlipStatus) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.permission-slip-valid-until')">
          <span v-if="registration.permissionSlipValidUntil > 0">
            {{ formatDate(registration.permissionSlipValidUntil) }}
          </span>
        </field-item>

        <field-item :label="$t('views.participants.fields.permission-slip-notes')">
          {{ registration.permissionSlipNotes }}
        </field-item>

        <!-- Personal section -->
        <field-section>
          {{ $t('views.participants.sections.personal') }}
        </field-section>

        <field-item :label="$t('views.participants.fields.firstname')">
          {{ registration.firstname }}
        </field-item>

        <field-item :label="$t('views.participants.fields.lastname')">
          {{ registration.lastname }}
        </field-item>

        <field-item :label="$t('views.participants.fields.gender')">
          {{ $t('views.participants.choices.gender.' + registration.gender) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.birthday')">
          {{ formatDate(registration.birthdate) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.language')">
          {{ $t('views.participants.choices.language.' + registration.language) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.email')">
          {{ registration.email }}
        </field-item>

        <!-- Bib section -->
        <field-section>
          {{ $t('views.participants.sections.bib') }}
        </field-section>

        <field-item :label="$t('views.participants.fields.bib')">
          {{ registration.hasBib ? registration.bib.code : $t('views.participants.not-has-bib') }}
        </field-item>

        <field-item :label="$t('views.participants.fields.bib-status')">
          {{ $t('views.participants.bib' + (!registration.bibRetrieved ? '-not' : '') + '-retrieved') }}
        </field-item>

        <field-item :label="$t('views.participants.fields.bib-retrieved-at')">
          {{ registration.bibRetrieved ? formatDate(registration.bibRetrievedAt) : '' }}
        </field-item>

        <!-- Payment section -->
        <field-section>
          {{ $t('views.participants.sections.payment') }}
        </field-section>

        <field-item :label="$t('views.participants.fields.payment-paid')">
          {{ formatCurrency(registration.paid) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.payment-balance')">
          {{ formatCurrency(registration.balance) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.payment-status')">
          {{ $t('views.participants.choices.payment-status.' + registration.paymentStatus) }}
        </field-item>

        <field-item :label="$t('views.participants.fields.payment-method')">
          <span v-if="typeof registration.payment_method_id === 'number'">
            {{ $t('views.participants.choices.payment-method.' + registration.payment_method_id) }}
          </span>
          <span v-else>/</span>
        </field-item>

        <field-item :label="$t('views.participants.fields.payment-notes')">
          <div class="mb-2" v-for="note in registration.paymentNotes">
            {{ note }}
          </div>
        </field-item>
        </tbody>
      </table>
    </v-card>
  </transition>
</template>

<script lang="ts">
  import {ListResponse} from '@/api/models/responses/ListResponse';
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {Registration} from '@/api/services/Registration';
  import ErrorMessage from '@/components/ErrorMessage.vue';
  import {ICompetition} from '@/db/tables/ICompetition';
  import {IEdition} from '@/db/tables/IEdition';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {EditionModuleState} from '@/stores/edition/EditionModuleState';
  import '@/styles/views/Participants/Details.scss';
  import FieldItem from '@/views/Participants/components/FieldItem.vue';
  import FieldSection from '@/views/Participants/components/FieldSection.vue';
  import FieldSpacer from '@/views/Participants/components/FieldSpacer.vue';
  import moment from 'moment';
  import {mixins} from 'vue-class-component';
  import {MetaInfo} from 'vue-meta';
  import {Component} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {FieldItem, FieldSection, FieldSpacer, ErrorMessage},
  })
  export default class Details extends mixins(AjaxContent) {
    public registration!: RegistrationResponse;

    private stateUnwatch?: () => void;

    public metaInfo(): MetaInfo {
      return {
        title: this.registration
                ? this.$i18n.t('views.participants.details-title', {
                    firstname: this.registration.firstname,
                    lastname: this.registration.lastname,
                  }) as string
                : this.$i18n.t('views.participants.title') as string,
      };
    }

    public beforeMount(): void {
      this.stateUnwatch = this.$store.watch((state: EditionModuleState) => state.edition.current,
              this.watchEdition);

      this.loading = true;
    }

    public async mounted(): Promise<void> {
      let cacheSelection = this.$store.state.participant.cacheSelection;

      if (cacheSelection && cacheSelection.id !== Number((this.$route.params as any).id)) {
        this.$store.commit('participant/setSelection', null);
        cacheSelection = null;
      }

      if (cacheSelection) {
        this.registration = cacheSelection;
        this.loading = false;
      } else {
        await this.requestContent();
      }
    }

    public destroyed(): void {
      if (this.stateUnwatch) {
        this.stateUnwatch();
      }
    }

    public getCompetitionName(id: number): string {
      const competitions = this.$store.state.edition.currentCompetitions;

      if (competitions && competitions[id]) {
        return (competitions[id] as ICompetition).name;
      }

      return String(id);
    }

    public formatDate(date: string|number): string {
      if (typeof date === 'number') {
        return moment.unix(date).format('L');
      }

      return moment(date, 'YYYYMMDD').format('L');
    }

    public formatCurrency(value: number): string {
      const locale = this.$store.state.i18n.locale;
      const params = this.$store.state.edition.current
              ? {style: 'currency', currency : this.$store.state.edition.current.currency}
              : {};

      return new Intl.NumberFormat(locale, params).format(value);
    }

    private async requestContent() {
      const id = Number((this.$route.params as any).id as string);
      const requestOpts = {
        itemsPerPage: 1,
        search: {
          id: isNaN(id) ? -1 : id,
        },
      };

      const res = await this.fetchData<ListResponse<RegistrationResponse>>(() =>
              this.$api.get<Registration>(Registration).list(requestOpts));

      if (res) {
        this.registration = res.results[0];
      }

      this.loading = false;
    }

    private watchEdition(edition: IEdition|null, previousEdition?: IEdition|null): void {
      if (previousEdition) {
        this.$router.replace({name: 'participants'});
      }
    }
  }
</script>
