<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-layout column align-center justify-center
            key="result-list-page">

    <v-card flat width="100%">
      <v-card-title primary-title>
        <div :class="$store.state.darkMode.enabled ? 'headline' : 'headline primary--text'">
          {{ $t('views.participants.title') }}
        </div>
      </v-card-title>

      <v-data-table
              :headers="headers"
              :items="result"
              :total-items="resultSize"
              :pagination.sync="pagination"
              item-key="id"
              :rows-per-page-items="[itemsPerPage]"
              class="d-block">
        <template slot="items" slot-scope="props">
          <td class="participant-item pt-2 pb-2" @click="itemSelection(props.index)">
            <div>
              <span class="primary--text">{{ getCompetitionName(props.item.competition_id) }}</span>
            </div>
            <div class="subheading">
              <span>{{ props.item.firstname }}</span>
              &nbsp;
              <strong class="text-uppercase">{{ props.item.lastname }}</strong>
            </div>
            <div>
              <span>{{ $t('views.participants.bib-label') }}</span>
              &nbsp;
              <span v-if="props.item.bib && props.item.bib.code">{{ props.item.bib.code }}</span>
              <span v-else class="warning--text">{{ $t('views.participants.no-bib') }}</span>
            </div>
            <div>
              <v-chip small :color="props.item.isRegistered ? 'teal' : 'red'" text-color="white">
                <v-icon dark left>{{ props.item.isRegistered ? 'check_circle' : 'report' }}</v-icon>
                {{ $t('views.participants.choices.registered.' + props.item.isRegistered) }}
              </v-chip>

              <v-chip small :color="0 === props.item.status ? 'teal' : 'red'" text-color="white">
                <v-icon dark left>{{ 0 === props.item.status ? 'check_circle' : 'report' }}</v-icon>
                {{ $t('views.participants.choices.status.' + props.item.status) }}
              </v-chip>
            </div>
          </td>
          <td class="participant-item" @click="itemSelection(props.index)">
            <v-tooltip left v-if="props.item.hasBib && props.item.bibRetrieved">
              <v-icon color="green" slot="activator">directions_run</v-icon>
              <span>{{ $t('views.participants.bib-retrieved') }}</span>
            </v-tooltip>

            <v-tooltip left v-else-if="props.item.hasBib">
              <v-icon color="grey" slot="activator">archive</v-icon>
              <span>{{ $t('views.participants.bib-not-retrieved') }}</span>
            </v-tooltip>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {ICompetition} from '@/db/tables/ICompetition';
  import PaginationConfig from '@/vuetify/datatable/PaginationConfig';
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import '@/styles/views/ParticipantsResultListPage.scss';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class ResultListPage extends Vue {
    @Prop(Number)
    public itemsPerPage!: number;

    @Prop(Number)
    public resultSize!: number;

    @Prop(Number)
    public resultPage!: number;

    @Prop(Array)
    public result!: RegistrationResponse[];

    public headers: object[] = [];

    public pagination: PaginationConfig = {
      page: this.resultPage,
      descending: false,
      rowsPerPage: this.itemsPerPage,
      sortBy: null,
      totalItems: this.resultSize,
    };

    public beforeMount(): void {
      this.headers = [
        {
          text: this.$t('views.participants.found-participants'),
          align: 'left',
          sortable: false,
          value: 'lastname',
        },
        {
          align: 'center',
          sortable: false,
        },
      ];
    }

    @Watch('pagination')
    public watchPagination(config: PaginationConfig): void {
      if (this.resultPage !== config.page) {
        this.$emit('change-pagination', config.page);
      }
    }

    public itemSelection(index: number): void {
      this.$emit('item-selection', index);
    }

    public getCompetitionName(id: number): string {
      const competitions = this.$store.state.edition.currentCompetitions;

      if (competitions && competitions[id]) {
        return (competitions[id] as ICompetition).name;
      }

      return String(id);
    }
  }
</script>
