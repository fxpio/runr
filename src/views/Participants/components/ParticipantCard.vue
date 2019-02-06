<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
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
            {{ $store.getters['edition/getCompetitionName'](registration.competition_id) }}
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
            <v-icon large color="warning" slot="activator">inbox</v-icon>
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
        {{ $store.getters['edition/getCompetitionName'](registration.competition_id) }}
      </field-item>

      <field-item :label="$t('views.participants.fields.amount')">
        {{ $fc(registration.amount) }}
      </field-item>

      <field-item :label="$t('views.participants.fields.registration-date')">
        {{ $fd(registration.registrationDate) }}
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
          {{ $fd(registration.permissionSlipValidUntil) }}
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
        {{ $fd(registration.birthdate) }}
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
        {{ registration.bibRetrieved ? $fd(registration.bibRetrievedAt) : '' }}
      </field-item>

      <!-- Payment section -->
      <field-section>
        {{ $t('views.participants.sections.payment') }}
      </field-section>

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
    </table>
  </v-card>
</template>

<script lang="ts">
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import '@/styles/views/Participants/Details.scss';
  import FieldItem from '@/views/Participants/components/FieldItem.vue';
  import FieldSection from '@/views/Participants/components/FieldSection.vue';
  import FieldSpacer from '@/views/Participants/components/FieldSpacer.vue';
  import {MetaInfo} from 'vue-meta';
  import {Component, Prop, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {FieldItem, FieldSection, FieldSpacer},
  })
  export default class ParticipantCard extends Vue {
    @Prop(Object)
    public registration!: RegistrationResponse;

    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.participants.details-title', {
          firstname: this.registration.firstname,
          lastname: this.registration.lastname,
        }) as string,
      };
    }
  }
</script>
