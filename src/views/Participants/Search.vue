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
        <v-card flat>
          <v-btn depressed
                 block
                 ripple
                 color="accent"
                 class="btn-content no-bottom-radius mt-0"
                 :disabled="!$store.state.scanner.enabled"
                 @click="$store.commit('scanner/open')">
            <v-icon x-large>fas fa-qrcode</v-icon>
            <div class="mt-3">{{ $t('scanner.scan-bib-withdrawal-card') }}</div>
          </v-btn>

          <v-card-title primary-title>
            <div :class="$store.state.darkMode.enabled ? 'headline' : 'headline primary--text'">
              {{ $t('views.participants.title') }}
            </div>
          </v-card-title>

          <v-card-text class="pb-0">
            <v-form ref="form" @submit.prevent>
              <v-text-field
                      :label="$i18n.t('views.participants.search-field-label')"
                      v-model="searchValue"
                      data-vv-name="searchValue"
                      :data-vv-as="$i18n.t('views.participants.search-field-label')"
                      v-validate=""
                      :error-messages="errors.collect('searchValue')"
                      @keydown.enter="search()"
                      outlined
                      clearable
                      required>
              </v-text-field>

              <v-select
                      :items="competitions"
                      :loading="0 === competitions.length"
                      v-model="selectedCompetition"
                      item-value="id"
                      item-text="label"
                      :label="$t('forms.competitions.all')"
                      return-object
                      chips
                      single-line
                      clearable
                      outlined>
                <template slot="item" slot-scope="data">{{ data.item.label }}</template>
              </v-select>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn depressed block ripple color="accent" v-on:click="search()">
              <v-icon>search</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {ICompetition} from '@/db/tables/ICompetition';
  import CompetitionItem from '@/forms/CompetitionItem';
  import SearchConfig from '@/forms/SearchConfig';
  import {EditionModuleState} from '@/stores/edition/EditionModuleState';
  import {MetaInfo} from 'vue-meta';
  import {Component, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class Search extends Vue {
    private searchValue: string = '';

    private selectedCompetition: CompetitionItem|null = null;

    private competitions: CompetitionItem[] = [];

    private stateUnwatch?: () => void;

    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.participants.title') as string,
      };
    }

    public beforeMount(): void {
      this.watchEditionCompetitions(this.$store.state.edition.currentCompetitions);
      this.stateUnwatch = this.$store.watch((state: EditionModuleState) => state.edition.currentCompetitions,
              this.watchEditionCompetitions);

      this.$root.$on('scanner-decode', this.search);

      if (this.$store.state.participant.cacheSearchConfig) {
        this.searchValue = this.$store.state.participant.cacheSearchConfig.searchValue;
      }
    }

    public destroyed(): void {
      if (this.stateUnwatch) {
        this.stateUnwatch();
      }

      this.$root.$off('scanner-decode', this.search);
    }

    public async search(registrationId?: string): Promise<void> {
      if (!registrationId && !await this.$validator.validateAll()) {
        return;
      }

      if (registrationId && !isNaN(Number(registrationId))) {
        this.$store.commit('participant/setSearchConfig', null);
        await this.$router.push({name: 'participants-details', params: {id: registrationId}});
      } else {
        const competitionIds = this.selectedCompetition ? [this.selectedCompetition.id] : [];
        const searchValue = '' === this.searchValue ? encodeURIComponent('*') : this.searchValue;
        const searchConfig = new SearchConfig(searchValue, competitionIds);

        this.$store.commit('participant/setSearchConfig', searchConfig);
        await this.$router.push({name: 'participants-results', query: {
          s: encodeURIComponent(searchConfig.searchValue),
          cids: encodeURIComponent(searchConfig.selectedCompetitions.join(',')),
        }});
      }
    }

    private watchEditionCompetitions(currentCompetitions: Record<number, ICompetition>|null): void {
      if (currentCompetitions) {
        this.competitions = [];
        const selectedIds: number[] = this.$store.state.participant.cacheSearchConfig
                ? this.$store.state.participant.cacheSearchConfig.selectedCompetitions
                : [];

        for (const item of Object.values(currentCompetitions) as ICompetition[]) {
          const compItem = new CompetitionItem(item.id, item.name);
          this.competitions.push(compItem);

          if (selectedIds.indexOf(item.id) > -1) {
            this.selectedCompetition = compItem;
          }
        }
      }
    }
  }
</script>
