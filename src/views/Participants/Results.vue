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
      <v-card-title primary-title>
        <div :class="$store.state.darkMode.enabled ? 'headline' : 'headline primary--text'">
          {{ $t('views.participants.title') }}
        </div>
      </v-card-title>

      <v-data-table
              :headers="headers"
              :items="cacheResults ? cacheResults.results : []"
              :total-items="cacheResults ? cacheResults.total : 0"
              :pagination.sync="pagination"
              :no-data-text="$t('views.participants.search-not-found')"
              :rows-per-page-items="[$store.state.participant.pageSize]"
              item-key="id"
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
                {{ $t('views.participants.choices.registered.' + props.item.isRegistered) }}
              </v-chip>

              <v-chip small :color="0 === props.item.status ? 'teal' : 'red'" text-color="white">
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

      <v-card-actions v-if="0 === cacheResults.total">
        <v-btn depressed block ripple color="accent" @click.prevent="$routerBack.back()">
          {{ $t('views.participants.retry-search') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <loading v-if="loading"></loading>
  </transition>
</template>

<script lang="ts">
  import {RegistrationOptions} from '@/api/models/request/RegistrationOptions';
  import {ListResponse} from '@/api/models/responses/ListResponse';
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {Registration} from '@/api/services/Registration';
  import ErrorMessage from '@/components/ErrorMessage.vue';
  import Loading from '@/components/Loading.vue';
  import {ICompetition} from '@/db/tables/ICompetition';
  import {IEdition} from '@/db/tables/IEdition';
  import SearchConfig from '@/forms/SearchConfig';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {EditionModuleState} from '@/stores/edition/EditionModuleState';
  import {CacheResults} from '@/stores/participant/CacheResults';
  import '@/styles/views/Participants/Results.scss';
  import PaginationConfig from '@/vuetify/datatable/PaginationConfig';
  import {mixins} from 'vue-class-component';
  import {MetaInfo} from 'vue-meta';
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {Route} from 'vue-router';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {ErrorMessage, Loading},
  })
  export default class Results extends mixins(AjaxContent) {
    public headers: object[] = [];

    public pagination: PaginationConfig = {
      page: this.getSearchStartPage(),
      descending: false,
      rowsPerPage: this.$store.state.participant.pageSize,
      sortBy: null,
      totalItems: 0,
    };

    public searchConfig: SearchConfig = new SearchConfig(
            this.getSearchValue(),
            this.getSearchCompetitionIds(),
            this.pagination.page,
    );

    public cacheResults: CacheResults|null = null;

    private stateUnwatch?: () => void;

    public metaInfo(): MetaInfo {
      return {
        title: this.$i18n.t('views.participants.found-participants') as string,
      };
    }

    public beforeRouteEnter(to: Route, from: Route|null, next: (vm?: any) => void): void {
      next((vm: Vue) => {
        const redirect = !(vm.$route.query as any).s
                ? {name: 'participants'}
                : undefined;

        next(redirect);
      });
    }

    public beforeMount(): void {
      this.stateUnwatch = this.$store.watch((state: EditionModuleState) => state.edition.current,
              this.watchEdition);

      this.loading = true;
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

      this.$store.commit('participant/setSearchConfig', this.searchConfig);
    }

    public async mounted(): Promise<void> {
      let cacheResults = this.$store.state.participant.cacheResults;

      if (cacheResults && cacheResults.id !== this.searchConfig.id) {
        this.$store.commit('participant/resetCache');
        cacheResults = null;
      }

      if (cacheResults) {
        this.cacheResults = cacheResults;
        this.previousError = cacheResults.error;
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

    @Watch('pagination')
    public async watchPagination(config: PaginationConfig): Promise<void> {
      if (null !== this.cacheResults && this.searchConfig.startPagination !== config.page) {
        this.$router.replace({
          name: this.$route.name,
          params: this.$route.params,
          query: Object.assign({}, this.$route.query, {p: config.page}),
        });

        this.searchConfig = new SearchConfig(
                this.searchConfig.searchValue,
                this.searchConfig.selectedCompetitions,
                config.page,
        );

        await this.requestContent();
      }
    }

    public itemSelection(index: number, replace: boolean = false): void {
      if (this.cacheResults && this.cacheResults.results[index]) {
        const selection = this.cacheResults.results[index] as RegistrationResponse;
        const route = {
          name: 'participants-details',
          params: {
            id: String(selection.id),
          },
        };

        this.$store.commit('participant/setSelection', selection);

        if (replace) {
          this.$router.replace(route);
        } else {
          this.$router.push(route);
        }
      }
    }

    public getCompetitionName(id: number): string {
      const competitions = this.$store.state.edition.currentCompetitions;

      if (competitions && competitions[id]) {
        return (competitions[id] as ICompetition).name;
      }

      return String(id);
    }

    private getSearchValue(): string {
      return decodeURIComponent(String((this.$route.query as any).s));
    }

    private getSearchCompetitionIds(): number[] {
      const searchCompetitionIds = decodeURIComponent((this.$route.query as any).cids).split(',');
      const values = [];

      for (const id of searchCompetitionIds) {
        const value = Number(id);

        if (id && !isNaN(value)) {
          values.push(value);
        }
      }

      return values;
    }

    private getSearchStartPage(): number {
      let value = Number(decodeURIComponent(String((this.$route.query as any).p)));

      if (isNaN(value)) {
        value = 1;
        this.$router.replace({
          name: this.$route.name,
          params: this.$route.params,
          query: Object.assign({}, this.$route.query, {p: value}),
        });
      }

      return value;
    }

    private getPaginationFromValue(page: number): number {
      return this.$store.state.participant.pageSize * (page - 1);
    }

    private async requestContent() {
      let requestOpts: RegistrationOptions = {
        itemsPerPage: this.$store.state.participant.pageSize,
        from: this.getPaginationFromValue(this.searchConfig.startPagination),
        search: {
          lastname: this.searchConfig.searchValue,
          competition: this.searchConfig.selectedCompetitions,
        },
      };

      if (!isNaN(Number(this.searchConfig.searchValue))) {
        requestOpts = {
          itemsPerPage: this.$store.state.participant.pageSize,
          from: this.getPaginationFromValue(this.searchConfig.startPagination),
          search: {
            bibNumber: this.searchConfig.searchValue,
            competition: this.searchConfig.selectedCompetitions,
          },
        };
      }

      let cacheResults;
      const res = await this.fetchData<ListResponse<RegistrationResponse>>(() =>
              this.$api.get<Registration>(Registration).list(requestOpts));

      if (res) {
        cacheResults = new CacheResults(this.searchConfig.id, res.totalHits, res.results);
      } else {
        cacheResults = new CacheResults(this.searchConfig.id, 0, [], this.previousError);
      }

      this.$store.commit('participant/setResults', cacheResults);
      this.cacheResults = cacheResults;
      this.pagination.page = this.searchConfig.startPagination;

      if (1 === this.cacheResults.total) {
        this.itemSelection(0, true);
      } else {
        this.loading = false;
      }
    }

    private watchEdition(edition: IEdition|null, previousEdition?: IEdition|null): void {
      if (previousEdition) {
        this.$router.replace({name: 'participants'});
      }
    }
  }
</script>
