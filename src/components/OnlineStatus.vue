<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-fade-transition>
    <v-tooltip left v-if="!online" eager>
      <template v-slot:activator="{on}">
        <v-icon v-on="on" color="warning">cloud_off</v-icon>
      </template>
      <span>{{ $t('offline') }}</span>
    </v-tooltip>
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
  export default class OnlineStatus extends Vue {
    public online?: boolean = false;

    public beforeMount(): void {
      this.online = window.navigator.onLine;
      window.addEventListener('online', this.onOnline);
      window.addEventListener('offline', this.onOffline);
    }

    public destroyed(): void {
      window.removeEventListener('online', this.onOnline);
      window.removeEventListener('offline', this.onOffline);
    }

    public onOnline(): void {
      this.online = true;
    }

    public onOffline(): void {
      this.online = false;
    }
  }
</script>
