<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-menu eager>
    <template v-slot:activator="{on}">
      <v-toolbar-title v-on="on">
        <v-fade-transition mode="out-in">
          <div class="menu-activator" v-if="!$store.state.edition.serverPending">
            <img v-if="!$store.state.edition.current" :src="require('@/assets/img/logo.svg')"
                 height="24" style="vertical-align: middle;">
            <span v-else :class="titleClasses">{{ title }}</span>
            <v-icon :color="$store.state.darkMode.enabled ? null : color">arrow_drop_down</v-icon>
          </div>
          <v-progress-circular indeterminate
                               :color="$store.state.darkMode.enabled ? null : color"
                               v-if="$store.state.edition.serverPending">
          </v-progress-circular>
        </v-fade-transition>
      </v-toolbar-title>
    </template>

    <v-list>
      <v-list-item
              v-for="edition in $store.state.edition.all"
              :key="edition.id"
              @click="$store.dispatch('edition/select', edition.id)"
      >
        <v-list-item-content>
          <v-list-item-title v-text="edition.name"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-scale-transition origin="center center">
            <v-icon v-if="$store.getters['edition/isSelected'](edition.id)" color="pink">star</v-icon>
          </v-scale-transition>
        </v-list-item-action>
      </v-list-item>

      <v-list-item key="add" :to="{name: 'editions-add', query: {redirect: $router.currentRoute.fullPath}}">{{ $t('add.edition') }}</v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class EditionSelector extends Vue {
    @Prop({type: [String], default: null})
    public color!: string|null;

    public get title(): string {
      const current = this.$store.state.edition.current;

      return current ? current.name : this.$t('app.name') as string;
    }

    public get titleClasses(): object {
      const classes = {} as any;

      if (this.color && !this.$store.state.darkMode.enabled) {
        classes[this.color + '--text'] = true;
      }

      return classes;
    }
  }
</script>
