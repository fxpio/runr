<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <div class="fill-height">
    <v-fab-transition>
      <v-btn
              color="accent"
              key="add"
              ripple
              fab
              fixed
              bottom
              right
              v-if="$store.state.edition.all.length > 0 && !pending"
              @click="routeAdd"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-fade-transition mode="out-in">
      <v-container v-if="!pending">
        <v-row no-gutters>
          <v-col v-if="$store.state.edition.all.length > 0">
            <v-subheader class="primary--text">
              {{ $t('views.editions.title') }}
            </v-subheader>

            <v-card flat>
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
                         @click.stop="confirmDeleteEdition(edition)"
                  >{{ $t('delete') }}</v-btn>

                  <v-list-item
                    @click="$store.dispatch('edition/select', edition.id)"
                  >
                    <v-list-item-action>
                      <v-scale-transition origin="center center">
                        <v-icon v-if="$store.getters['edition/isSelected'](edition.id)" color="pink">star</v-icon>
                      </v-scale-transition>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title v-text="edition.name"></v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn small icon ripple @click.stop="refresh(edition)" class="d-inline-block">
                        <v-icon>refresh</v-icon>
                      </v-btn>

                      <v-btn small icon ripple @click.stop="deleteEdition(edition, $event)" class="d-inline-block">
                        <v-icon color="red">delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </swipe-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col class="text-center" v-else>
            <v-icon size="14em" color="accent">flag</v-icon>
            <h2 class="pb-4 grey--text">{{ $t('views.editions.no-items') }}</h2>
            <v-btn color="accent" ripple class="mt-3" :to="{name: 'editions-add'}">{{ $t('views.editions.add-first') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>

      <loading v-else></loading>
    </v-fade-transition>
  </div>
</template>

<script lang="ts">
  import {ApiCredentials} from '@/api/credentials/ApiCredentials';
  import Loading from '@/components/Loading.vue';
  import SwipeItem from '@/components/SwipeItem.vue';
  import {IEdition} from '@/db/tables/IEdition';
  import {SnackbarMessage} from '@/snackbars/SnackbarMessage';
  import {getParent} from '@/utils/element';
  import {getRequestErrorMessage} from '@/utils/error';
  import {MetaInfo} from 'vue-meta';
  import {Component, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {SwipeItem, Loading},
  })
  export default class Editions extends Vue {
    public get pending(): boolean {
      return this.$store.state.edition.serverPending;
    }

    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.editions.title') as string,
      };
    }

    public routeAdd(): void {
      this.$router.push({name: 'editions-add'});
    }

    public async refresh(edition: IEdition): Promise<void> {
      try {
        const credentials = new ApiCredentials(String(edition.id), edition.apiKey, false);
        await this.$store.dispatch('edition/ping', credentials);
      } catch (e) {
        this.$snackbar.snack(new SnackbarMessage(getRequestErrorMessage(this, e), 'error'));
      }
    }

    public deleteEdition(edition: IEdition, e: Event): void {
      const $parent = getParent<SwipeItem>(e.target as HTMLElement, SwipeItem);

      if ($parent) {
        $parent.toggleRightAction();
      }
    }

    public async confirmDeleteEdition(edition: IEdition): Promise<void> {
      await this.$store.dispatch('edition/delete', edition.id);
    }
  }
</script>
