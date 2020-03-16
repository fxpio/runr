<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-app v-if="$store.state.edition.initialized">
    <scanner></scanner>
    <snackbar></snackbar>

    <app-drawer :items="drawerItems"></app-drawer>

    <router-view name="toolbar"></router-view>

    <v-content>
      <transition :name="transitionName" mode="out-in">
        <router-view :key="$route.fullPath"></router-view>
      </transition>
    </v-content>

    <router-view name="fab"></router-view>
  </v-app>
</template>

<script lang="ts">
  import AppDrawer from '@/components/AppDrawer.vue';
  import Scanner from '@/components/Scanner.vue';
  import Snackbar from '@/components/Snackbar.vue';
  import Vue from 'vue';
  import {MetaInfo} from 'vue-meta';
  import {Component, Watch} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {Scanner, AppDrawer, Snackbar},
  })
  export default class App extends Vue {
    public static readonly DEFAULT_TRANSITION: string = 'fade';

    public transitionName: string = App.DEFAULT_TRANSITION;

    public drawerItems: object[] = [
      {icon: 'home', color: 'blue', text: 'views.home.title', route: {name: 'home'}},
      {heading: 'menu.participants'},
      {icon: 'search', color: 'cyan', text: 'search', route: {name: 'participants'}},
      {heading: 'menu.bibs'},
      {icon: 'print', color: 'deep-orange', text: 'views.bib-labels-print-one.title',
        route: {name: 'bib-labels-print-one'}},
      {icon: 'print', color: 'deep-orange', text: 'views.bib-labels-print-mass.title',
        route: {name: 'bib-labels-print-mass'}},
      {divider: true},
      {heading: 'menu.configuration'},
      {icon: 'flag', color: 'blue-grey', text: 'views.editions.title', route: {name: 'editions'}},
      {icon: 'settings', color: 'grey', text: 'views.settings.title', route: {name: 'settings'}},
      {divider: true},
      {icon: 'info', color: 'grey', text: 'views.about.title', route: {name: 'about'}},
    ];

    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.home.title', {}) as string,
        titleTemplate: (titleChunk) => titleChunk + ' · ' + this.$t('app.name'),
      };
    }

    public get darkModeEnabled(): boolean {
      return this.$store.state.darkMode.enabled;
    }

    @Watch('darkModeEnabled')
    public watchDarkMode(enabled: boolean): void {
      this.$vuetify.theme.dark = enabled;
    }

    public created(): void {
      this.watchDarkMode(this.darkModeEnabled);
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
  }
</script>
