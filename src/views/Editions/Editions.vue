<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height>
    <v-fab-transition>
      <v-btn
              color="accent"
              key="add"
              ripple
              fab
              fixed
              bottom
              right
              v-if="$store.state.edition.all.length > 0 && !loading"
              @click="routeAdd"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-fade-transition mode="out-in">
      <v-layout justify-space-between row fill-height wrap v-if="!loading">
        <v-flex xs12>
          <v-subheader>{{ $t('views.editions.title') }}</v-subheader>

          <v-card v-if="$store.state.edition.all.length > 0">
            <v-list two-line>
              <swipe-item
                v-for="edition in $store.state.edition.all"
                :key="edition.id"
                @actions-left-opened="refresh(edition)"
              >
                <v-btn slot="action-left" class="btn-actions" block depressed color="success"
                       @click.stop=""
                >{{ $t('refresh') }}</v-btn>

                <v-btn slot="action-right" class="btn-actions" block depressed color="error"
                       @click="confirmDeleteEdition(edition)"
                >{{ $t('delete') }}</v-btn>

                <v-list-tile
                  @click="$store.dispatch('edition/select', edition.id)"
                >
                  <v-list-tile-action>
                    <v-scale-transition>
                      <v-icon v-if="$store.getters['edition/isSelected'](edition.id)" color="pink">star</v-icon>
                    </v-scale-transition>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title v-text="edition.name"></v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn small icon flat ripple @click.stop="refresh(edition)" class="d-inline-block">
                      <v-icon>refresh</v-icon>
                    </v-btn>

                    <v-btn small icon flat ripple @click.stop="deleteEdition(edition, $event)" class="d-inline-block">
                      <v-icon color="red">delete</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </swipe-item>
            </v-list>
          </v-card>

          <v-layout column align-center justify-center v-else>
            <v-icon size="14em" color="accent">flag</v-icon>
            <h2 class="pb-4 grey--text">{{ $t('views.editions.no-items') }}</h2>
            <v-btn color="accent" ripple class="mt-3" :to="{name: 'edition-add'}">{{ $t('views.editions.add-first') }}</v-btn>
          </v-layout>
        </v-flex>
      </v-layout>

      <loading v-if="loading" :fullscreen="false"></loading>
    </v-fade-transition>
  </v-container>
</template>

<script lang="ts">
  import {Canceler} from '@/api/Canceler';
  import {Credentials} from '@/api/Credentials';
  import {Competition} from '@/api/services/Competition';
  import {Edition} from '@/api/services/Edition';
  import Loading from '@/components/Loading.vue';
  import SwipeItem from '@/components/SwipeItem.vue';
  import {IEdition} from '@/db/tables/IEdition';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {Util} from '@/stores/edition/Util';
  import {getParent} from '@/utils/element';
  import {mixins} from 'vue-class-component';
  import {MetaInfo} from 'vue-meta';
  import {Component} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {SwipeItem, Loading},
  })
  export default class Editions extends mixins(AjaxContent) {
    public metaInfo(): MetaInfo {
      return {
        title: this.$i18n.t('views.editions.title') as string,
      };
    }

    public routeAdd(): void {
      this.$router.push({name: 'edition-add'});
    }

    public async refresh(edition: IEdition): Promise<void> {
      await this.fetchData(async (): Promise<IEdition> => {
        const credentials = {identifier: String(edition.id), apiKey: edition.apiKey} as Credentials;
        const res = await this.$api.get<Edition>(Edition).ping(credentials, this.previousRequest);
        this.previousRequest = new Canceler();
        const resCompetitions = await this.$api.get<Competition>(Competition).list(credentials, this.previousRequest);
        const uEdition = Util.convertEdition(res.edition, credentials.apiKey);
        const uCompetitions = Util.convertCompetitions(resCompetitions.competitions, edition.id);

        await this.$store.dispatch('edition/putCompetitions', uCompetitions);
        await this.$store.dispatch('edition/put', uEdition);

        return uEdition;
      });
    }

    public deleteEdition(edition: IEdition, e: Event): void {
      const $parent = getParent<SwipeItem>(e.target as HTMLElement, SwipeItem);

      if ($parent) {
        $parent.toggleRightAction();
      }
    }

    public async confirmDeleteEdition(edition: IEdition): Promise<void> {
      this.loading = true;
      await this.$store.dispatch('edition/delete', edition.id);
      this.loading = false;
    }
  }
</script>
