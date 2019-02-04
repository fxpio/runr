<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height>
    <v-layout justify-center row>
      <transition name="fade" mode="out-in">
        <v-flex sm10 md8 lg6 xl4 v-if="!loading">
          <v-slide-x-reverse-transition mode="out-in">
            <search-page v-if="pageState === 'search-page'"
                         @search="onSearch">
            </search-page>

            <result-empty-page v-if="pageState === 'result-empty-page'"></result-empty-page>

            <result-list-page v-if="pageState === 'result-list-page'"
                              :items-per-page="itemsPerPage"
                              :result-size="searchSize"
                              :result-page="searchPage"
                              :result="searchResult"
                              @item-selection="searchResultCursor = $event"
                              @change-pagination="onChangePagination">
            </result-list-page>

            <result-detail-page v-if="pageState === 'result-detail-page'"
                                :registration="registration">
            </result-detail-page>
          </v-slide-x-reverse-transition>
        </v-flex>

        <loading v-if="loading"></loading>
      </transition>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {RegistrationOptions} from '@/api/models/request/RegistrationOptions';
  import {ListResponse} from '@/api/models/responses/ListResponse';
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {Registration} from '@/api/services/Registration';
  import Loading from '@/components/Loading.vue';
  import SearchConfig from '@/forms/SearchConfig';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {EditionModuleState} from '@/stores/edition/EditionModuleState';
  import ResultDetailPage from '@/views/Participants/ResultDetailPage.vue';
  import ResultEmptyPage from '@/views/Participants/ResultEmptyPage.vue';
  import ResultListPage from '@/views/Participants/ResultListPage.vue';
  import SearchPage from '@/views/Participants/SearchPage.vue';
  import {mixins} from 'vue-class-component';
  import {MetaInfo} from 'vue-meta';
  import {Component, Watch} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {SearchPage, ResultListPage, ResultDetailPage, ResultEmptyPage, Loading},
  })
  export default class Participants extends mixins(AjaxContent) {
    private searchResult: RegistrationResponse[]|null = null;

    private searchResultCursor: number|null = null;

    private searchPage: number = 1;

    private searchSize: number = 0;

    private itemsPerPage: number = 10;

    private stateUnwatch?: () => void;

    private cacheSearchConfig: SearchConfig|null = null;

    public metaInfo(): MetaInfo {
      return {
        title: this.$i18n.t('views.participants.title') as string,
      };
    }

    public get pageState(): string {
      if (null === this.searchResult) {
        return 'search-page';
      } else if (this.searchResult.length === 0) {
        return 'result-empty-page';
      } else if (null === this.searchResultCursor) {
        return 'result-list-page';
      }

      return 'result-detail-page';
    }

    public get registration(): RegistrationResponse|undefined {
      return this.searchResult && this.searchResult.length > 0 && null !== this.searchResultCursor
              ? this.searchResult[this.searchResultCursor]
              : undefined;
    }

    public beforeMount(): void {
      this.stateUnwatch = this.$store.watch((state: EditionModuleState) => state.edition.currentCompetitions,
              this.watchEditionCompetitions);

      this.$root.$on('participants-back-button-action', this.onComponentBackButtonAction);
      this.$root.$on('scanner-decode', this.onSearch);
    }

    public mounted(): void {
      this.changeBackButton(this.searchResult);
    }

    public destroyed(): void {
      if (this.stateUnwatch) {
        this.stateUnwatch();
      }

      this.$root.$off('participants-back-button-action', this.onComponentBackButtonAction);
      this.$root.$off('scanner-decode', this.onSearch);
    }

    @Watch('searchResult')
    public changeBackButton(value: RegistrationResponse[]|null): void {
      this.$root.$emit('participants-change-back-button', null === value);
    }

    public async onSearch(config: SearchConfig|string): Promise<void> {
      config = typeof config === 'string' ? new SearchConfig(config) : config;
      this.cacheSearchConfig = config;
      this.resetSearch(config.startPagination);
      let requestOpts: RegistrationOptions = {
        itemsPerPage: 1,
        search: {
          id: -1,
        },
      };

      if (config.registrationId) {
        const regId = Number(config.registrationId);

        if (!isNaN(regId)) {
          requestOpts = {
            itemsPerPage: 1,
            search: {
              id: regId,
            },
          };
        }
      } else if (!isNaN(Number(config.searchValue))) {
        requestOpts = {
          itemsPerPage: this.itemsPerPage,
          from: this.getPaginationFromValue(config.startPagination),
          search: {
            bibNumber: config.searchValue,
            competition: config.selectedCompetition,
          },
        };
      } else {
        requestOpts = {
          itemsPerPage: this.itemsPerPage,
          from: this.getPaginationFromValue(config.startPagination),
          search: {
            lastname: config.searchValue,
            competition: config.selectedCompetition,
          },
        };
      }

      const res = await this.fetchData<ListResponse<RegistrationResponse>>(() =>
              this.$api.get<Registration>(Registration).list(requestOpts));
      if (res) {
        this.searchResult = res.results;
        this.searchSize = res.totalHits;
      } else {
        this.searchResult = [];
      }

      if (1 === this.searchSize) {
        this.searchResultCursor = 0;
      }
    }

    public async onChangePagination(newPage: number): Promise<void> {
      let registrationId: string|null = null;
      let searchValue: string = '';
      let selectedCompetition: number[] = [];

      if (this.cacheSearchConfig) {
        registrationId = this.cacheSearchConfig.registrationId;
        searchValue = this.cacheSearchConfig.searchValue;
        selectedCompetition = this.cacheSearchConfig.selectedCompetition;
      }

      await this.onSearch(new SearchConfig(registrationId, searchValue, selectedCompetition, newPage));
    }

    private onComponentBackButtonAction(): void {
      if (null !== this.searchResultCursor && null !== this.searchResult && this.searchResult.length > 1) {
        this.searchResultCursor = null;
      } else {
        this.resetSearch();
      }
    }

    private resetSearch(startPage: number = 1): void {
      this.searchResult = null;
      this.searchResultCursor = null;
      this.searchPage = startPage;
      this.searchSize = 0;
    }

    private getPaginationFromValue(page: number): number {
      return this.itemsPerPage * (page - 1);
    }

    private watchEditionCompetitions(): void {
      this.resetSearch();
    }
  }
</script>
