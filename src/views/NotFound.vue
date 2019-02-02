<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height>
    <v-layout column align-center justify-center>
      <v-icon size="14em" color="red">error</v-icon>
      <h2 :class="$store.state.darkMode.enabled ? null : 'grey--text'">{{ $t('error.404-page-not-found') }}</h2>
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
  export default class NotFound extends Vue {
    public metaInfo(): MetaInfo {
      return {
        title: this.$i18n.t('error.404-page-not-found') as string,
      };
    }
  }
</script>
