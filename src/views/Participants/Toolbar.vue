<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-fade-transition>
    <v-toolbar app clipped-left flat>
      <v-scale-transition mode="out-in">
        <v-btn icon v-if="showRouterBackButton"
               @click.prevent="$routerBack.back()"
               @long-click="$store.commit('drawer/toggle')"
               key="router-back-btn">
          <v-icon>arrow_back</v-icon>
        </v-btn>

        <v-btn icon v-else
               @click.prevent="$root.$emit('participants-back-button-action')"
               @long-click="$store.commit('drawer/toggle')"
               key="component-back-btn">
          <v-icon>chevron_left</v-icon>
        </v-btn>
      </v-scale-transition>

      <edition-selector color="primary"></edition-selector>
    </v-toolbar>
  </v-fade-transition>
</template>

<script lang="ts">
  import EditionSelector from '@/components/EditionSelector.vue';
  import {Component, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {EditionSelector},
  })
  export default class Toolbar extends Vue {
    private showRouterBackButton: boolean = true;

    public beforeMount(): void {
      this.$root.$on('participants-change-back-button', this.onChangeBackButton);
    }

    public destroyed(): void {
      this.$root.$off('participants-change-back-button', this.onChangeBackButton);
    }

    public onChangeBackButton(value: boolean): void {
      this.showRouterBackButton = value;
    }
  }
</script>
