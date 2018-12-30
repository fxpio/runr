<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-app v-if="$store.state.edition.initialized">
    <snackbar></snackbar>

    <v-navigation-drawer v-model="drawer" fixed clipped app width="250">
      <v-list>
        <template v-for="(item, i) in drawerItems">
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

    <router-view name="toolbar"></router-view>

    <v-content>
      <transition :name="transitionName" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>

    <router-view name="fab"></router-view>
  </v-app>
</template>

<script lang="ts">
  import Snackbar from '@/components/Snackbar.vue';
  import Vue from 'vue';
  import {MetaInfo} from 'vue-meta';
  import {Component} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {Snackbar},
  })
  export default class App extends Vue {
    public static readonly DEFAULT_TRANSITION: string = 'fade';

    public drawerItems: object[] = [
      {icon: 'home', text: 'views.home.title', route: {name: 'home'}},
      {heading: 'menu.label'},
      {icon: 'print', text: 'views.bib-label.title'},
      {divider: true},
      {heading: 'menu.configuration'},
      {icon: 'flag', text: 'views.editions.title', route: {name: 'editions'}},
    ];

    public transitionName: string = App.DEFAULT_TRANSITION;

    public metaInfo(): MetaInfo {
      return {
        title: this.$i18n.t('views.home.title', {}) as string,
        titleTemplate: (titleChunk) => titleChunk + ' · ' + this.$i18n.t('app.name'),
      };
    }

    public created(): void {
      this.$router.beforeEach((to, from, next) => {
        let transitionName = to.meta.transitionName || from.meta.transitionName;

        if (transitionName === 'slide') {
          const toDepth = to.path.split('/').length;
          const fromDepth = from.path.split('/').length;
          transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
        }

        this.transitionName = transitionName || App.DEFAULT_TRANSITION;

        next();
      });
    }

    public async mounted(): Promise<void> {
      await this.$store.dispatch('edition/init');
      const pl = document.getElementById('pl');

      if (pl) {
        pl.addEventListener('transitionend', () => {
          pl.remove();
        });
        pl.style.opacity = '0';
      }
    }

    public get drawer(): boolean {
      return this.$store.state.drawer.show;
    }

    public set drawer(value) {
      this.$store.commit('drawer/toggle', value as boolean);
    }
  }
</script>
