<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-layout column justify-center
            key="result-detail-page">

    <v-subheader class="primary--text">
      {{ $t('views.participants.title') }}
    </v-subheader>

    <v-card flat width="100%">
      <v-card-title class="headline accent--text">
        <span>{{ registration.firstname }}</span>
        &nbsp;
        <span class="text-uppercase">{{ registration.lastname }}</span>
      </v-card-title>

      <table class="v-datatable v-table participant-detail">
        <tbody>
          <tr>
            <td colspan="2">
              <v-chip color="accent" text-color="white">
                <v-icon dark left>directions</v-icon>
                {{ getCompetitionName(registration.competition_id) }}
              </v-chip>

              <v-chip small :color="registration.isRegistered ? 'teal' : 'red'" text-color="white">
                {{ $t('views.participants.choices.registered.' + registration.isRegistered) }}
              </v-chip>

              <v-chip small :color="0 === registration.status ? 'teal' : 'red'" text-color="white">
                {{ $t('views.participants.choices.status.' + registration.status) }}
              </v-chip>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold subheading text-uppercase grey--text">
              {{ $t('views.participants.fields.bib') }}
            </td>
            <td class="font-weight-bold deep-orange--text title" v-if="registration.hasBib">
              <span>{{ registration.bib.code }}</span>
              &nbsp;
              <v-tooltip left v-if="registration.bibRetrieved">
                <v-icon color="green" slot="activator">directions_run</v-icon>
                <span>{{ $t('views.participants.bib-retrieved') }}</span>
              </v-tooltip>
              <v-tooltip left v-else>
                <v-icon color="grey" slot="activator">archive</v-icon>
                <span>{{ $t('views.participants.bib-not-retrieved') }}</span>
              </v-tooltip>
            </td>
            <td v-else>
              <v-chip small color="warning" text-color="white">
                {{ $t('views.participants.not-has-bib') }}
              </v-chip>
            </td>
          </tr>
          <tr>
            <td class="font-weight-bold">{{ $t('views.participants.fields.registration-code') }}</td>
            <td>{{ registration.registrationCode }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">{{ $t('views.participants.fields.email') }}</td>
            <td>{{ registration.email }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">{{ $t('views.participants.fields.gender') }}</td>
            <td>{{ $t('views.participants.choices.gender.' + registration.gender) }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">{{ $t('views.participants.fields.birthday') }}</td>
            <td>{{ formatDate(registration.birthdate) }}</td>
          </tr>
        </tbody>
      </table>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {ICompetition} from '@/db/tables/ICompetition';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import moment from 'moment';
  import '@/styles/views/ParticipantsResultDetailPage.scss';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class ResultDetailPage extends Vue {
    @Prop(Object)
    public registration!: RegistrationResponse;

    public getCompetitionName(id: number): string {
      const competitions = this.$store.state.edition.currentCompetitions;

      if (competitions && competitions[id]) {
        return (competitions[id] as ICompetition).name;
      }

      return String(id);
    }

    public formatDate(date: string): string {
      return moment(date, 'YYYYMMDD').format('L');
    }
  }
</script>
