<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-dialog v-model="$store.state.scanner.opened"
            eager
            fullscreen
            dark
            content-class="scanner-dialog"
            transition="dialog-bottom-transition"
            ref="scannerDialog"
            hide-overlay>
    <v-card shaped class="scanner-card fill-height">
      <v-toolbar dark flat>
        <v-btn icon dark @click.prevent="$store.commit('scanner/close')">
          <v-icon>close</v-icon>
        </v-btn>

        <v-fade-transition>
          <v-menu v-if="availableCameras.length >= camerasShowSize" eager>
            <template v-slot:activator="{on}">
              <v-toolbar-title v-on="on">
                <v-fade-transition mode="out-in">
                  <div v-if="!!selectedCamera">
                    <span>{{ selectedCamera.label }}</span>
                    <v-icon dark>arrow_drop_down</v-icon>
                  </div>
                </v-fade-transition>
              </v-toolbar-title>
            </template>

            <v-list>
              <v-list-item
                      v-for="camera in availableCameras"
                      :key="camera.id"
                      @click="changeCamera(camera)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="camera.label"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-scale-transition origin="center center">
                    <v-icon v-if="selectedCamera && selectedCamera.id === camera.id" color="pink">star</v-icon>
                  </v-scale-transition>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-fade-transition>
      </v-toolbar>

      <v-container fluid fill-height class="pt-0 pb-0 pl-0 pr-0" ref="scanContainer">
        <v-row no-gutters class="flex-column" align="center" justify="center">
          <qrcode-reader ref="qrcodeReader"
                         :wrapperRef="$refs.scanContainer"
                         :cameraId="selectedCameraId"
                         :delayInit="!$store.state.scanner.opened"
                         @initialized="onInitialized"
                         @decode="onDecode">
            <v-container fluid fill-height slot="error-message">
              <v-row no-gutters class="flex-column" align="center" justify="center">
                <v-col class="text-align-center">
                  <v-icon size="14em">videocam_off</v-icon>
                  <h3>{{ $t('scanner.permission-camera-required') }}</h3>
                </v-col>
              </v-row>
            </v-container>
          </qrcode-reader>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import AvailableCamera from '@/components/QrcodeReader/camera/AvailableCamera';
  import CameraConfig from '@/components/QrcodeReader/misc/CameraConfig';
  import QrcodeReader from '@/components/QrcodeReader/QrcodeReader.vue';
  import {ScannerModuleState} from '@/stores/scanner/ScannerModuleState';
  import {Component, Emit, Prop, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {QrcodeReader},
  })
  export default class Scanner extends Vue {
    @Prop({type: Number, default: 2})
    public camerasShowSize!: number;

    @Prop({type: Number, default: 0.3})
    public resetResizeDelay!: number;

    public selectedCameraId: string|null = null;

    public selectedCamera: AvailableCamera|null = null;

    public availableCameras: AvailableCamera[] = [];

    private dialog!: HTMLElement;

    private resizeId?: number;

    private stateUnwatch?: () => void;

    public async beforeMount(): Promise<void> {
      this.stateUnwatch = this.$store.watch((state: ScannerModuleState) => state.scanner.opened,
              this.watchOpened);
    }

    public async mounted(): Promise<void> {
      this.dialog = (this.$refs.scannerDialog as Vue).$refs.dialog as HTMLElement;
      const $qrcodeReader = this.$refs.qrcodeReader as QrcodeReader;
      this.$store.commit('scanner/setEnabled', await $qrcodeReader.hasAvailableCamera());
    }

    public beforeDestroy(): void {
      if (this.resizeId) {
        window.clearTimeout(this.resizeId);
      }
    }

    public destroyed(): void {
      if (this.stateUnwatch) {
        this.stateUnwatch();
      }

      window.removeEventListener('resize', this.onWindowResize);
      this.dialog.removeEventListener('transitionend', this.startScanner);
      this.dialog.removeEventListener('transitionend', this.closeScanner);
    }

    public onInitialized(config: CameraConfig): void {
      this.availableCameras = config.availables;
      this.selectedCamera = config.selected;
      this.selectedCameraId = config.selected.id;
    }

    public async onDecode(value: string): Promise<void> {
      this.$root.$emit('scanner-decode', value);
      await (new Promise((res) => setTimeout(res, 300)));
      this.$store.commit('scanner/close');
    }

    private async watchOpened(opened: boolean): Promise<void> {
      if (opened) {
        this.dialog.addEventListener('transitionend', this.startScanner);
        window.addEventListener('resize', this.onWindowResize);
      } else {
        if (this.resizeId) {
          window.clearTimeout(this.resizeId);
        }

        window.removeEventListener('resize', this.onWindowResize);
        this.dialog.removeEventListener('transitionend', this.startScanner);
        this.dialog.addEventListener('transitionend', this.closeScanner);

        (this.$refs.qrcodeReader as QrcodeReader).reset();
        this.selectedCamera = null;
        this.availableCameras = [];
      }
    }

    private async startScanner(): Promise<void> {
      const isCamAlreadySelected = !!this.selectedCameraId;

      this.dialog.removeEventListener('transitionend', this.startScanner);
      this.selectedCameraId = this.$store.state.scanner.lastCameraId;

      if (null === this.selectedCameraId || isCamAlreadySelected) {
        await (this.$refs.qrcodeReader as QrcodeReader).init();
      }
    }

    private closeScanner(): void {
      this.dialog.removeEventListener('transitionend', this.closeScanner);
    }

    private async onWindowResize(): Promise<void> {
      (this.$refs.qrcodeReader as QrcodeReader).reset();

      if (this.resizeId) {
        window.clearTimeout(this.resizeId);
      }

      this.resizeId = window.setTimeout(async () => {
        window.clearTimeout(this.resizeId);
        this.resizeId = undefined;
        await (this.$refs.qrcodeReader as QrcodeReader).init();
      }, this.resetResizeDelay * 1000);
    }

    @Emit('change-camera')
    private changeCamera(camera: AvailableCamera|null) {
      this.selectedCamera = camera;
      this.selectedCameraId = camera ? camera.id : null;

      this.$store.commit('scanner/setLastCameraId', this.selectedCameraId);
    }
  }
</script>
