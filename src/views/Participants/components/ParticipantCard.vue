<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-card flat>
    <v-card-title class="headline text-uppercase accent--text">
      {{ registration.firstname }} {{ registration.lastname }}
    </v-card-title>

    <table class="v-datatable v-table participant-detail">
      <tbody>

      <!-- Chips of registration -->
      <tr>
        <td colspan="2">
          <v-tooltip bottom>
            <v-chip slot="activator" color="indigo" text-color="white">
              <v-icon dark left>directions</v-icon>
              {{ $store.getters['edition/getCompetitionName'](registration.competition_id) }}
            </v-chip>
            <span>{{ $t('views.participants.fields.competition') }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <v-chip slot="activator" color="indigo" text-color="white">
              <v-icon dark small left class="ml-1">fas fa-birthday-cake</v-icon>
              {{ $fd(registration.birthdate) }}
            </v-chip>
            <span>{{ $t('views.participants.fields.birthday') }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <v-chip slot="activator" :color="'male' === registration.gender ? 'light-blue' : 'pink lighten-2'"
                    text-color="white">
              <v-icon dark>
                fas fa-{{ 'male' === registration.gender ? 'mars' : 'venus' }}
              </v-icon>
            </v-chip>
            <span>{{ $t('views.participants.choices.gender.' + registration.gender) }}</span>
          </v-tooltip>
        </td>
      </tr>

      <tr>
        <td colspan="2">
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
          <v-fade-transition mode="out-in">
            <v-tooltip key="bib-retrieved" left v-if="registration.bibRetrieved">
              <v-icon large color="green" slot="activator">directions_run</v-icon>
              <span>{{ $t('views.participants.bib-retrieved') }}</span>
            </v-tooltip>
            <v-tooltip key="bib-collect" left v-else>
              <v-icon large color="warning" slot="activator">inbox</v-icon>
              <span>{{ $t('views.participants.bib-not-retrieved') }}</span>
            </v-tooltip>
          </v-fade-transition>
        </td>
        <td colspan="2" class="text-xs-center pt-3 pb-3" v-else>
          <span class="font-weight-bold warning--text display-2 text-uppercase">
            {{ $t('views.participants.not-has-bib') }}
          </span>
        </td>
      </tr>

      <tr v-if="registration.hasBib">
        <td colspan="2" class="align-center">
          <v-scale-transition mode="out-in">
            <v-btn key="btn-retrieve-bib" round ripple depressed dark color="light-green" :loading="loading"
                   @click.prevent="updateBibRetrieved(true)"
                   v-if="!registration.bibRetrieved">
              {{ $t('views.participants.retrieve-bib') }}
            </v-btn>
            <v-btn key="btn-collect-bib" round ripple depressed dark color="blue-grey" :loading="loading"
                   @click.prevent="updateBibRetrieved(false)"
                   v-else>
              {{ $t('views.participants.collect-bib') }}
            </v-btn>
          </v-scale-transition>
        </td>
      </tr>

      <field-spacer></field-spacer>
      </tbody>

      <!-- Extra section -->
      <field-section v-model="showExtraSection" v-if="answers.length > 0">
        {{ $t('views.participants.sections.extra') }}
      </field-section>

      <v-slide-y-transition>
      <tbody v-show="showExtraSection">
        <field-item :key="answer.id" :label="answer.name" v-for="answer in answers">
          <div v-if="!answer.isArray">{{ answer.value }}</div>
          <div v-else v-for="item in answer.value">
            {{ item }}
          </div>
        </field-item>
      </tbody>
      </v-slide-y-transition>

      <!-- Registration section -->
      <field-section v-model="showRegistrationSection">
        {{ $t('views.participants.sections.registration') }}
      </field-section>

      <v-slide-y-transition>
      <tbody v-show="showRegistrationSection">
      <field-item :label="$t('views.participants.fields.competition')">
        {{ $store.getters['edition/getCompetitionName'](registration.competition_id) }}
      </field-item>

      <field-item :label="$t('views.participants.fields.amount')">
        {{ $fc(registration.amount) }}
      </field-item>

      <field-item :label="$t('views.participants.fields.registration-date')">
        {{ $fd(registration.registrationDate, 'L LTS') }}
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
      </tbody>
      </v-slide-y-transition>

      <!-- Permission slip section -->
      <field-section v-model="showPermissionSlipSection">
        {{ $t('views.participants.sections.permission-slip') }}
      </field-section>

      <v-slide-y-transition>
      <tbody v-show="showPermissionSlipSection">
      <field-item :label="$t('views.participants.fields.permission-slip-status')">
        {{ $t('views.participants.choices.permission-slip-status.' + registration.permissionSlipStatus) }}
      </field-item>

      <field-item :label="$t('views.participants.fields.permission-slip-valid-until')">
        <span v-if="registration.permissionSlipValidUntil > 0">
          {{ $fd(registration.permissionSlipValidUntil, 'L LTS') }}
        </span>
      </field-item>

      <field-item :label="$t('views.participants.fields.permission-slip-notes')">
        {{ registration.permissionSlipNotes }}
      </field-item>
      </tbody>
      </v-slide-y-transition>

      <!-- Personal section -->
      <field-section v-model="showPersonalSection">
        {{ $t('views.participants.sections.personal') }}
      </field-section>

      <v-slide-y-transition>
      <tbody v-show="showPersonalSection">
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
        {{ $fd(registration.birthdate) }}
      </field-item>

      <field-item :label="$t('views.participants.fields.language')">
        {{ $t('views.participants.choices.language.' + registration.language) }}
      </field-item>

      <field-item :label="$t('views.participants.fields.email')">
        {{ registration.email }}
      </field-item>
      </tbody>
      </v-slide-y-transition>

      <!-- Bib section -->
      <field-section v-model="showBibSection">
        {{ $t('views.participants.sections.bib') }}
      </field-section>

      <v-slide-y-transition>
      <tbody v-show="showBibSection">
      <field-item :label="$t('views.participants.fields.bib')">
        {{ registration.hasBib ? registration.bib.code : $t('views.participants.not-has-bib') }}
      </field-item>

      <field-item :label="$t('views.participants.fields.bib-status')">
        {{ $t('views.participants.bib' + (!registration.bibRetrieved ? '-not' : '') + '-retrieved') }}
      </field-item>

      <field-item :label="$t('views.participants.fields.bib-retrieved-at')">
        {{ registration.bibRetrieved ? $fd(registration.bibRetrievedAt, 'L LTS') : '' }}
      </field-item>
      </tbody>
      </v-slide-y-transition>

      <!-- Payment section -->
      <field-section v-model="showPaymentSection">
        {{ $t('views.participants.sections.payment') }}
      </field-section>

      <v-slide-y-transition>
      <tbody v-show="showPaymentSection">
      <field-item :label="$t('views.participants.fields.payment-paid')">
        {{ $fc(registration.paid) }}
      </field-item>

      <field-item :label="$t('views.participants.fields.payment-balance')">
        {{ $fc(registration.balance) }}
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
      </v-slide-y-transition>
    </table>
  </v-card>
</template>

<script lang="ts">
  import {Canceler} from '@/api/Canceler';
  import {BibRetrievedRequest} from '@/api/models/request/BibRetrievedRequest';
  import {ChangeRegistrationResponse} from '@/api/models/responses/ChangeRegistrationResponse';
  import {RegistrationAnswerChoiceResponse} from '@/api/models/responses/RegistrationAnswerChoiceResponse';
  import {RegistrationAnswerResponse} from '@/api/models/responses/RegistrationAnswerResponse';
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import '@/styles/views/Participants/Details.scss';
  import {Registration} from '@/api/services/Registration';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import FieldItem from '@/views/Participants/components/FieldItem.vue';
  import FieldSection from '@/views/Participants/components/FieldSection.vue';
  import FieldSpacer from '@/views/Participants/components/FieldSpacer.vue';
  import {mixins} from 'vue-class-component';
  import {MetaInfo} from 'vue-meta';
  import {Component, Prop} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {FieldItem, FieldSection, FieldSpacer},
  })
  export default class ParticipantCard extends mixins(AjaxContent) {
    @Prop({type: Object, required: true})
    public registration!: RegistrationResponse;

    private showExtraSection: boolean = true;

    private showRegistrationSection: boolean = false;

    private showPermissionSlipSection: boolean = false;

    private showPersonalSection: boolean = false;

    private showBibSection: boolean = false;

    private showPaymentSection: boolean = false;

    public get answers(): Array<RegistrationAnswerResponse|RegistrationAnswerChoiceResponse> {
      if (this.registration && this.registration.answers) {
        return this.$store.getters['edition/convertAnswers'](this.registration.answers);
      }

      return [];
    }

    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.participants.details-title', {
          firstname: this.registration.firstname,
          lastname: this.registration.lastname,
        }) as string,
      };
    }

    public async updateBibRetrieved(value: boolean): Promise<void> {
      this.loading = true;
      const date = (new Date());

      const res = await this.fetchData<ChangeRegistrationResponse>((canceler: Canceler) =>
              this.$api.get<Registration>(Registration).change(new BibRetrievedRequest(
                      this.registration.id,
                      this.$store.state.auth.fullName,
                      date,
                      value,
              ), canceler), true);

      if (res) {
        if (res.success) {
          this.registration.bibRetrieved = value;
          this.registration.bibRetrievedAt = value ? date.getTime() / 1000 : 0;
          this.$store.commit('participant/updateSelection', this.registration);
        } else {
          this.$store.commit('snackbar/snack', {message: res.message, color: 'error'});
        }
      }

      this.loading = false;
    }
  }
</script>
