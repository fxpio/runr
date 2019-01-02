<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-app v-if="$store.state.edition.initialized">
    <snackbar></snackbar>

    <app-drawer :items="drawerItems"></app-drawer>

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
  import AppDrawer from '@/components/AppDrawer.vue';
  import Snackbar from '@/components/Snackbar.vue';
  import Vue from 'vue';
  import {MetaInfo} from 'vue-meta';
  import {Component} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {AppDrawer, Snackbar},
  })
  export default class App extends Vue {
    public static readonly DEFAULT_TRANSITION: string = 'fade';

    public transitionName: string = App.DEFAULT_TRANSITION;

    public drawerItems: object[] = [
      {icon: 'home', text: 'views.home.title', route: {name: 'home'}},
      {heading: 'menu.label'},
      {icon: 'print', text: 'views.bib-label.title'},
      {divider: true},
      {heading: 'menu.configuration'},
      {icon: 'flag', text: 'views.editions.title', route: {name: 'editions'}},
    ];

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
  }
</script>
