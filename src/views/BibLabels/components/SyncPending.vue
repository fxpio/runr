<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-subheader class="primary--text">
          {{ $store.state.registration.job.edition.name }}
        </v-subheader>

        <v-card flat>
          <v-card-title primary-title>
            <div class="headline">
              Synchronisation des inscriptions
            </div>
          </v-card-title>
          <v-card-text>
            <v-progress-linear
                    v-model="$store.state.registration.job.progression"
                    :indeterminate="null === $store.state.registration.job.size"
                    :query="true"
                    color="accent"
                    height="15">
            </v-progress-linear>
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn depressed
                   ripple
                   color="error"
                   @click.prevent="$store.dispatch('registration/stop')">
              {{ $t('stop') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class SyncPending extends Vue {
  }
</script>
