<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-navigation-drawer v-model="drawer" fixed clipped app width="250">
    <v-list>
      <template v-for="(item, i) in items">
        <v-layout
                v-if="item.heading"
                :key="i"
                row
                align-center
        >
          <v-flex xs6>
            <v-subheader v-if="item.heading">
              {{ $t(item.heading) }}
            </v-subheader>
          </v-flex>
        </v-layout>
        <v-divider
                v-else-if="item.divider"
                :key="i"
                dark
                class="my-3"
        ></v-divider>
        <v-list-tile
                v-else
                :key="i"
                :to="item.route"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ $t(item.text) }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class AppDrawer extends Vue {
    @Prop(Array)
    public items!: object[];

    public get drawer(): boolean {
      return this.$store.state.drawer.show;
    }

    public set drawer(value) {
      this.$store.commit('drawer/toggle', value as boolean);
    }
  }
</script>
