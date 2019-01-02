<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-snackbar v-model="show" bottom right auto-height :color="color">
    {{ message }}
    <v-btn color="light" flat v-if="showCloseButton" @click.native="show = false">{{ $t('close') }}</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
  import {SnackbarEventMessage} from '@/snackbars/SnackbarEventMessage';
  import {SnackbarModuleState} from '@/stores/snackbar/SnackbarModuleState';
  import {SnackConfig} from '@/stores/snackbar/SnackConfig';
  import {Component, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class Snackbar extends Vue {
    public show: boolean = false;

    public color: string|null = null;

    public message: string = '';

    public showCloseButton: boolean = true;

    public created(): void {
      this.$store.watch((state: SnackbarModuleState) => state.snackbar.config, (config: SnackConfig|null) => {
        if (config) {
          this.show = true;
          this.message = config.message;
          this.color = config.color ? config.color : null;
          this.showCloseButton = true === config.closeButton || undefined === config.closeButton;
          this.$store.commit('snackbar/snack');
        }
      });
    }

    public mounted(): void {
      window.addEventListener('message', (e: MessageEvent) => {
        const isMessage = (data: any): data is SnackbarEventMessage => {
          return (data as SnackbarEventMessage).type === 'snackbar-event-message';
        };

        if (isMessage(e.data)) {
          const mess = e.data as SnackbarEventMessage;

          this.$store.commit('snackbar/snack', {
            message: mess.translatable ? this.$i18n.t(mess.message) : mess.message,
            color: mess.color,
            closeButton: mess.closeButton,
          } as SnackConfig);
        }
      });
    }
  }
</script>
