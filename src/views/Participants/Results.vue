<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height>
    <v-row no-gutters justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <transition name="fade" mode="out-in">
          <error-message :message="previousError.message" v-if="!loading && !!previousError">
            <v-btn outlined color="accent" class="mt-3" @click.prevent="requestContent">{{ $t('retry') }}</v-btn>
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
                    :server-items-length="cacheResults ? cacheResults.total : 0"
                    :options.sync="tableOptions"
                    :no-data-text="$t('views.participants.search-not-found')"
                    :footer-props.sync="tableFooterProps"
                    item-key="id"
                    class="d-block">
              <template v-slot:item="{index, item}">
                <tr>
                  <td class="participant-item pt-2 pb-2" @click="itemSelection(index)">
                    <div>
                      <span class="primary--text">
                        {{ $store.getters['edition/getCompetitionName'](item.competition_id) }}
                      </span>
                    </div>
                    <div class="subtitle-1">
                      <span>{{ item.firstname }}</span>
                      &nbsp;
                      <strong class="text-uppercase">{{ item.lastname }}</strong>
                    </div>
                    <div>
                      <span>{{ $t('views.participants.bib-label') }}</span>
                      &nbsp;
                      <span v-if="item.bib && item.bib.code">{{ item.bib.code }}</span>
                      <span v-else class="warning--text">{{ $t('views.participants.no-bib') }}</span>
                    </div>
                    <div>
                      <v-chip small :color="item.isRegistered ? 'teal' : 'red'" text-color="white" class="ma-1">
                        {{ $t('views.participants.choices.registered.' + item.isRegistered) }}
                      </v-chip>

                      <v-chip small :color="0 === item.status ? 'teal' : 'red'" text-color="white" class="ma-1">
                        {{ $t('views.participants.choices.status.' + item.status) }}
                      </v-chip>
                    </div>
                  </td>
                  <td class="participant-item" @click="itemSelection(item.index)">
                    <v-tooltip left v-if="item.bib && item.bib.code && item.bibRetrieved" eager>
                      <template v-slot:activator="{on}">
                        <v-icon color="green" v-on="on">directions_run</v-icon>
                      </template>
                      <span>{{ $t('views.participants.bib-retrieved') }}</span>
                    </v-tooltip>

                    <v-tooltip left v-else-if="item.bib && item.bib.code" eager>
                      <template v-slot:activator="{on}">
                        <v-icon color="grey" v-on="on">inbox</v-icon>
                      </template>
                      <span>{{ $t('views.participants.bib-not-retrieved') }}</span>
                    </v-tooltip>
                  </td>
                </tr>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Canceler} from '@/api/Canceler';
  import {RegistrationOptions} from '@/api/models/request/RegistrationOptions';
  import {ListResponse} from '@/api/models/responses/ListResponse';
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {Registration} from '@/api/services/Registration';
  import ErrorMessage from '@/components/ErrorMessage.vue';
  import Loading from '@/components/Loading.vue';
  import {IEdition} from '@/db/tables/IEdition';
  import SearchConfig from '@/forms/SearchConfig';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {EditionModuleState} from '@/stores/edition/EditionModuleState';
  import {CacheResults} from '@/stores/participant/CacheResults';
  import '@/styles/views/Participants/Results.scss';
  import {mixins} from 'vue-class-component';
  import {MetaInfo} from 'vue-meta';
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {Route} from 'vue-router';
  import {DataOptions} from 'vuetify';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {ErrorMessage, Loading},
  })
  export default class Results extends mixins(AjaxContent) {
    public headers: object[] = [];

    public tableOptions: DataOptions = {
        page: this.getSearchStartPage(),
        itemsPerPage: this.$store.state.participant.pageSize,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false,
    };

    public tableFooterProps: any  = {
        'items-per-page-options': [],
        'items-per-page-text': null,
        'disable-items-per-page': true,
        'show-current-page': true,
        'show-first-last-page': true,
    };

    public searchConfig: SearchConfig = new SearchConfig(
            this.getSearchValue(),
            this.getSearchCompetitionIds(),
            this.tableOptions.page,
    );

    public cacheResults: CacheResults|null = null;

    private stateUnwatch?: () => void;

    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.participants.found-participants') as string,
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

    public async beforeRouteUpdate(to: Route, from: Route, next: () => void): Promise<void> {
      const toPage = Number(decodeURIComponent(String((to.query as any).p)));

      if (!isNaN(toPage)) {
        this.searchConfig = new SearchConfig(
                this.getSearchValue(),
                this.getSearchCompetitionIds(),
                toPage,
        );

        await this.requestContent();
      }

      next();
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

    @Watch('tableOptions')
    public async watchTableOptions(opts: DataOptions): Promise<void> {
      if (null !== this.cacheResults && this.searchConfig.startPagination !== opts.page) {
        await this.$router.replace({
          name: this.$route.name as string,
          params: this.$route.params,
          query: Object.assign({}, this.$route.query, {p: opts.page}),
        });
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
      const res = await this.fetchData<ListResponse<RegistrationResponse>>((canceler: Canceler) =>
              this.$api.get<Registration>(Registration).list(requestOpts, canceler));

      if (res) {
        cacheResults = new CacheResults(this.searchConfig.id, res.totalHits, res.results);
      } else {
        cacheResults = new CacheResults(this.searchConfig.id, 0, [], this.previousError);
      }

      this.$store.commit('participant/setResults', cacheResults);
      this.cacheResults = cacheResults;
      this.tableOptions.page = this.searchConfig.startPagination;

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
