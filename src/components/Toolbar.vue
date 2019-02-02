<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-fade-transition>
    <v-toolbar dark :color="$store.state.darkMode.enabled ? null : 'primary'" app clipped-left>
      <v-scale-transition mode="out-in">
        <v-toolbar-side-icon v-if="!showPreviousButton" @click="drawerButtonAction" key="menu-btn"></v-toolbar-side-icon>

        <v-btn icon v-else @click="previousButtonAction" @long-click="drawerButtonAction" key="previous-btn">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-scale-transition>

      <v-menu>
        <v-toolbar-title slot="activator">
          <v-fade-transition mode="out-in">
            <div v-if="!$store.state.edition.serverPending">
              <span>{{ toolbarTitle }}</span>
              <v-icon dark>arrow_drop_down</v-icon>
            </div>
            <v-progress-circular indeterminate v-if="$store.state.edition.serverPending"></v-progress-circular>
          </v-fade-transition>
        </v-toolbar-title>

        <v-list>
          <v-list-tile
                  v-for="edition in $store.state.edition.all"
                  :key="edition.id"
                  @click="$store.dispatch('edition/select', edition.id)"
          >
            <v-list-tile-content>
              <v-list-tile-title v-text="edition.name"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-scale-transition>
                <v-icon v-if="$store.getters['edition/isSelected'](edition.id)" color="pink">star</v-icon>
              </v-scale-transition>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile key="add" :to="{name: 'editions-add', query: {redirect: $router.currentRoute.fullPath}}">{{ $t('add.edition') }}</v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
  </v-fade-transition>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class Toolbar extends Vue {
    public showPreviousButton: boolean = false;

    /* tslint:disable:ban-types */
    private unSyncRouterHook?: Function;

    public created(): void {
      const self = this;

      this.showPreviousButton = !this.$routerBack.isRoot();

      this.unSyncRouterHook = this.$router.afterEach(() => {
        self.showPreviousButton = !self.$routerBack.isRoot();
      });
    }

    public beforeDestroy(): void {
      if (this.unSyncRouterHook) {
        this.unSyncRouterHook();
        this.unSyncRouterHook = undefined;
      }
    }

    public get toolbarTitle(): string {
      const current = this.$store.state.edition.current;

      return current ? current.name : this.$i18n.t('app.name') as string;
    }

    public drawerButtonAction(): void {
      this.$store.commit('drawer/toggle');
    }

    public previousButtonAction(): void {
      this.$routerBack.back();
    }
  }
</script>
