<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-card flat
          key="search-page">
    <v-btn depressed
           block
           ripple
           color="accent"
           class="btn-content no-bottom-radius mt-0"
           :disabled="!enableScanner"
           @click="$emit('start-scanner')">
      <v-img width="48"
             height="48"
             :src="require('@/assets/qrcode-scan-icon.svg')">
      </v-img>
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
                v-validate="'required'"
                :error-messages="errors.collect('searchValue')"
                @keyup.enter="search()"
                outline
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
                outline>
          <template slot="item" slot-scope="data">{{ data.item.label }}</template>
        </v-select>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn depressed block ripple color="accent" :disabled="!searchValue" v-on:click="search()">
        <v-icon>search</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import {ICompetition} from '@/db/tables/ICompetition';
  import CompetitionItem from '@/forms/CompetitionItem';
  import SearchConfig from '@/forms/SearchConfig';
  import {EditionModuleState} from '@/stores/edition/EditionModuleState';
  import {Component, Prop, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class SearchPage extends Vue {
    @Prop({type: Boolean, default: false})
    public enableScanner!: boolean;

    private searchValue: string = '';

    private selectedCompetition: CompetitionItem|null = null;

    private competitions: CompetitionItem[] = [];

    private stateUnwatch?: () => void;

    public beforeMount(): void {
      this.watchEditionCompetitions(this.$store.state.edition.currentCompetitions);
      this.stateUnwatch = this.$store.watch((state: EditionModuleState) => state.edition.currentCompetitions,
              this.watchEditionCompetitions);
    }

    public destroyed(): void {
      if (this.stateUnwatch) {
        this.stateUnwatch();
      }
    }

    public async search(): Promise<void> {
      if (!await this.$validator.validateAll()) {
        return;
      }

      this.$emit('search', new SearchConfig(
              null,
              this.searchValue,
              this.selectedCompetition ? [this.selectedCompetition.id] : [],
      ));
    }

    private watchEditionCompetitions(currentCompetitions: Record<number, ICompetition>|null): void {
      if (currentCompetitions) {
        this.competitions = [];

        for (const item of Object.values(currentCompetitions) as ICompetition[]) {
          this.competitions.push(new CompetitionItem(item.id, item.name));
        }
      }
    }
  }
</script>
