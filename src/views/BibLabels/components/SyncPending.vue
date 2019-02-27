<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-flex sm10 md8 lg6 xl4>
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
  </v-flex>
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
