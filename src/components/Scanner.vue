<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <div>
    <v-dialog v-model="$store.state.scanner.opened"
              lazy
              fullscreen
              dark
              transition="dialog-bottom-transition"
              hide-overlay>
      <v-card flat class="scanner-card">
        <v-toolbar dark flat>
          <v-btn icon dark @click.prevent="$store.commit('scanner/close')">
            <v-icon>close</v-icon>
          </v-btn>

          <v-menu>
            <v-toolbar-title slot="activator">
              <v-fade-transition mode="out-in">
                <div v-if="!!selectedCamera">
                  <span>{{ selectedCamera.label }}</span>
                  <v-icon dark>arrow_drop_down</v-icon>
                </div>
              </v-fade-transition>
            </v-toolbar-title>

            <v-list>
              <v-list-tile
                      v-for="camera in ($store.state.scanner.availableCameras || [])"
                      :key="camera.id"
                      @click="changeCamera(camera)"
              >
                <v-list-tile-content>
                  <v-list-tile-title v-text="camera.label"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-scale-transition>
                    <v-icon v-if="selectedCamera && selectedCamera.id === camera.id" color="pink">star</v-icon>
                  </v-scale-transition>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>

        <v-container fluid fill-height :class="showCamera ? 'pt-0 pb-0 pl-0 pr-0' : ''" ref="scanContainer">
          <v-fade-transition mode="out-in">
            <v-layout column align-center justify-center
                      v-if="showCamera">
              <qrcode-stream :camera="camera" ref="qrCodeStream"
                             @decode="onDecode">
              </qrcode-stream>
            </v-layout>

            <v-layout column align-center justify-center v-else-if="showCameraErrorMessage">
              <v-icon size="14em">videocam_off</v-icon>
              <h3>{{ $t('scanner.permission-camera-required') }}</h3>
            </v-layout>
          </v-fade-transition>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
  import Camera from '@/devices/Camera';
  import {ScannerModuleState} from '@/stores/scanner/ScannerModuleState';
  import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class Scanner extends Vue {
    public selectedCamera: Camera|false|null = null;

    private cacheCameraMaxSize: object|null = null;

    private stateUnwatch?: () => void;

    public async beforeMount(): Promise<void> {
      this.stateUnwatch = this.$store.watch((state: ScannerModuleState) => state.scanner.opened,
              this.checkCameraLabels);

      const inputDevices = await navigator.mediaDevices.enumerateDevices();
      const availables: Camera[] = [];

      for (const input of inputDevices) {
        if ('videoinput' === input.kind) {
          availables.push(new Camera(input.deviceId, input.label));
        }
      }

      this.$store.commit('scanner/setAvailableCameras', availables);
      this.$store.commit('scanner/setEnabled', availables.length > 0);
    }

    public async mounted(): Promise<void> {
      window.addEventListener('resize', this.onWindowResize);
    }

    public async destroyed(): Promise<void> {
      if (this.stateUnwatch) {
        this.stateUnwatch();
      }

      window.removeEventListener('resize', this.onWindowResize);
      this.$store.commit('scanner/setEnabled', false);
    }

    public get cameraMaxSize(): object {
      if (null === this.cacheCameraMaxSize) {
        this.cacheCameraMaxSize = this.getContainerSize();
      }

      return this.cacheCameraMaxSize;
    }

    public get showCamera(): boolean {
      return this.$store.state.scanner.enabled && this.$store.state.scanner.opened
              && !!this.selectedCamera;
    }

    public get showCameraErrorMessage(): boolean {
      return this.$store.state.scanner.enabled && this.$store.state.scanner.opened
              && false === this.selectedCamera;
    }

    public get camera(): object|undefined {
      if (this.selectedCamera) {
        const size = this.cameraMaxSize as any;

        return {
          deviceId: this.selectedCamera.id,
          facingMode: undefined,
          width: {ideal: size.width, max: size.width},
          height: {ideal: size.height, max: size.height},
        };
      }
    }

    public async checkCameraLabels(opened?: boolean): Promise<void> {
      if (!opened) {
        return;
      }

      this.selectedCamera = null;
      this.cacheCameraMaxSize = null;
      this.$store.commit('scanner/setAvailableCameras', null);

      try {
        const availableCameras = [];
        const lastCameraId = this.$store.state.scanner.lastCameraId;
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        stream.getTracks().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
        const inputDevices = await navigator.mediaDevices.enumerateDevices();
        let selectedCamera: Camera|null = null;

        for (const input of inputDevices) {
          if ('videoinput' === input.kind) {
            let backCamera = false;
            let label = input.label.replace(/[()]/g, '');

            if (label.includes('front')) {
              label = this.$t('scanner.camera.front') as string;
            } else if (label.includes('back')) {
              label = this.$t('scanner.camera.back') as string;
              backCamera = true;
            }

            const camera = new Camera(input.deviceId, label);
            availableCameras.push(camera);

            if (lastCameraId && lastCameraId === camera.id) {
              selectedCamera = camera;
            } else if (!selectedCamera && backCamera) {
              selectedCamera = camera;
            }
          }
        }

        if (!selectedCamera && availableCameras.length > 0) {
          selectedCamera = availableCameras[0];
        }

        this.$store.commit('scanner/setAvailableCameras', availableCameras);
        this.changeCamera(selectedCamera);
      } catch (e) {
        this.$store.commit('scanner/setAvailableCameras', []);
        this.changeCamera(false);
      }
    }

    private onWindowResize(): void {
      this.cacheCameraMaxSize = this.getContainerSize();
    }

    private onDecode(value: string): void {
      this.$store.commit('scanner/close');
      this.$root.$emit('scanner-decode', value);
    }

    private getContainerSize(): object {
      const scanContainer = this.$refs.scanContainer as HTMLElement;
      const qrCodeStream = this.$refs.qrCodeStream as Vue;
      const size = {
        width: 1,
        height: 1,
      };

      if (qrCodeStream) {
        (qrCodeStream.$el as HTMLElement).style.display = 'none';
      }

      if (scanContainer && scanContainer.clientWidth > 0) {
        size.width = scanContainer.clientWidth;
      }

      if (scanContainer && scanContainer.clientHeight > 0) {
        size.height = scanContainer.clientHeight;
      }

      if (qrCodeStream) {
        (qrCodeStream.$el as HTMLElement).style.display = '';
      }

      return size;
    }

    @Emit('change-camera')
    private changeCamera(camera: Camera|false|null) {
      this.selectedCamera = camera;

      if (camera) {
        this.$store.commit('scanner/setLastCameraId', camera.id);
      }
    }
  }
</script>
