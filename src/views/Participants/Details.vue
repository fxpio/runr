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
  import moment from 'moment';
  import {mixins} from 'vue-class-component';
  import {MetaInfo} from 'vue-meta';
  import {Component} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {ErrorMessage},
  })
  export default class Details extends mixins(AjaxContent) {
    public registration!: RegistrationResponse;

    private stateUnwatch?: () => void;

    public metaInfo(): MetaInfo {
      return {
        title: this.title,
      };
    }

    public get title(): string {
      return this.$i18n.t('views.participants.title') as string;
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

    public formatDate(date: string): string {
      return moment(date, 'YYYYMMDD').format('L');
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
