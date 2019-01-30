<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <div>
    <v-dialog v-model="value"
              lazy
              fullscreen
              dark
              transition="dialog-bottom-transition"
              hide-overlay>
      <v-card flat class="qrcode-wrapper">
        <v-toolbar dark>
          <v-btn icon dark @click="$emit('input', false)">
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
                      v-for="camera in (availableCameras || [])"
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

        <v-container fill-height fluid>
          <v-fade-transition mode="out-in">
            <qrcode-stream v-if="value && null !== availableCameras && availableCameras.length > 0 && !!selectedCamera"
                           :camera="selectedCamera ? {deviceId: selectedCamera.id} : undefined"
                           @decode="$emit('decode', $event)">
            </qrcode-stream>

            <v-layout column align-center justify-center v-else-if="value && null !== availableCameras">
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
  import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class Scanner extends Vue {
    @Prop(Boolean)
    public value!: boolean;

    public selectedCamera: Camera|null = null;

    public availableCameras: Camera[]|null = null;

    @Watch('value')
    public async checkCameraLabels(value?: any): Promise<void> {
      if (!value) {
        return;
      }

      this.availableCameras = null;

      try {
        const availableCameras = [];
        const lastCameraId = this.$store.state.scanner.lastCameraId;
        await navigator.mediaDevices.getUserMedia({video: true, audio: false});
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

        this.availableCameras = availableCameras;
        this.changeCamera(selectedCamera);
      } catch (e) {
        this.availableCameras = [];
        this.changeCamera(null);
      }
    }

    public async beforeMount(): Promise<void> {
      const inputDevices = await navigator.mediaDevices.enumerateDevices();
      const availables: Camera[] = [];

      for (const input of inputDevices) {
        if ('videoinput' === input.kind) {
          availables.push(new Camera(input.deviceId, input.label));
        }
      }

      this.$emit('availableCameras', availables);
    }

    @Emit('change-camera')
    private changeCamera(camera: Camera|null) {
      this.selectedCamera = camera;

      if (camera) {
        this.$store.commit('scanner/setLastCameraId', camera.id);
      }
    }
  }
</script>
