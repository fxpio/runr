<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-card flat>
    <quick-print-bib-label v-model="openPrintBibLabel"
                           :registration="registration">
    </quick-print-bib-label>

    <v-card-title class="headline text-uppercase accent--text">
      {{ registration.firstname }} {{ registration.lastname }}
    </v-card-title>

    <table class="v-datatable v-table participant-detail">
      <tbody>

      <!-- Chips of registration -->
      <tr>
        <td colspan="2">
          <v-tooltip bottom eager>

            <template v-slot:activator="{on}">
              <v-chip v-on="on" color="indigo" text-color="white" class="ma-1">
                <v-icon dark left>directions</v-icon>
                {{ $store.getters['edition/getCompetitionName'](registration.competition_id) }}
              </v-chip>
            </template>
            <span>{{ $t('views.participants.fields.competition') }}</span>
          </v-tooltip>

          <v-tooltip bottom eager>
            <template v-slot:activator="{on}">
              <v-chip v-on="on" color="indigo" text-color="white" class="ma-1">
                <v-icon dark small left class="ml-1">fas fa-birthday-cake</v-icon>
                {{ $fd(registration.birthdate) }}
              </v-chip>
            </template>
            <span>{{ $t('views.participants.fields.birthday') }}</span>
          </v-tooltip>

          <v-tooltip bottom eager>
            <template v-slot:activator="{on}">
              <v-chip v-on="on" :color="'male' === registration.gender ? 'light-blue' : 'pink lighten-2'"
                      text-color="white" class="ma-1">
                <v-icon dark>
                  fas fa-{{ 'male' === registration.gender ? 'mars' : 'venus' }}
                </v-icon>
              </v-chip>
            </template>
            <span>{{ $t('views.participants.choices.gender.' + registration.gender) }}</span>
          </v-tooltip>
        </td>
      </tr>

      <tr>
        <td colspan="2">
          <v-chip small :color="registration.isRegistered ? 'teal' : 'red'" text-color="white" class="ma-1">
            {{ $t('views.participants.choices.registered.' + registration.isRegistered) }}
          </v-chip>

          <v-chip small :color="0 === registration.status ? 'teal' : 'red'" text-color="white" class="ma-1">
            {{ $t('views.participants.choices.status.' + registration.status) }}
          </v-chip>

          <v-chip small :color="0 === registration.paymentStatus ? 'teal' : 'red'" text-color="white" class="ma-1">
            {{ $t('views.participants.choices.payment-status.' + registration.paymentStatus) }}
          </v-chip>

          <v-chip small :color="[0, '0'].indexOf(registration.permissionSlipStatus) > -1 ? 'teal' : 'warning'"
                  text-color="white" class="ma-1">
            {{ $t('views.participants.choices.permission-slip-status.' + registration.permissionSlipStatus) }}
          </v-chip>
        </td>
      </tr>

      <!-- Bib section -->
      <field-spacer></field-spacer>

      <tr>
        <td colspan="2" class="text-center pt-3 pb-3" v-if="registration.bib && registration.bib.code">
          <span class="font-weight-bold accent--text display-2">
            {{ $t('views.participants.fields.short-number') }}&nbsp;{{ registration.bib.code }}
          </span>
          &nbsp;
          <v-fade-transition mode="out-in">
            <v-tooltip key="bib-retrieved" left v-if="registration.bibRetrieved" eager>
              <template v-slot:activator="{on}">
                <v-icon large color="green" v-on="on">directions_run</v-icon>
              </template>
              <span>{{ $t('views.participants.bib-retrieved') }}</span>
            </v-tooltip>
            <v-tooltip key="bib-collect" left eager v-else>
              <template v-slot:activator="{on}">
                <v-icon large color="warning" v-on="on">inbox</v-icon>
              </template>
              <span>{{ $t('views.participants.bib-not-retrieved') }}</span>
            </v-tooltip>
          </v-fade-transition>
        </td>
        <td colspan="2" class="text-center pt-3 pb-3" v-else>
          <span class="font-weight-bold warning--text display-2 text-uppercase">
            {{ $t('views.participants.not-has-bib') }}
          </span>
        </td>
      </tr>

      <tr>
        <td colspan="2" class="text-center">
          <v-scale-transition origin="center center" mode="out-in">
            <v-btn rounded ripple depressed dark color="light-green" :loading="loading"
                   @click.prevent="assignBib"
                   v-if="!registration.bib || !registration.bib.code">
              {{ $t('views.participants.assign-bib') }}
            </v-btn>

            <v-btn key="btn-retrieve-bib" rounded ripple depressed dark color="light-green" :loading="loading"
                   @click.prevent="updateBibRetrieved(true)"
                   v-else-if="!registration.bibRetrieved">
              {{ $t('views.participants.give-bib') }}
            </v-btn>
            <v-btn key="btn-collect-bib" rounded ripple depressed dark color="blue-grey" :loading="loading"
                   @click.prevent="updateBibRetrieved(false)"
                   v-else>
              {{ $t('views.participants.collect-bib') }}
            </v-btn>
          </v-scale-transition>
        </td>
      </tr>

      <tr>
        <td colspan="2" class="text-center pa-2">
          <v-scale-transition origin="center center">
            <v-tooltip left
                       eager
                       v-if="registration.bib && registration.bib.code && !registration.bibRetrieved">
              <template v-slot:activator="{on}">
                <v-btn v-on="on" fab small ripple depressed dark color="light-green"
                       :loading="loading"
                       @click.prevent="openPrintBibLabel = true">
                  <v-icon>print</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('views.bib-labels-print-one.title') }}</span>
            </v-tooltip>
          </v-scale-transition>
        </td>
      </tr>

      <field-item :label="$t('views.participants.fields.comment')" v-if="!!registration.comment">
        {{ registration.comment }}
      </field-item>
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
        {{ registration.bib && registration.bib.code ? registration.bib.code : $t('views.participants.not-has-bib') }}
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

    <v-dialog v-model="showAssignForm" eager persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('views.participants.assign-bib') }}</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
                  type="number"
                  :label="$i18n.t('views.participants.fields.bib')"
                  v-model="assignBibNumber"
                  data-vv-name="assignBibNumber"
                  :data-vv-as="$i18n.t('views.participants.fields.bib')"
                  v-validate="'required'"
                  :error-messages="errors.collect('assignBibNumber')"
                  :disabled="loading"
                  @keydown.enter="doAssignBib"
                  outlined
                  clearable
                  required>
          </v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showAssignForm = false" :disabled="loading">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn color="accent" depressed :loading="loading" @click="doAssignBib">
            {{ $t('add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
  import {Canceler} from '@/api/Canceler';
  import {AssignBibRequest} from '@/api/models/request/AssignBibRequest';
  import {BibRetrievedRequest} from '@/api/models/request/BibRetrievedRequest';
  import {ChangeRegistrationResponse} from '@/api/models/responses/ChangeRegistrationResponse';
  import {RegistrationAnswerChoiceResponse} from '@/api/models/responses/RegistrationAnswerChoiceResponse';
  import {RegistrationAnswerResponse} from '@/api/models/responses/RegistrationAnswerResponse';
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {Registration} from '@/api/services/Registration';
  import Loading from '@/components/Loading.vue';
  import QuickPrintBibLabel from '@/components/QuickPrintBibLabel.vue';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import '@/styles/views/Participants/Details.scss';
  import {SnackbarMessage} from '@/snackbars/SnackbarMessage';
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
    components: {QuickPrintBibLabel, Loading, FieldItem, FieldSection, FieldSpacer},
  })
  export default class ParticipantCard extends mixins(AjaxContent) {
    @Prop({type: Object, required: true})
    public registration!: RegistrationResponse;

    public showExtraSection: boolean = true;

    public showRegistrationSection: boolean = false;

    public showPermissionSlipSection: boolean = false;

    public showPersonalSection: boolean = false;

    public showBibSection: boolean = false;

    public showPaymentSection: boolean = false;

    public showAssignForm: boolean = false;

    public assignBibNumber: string = '';

    public openPrintBibLabel: boolean = false;

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

    public async assignBib(): Promise<void> {
      this.showAssignForm = true;
    }

    public async doAssignBib(): Promise<void> {
      if (!await this.$validator.validateAll()) {
        return;
      }

      this.loading = true;
      const date = (new Date());

      const res = await this.fetchData<ChangeRegistrationResponse>((canceler: Canceler) =>
              this.$api.get<Registration>(Registration).change(new AssignBibRequest(
                      this.registration.id,
                      this.$store.state.auth.fullName,
                      date,
                      this.assignBibNumber,
              ), canceler), true);

      if (res) {
        if (res.success) {
          this.registration.hasBib = true;
          this.registration.bib = {
            id: 0,
            code: this.assignBibNumber,
            codeAsInteger: Number(this.assignBibNumber),
            teamPart: '',
            particpantPart: '',
            bibdef: 0,
            affected: '' !== this.assignBibNumber ? date.getTime() / 1000 : 0,
          };
          this.$store.commit('participant/updateSelection', this.registration);
          this.assignBibNumber = '';
          this.showAssignForm = false;
        } else {
          this.$snackbar.snack(new SnackbarMessage(res.message, 'error'));
        }
      }

      this.loading = false;
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
          this.$snackbar.snack(new SnackbarMessage(res.message, 'error'));
        }
      }

      this.loading = false;
    }
  }
</script>
