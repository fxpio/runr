<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height v-if="$store.state.edition.all.length === 0">
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" align="center">
        <img :src="require('@/assets/img/logo.svg')" class="mb-5" style="width: 70%; max-width: 300px;">
        <h3>{{ $t('app.description') }}</h3>
        <v-btn color="accent" ripple class="mt-3" :to="{name: 'editions-add'}">{{ $t('views.editions.add-first') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>

  <v-container fill-height v-else>
    <v-row no-gutters justify="center">
      <v-col cols="12" md="5" class="pa-1">
        <quick-action color="blue"
                      icon="search"
                      :label="$t('views.participants.title')"
                      :to="{name: 'participants'}">
          <span>{{ $t('views.participants.description') }}</span>
        </quick-action>
      </v-col>
      <v-col cols="12" md="5" class="pa-1">
        <quick-action color="deep-orange"
                      icon="print"
                      :label="$t('views.bib-labels-print-one.title')"
                      :to="{name: 'bib-labels-print-one'}">
          <span>{{ $t('views.bib-labels-print-one.description') }}</span>
        </quick-action>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import QuickAction from '@/views/Home/components/QuickAction.vue';
  import {MetaInfo} from 'vue-meta';
  import {Component, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {QuickAction},
  })
export default class Home extends Vue {
    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.home.title') as string,
      };
    }
  }
</script>
