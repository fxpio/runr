<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-layout column align-center justify-center
            key="result-empty-page">
    <v-icon size="14em" color="info" class="mt-1">search</v-icon>

    <h2 :class="$store.state.darkMode.enabled ? null : 'grey--text'">
      {{ $t('views.participants.search-not-found') }}
    </h2>

    <v-btn class="mt-3" ripple color="accent" @click="$root.$emit('participants-back-button-action')">
      {{ $t('views.participants.retry-search') }}
    </v-btn>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class ResultEmptyPage extends Vue {
  }
</script>
