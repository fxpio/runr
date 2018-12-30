<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fluid fill-height>
    <v-layout column align-center justify-center>
      <v-icon size="14em" color="accent">directions_run</v-icon>
      <h1 class="pb-4 accent--text">{{ $t('app.name') }}</h1>
      <h3>{{ $t('app.description') }}</h3>
      <v-btn color="accent" ripple class="mt-3" v-if="$store.state.edition.all.length === 0" :to="{name: 'edition-add'}">{{ $t('views.editions.add-first') }}</v-btn>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {MetaInfo} from 'vue-meta';
  import {Component, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
export default class Home extends Vue {
    public metaInfo(): MetaInfo {
      return {
        title: this.$i18n.t('views.home.title') as string,
      };
    }
  }
</script>
