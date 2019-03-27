<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <div class="qrcode-reader">
    <loading v-if="!showErrorMessage && !showCamera"></loading>

    <div class="qrcode-reader--wrapper" v-if="showErrorMessage">
      <slot name="error-message"></slot>
    </div>

    <div class="qrcode-reader--wrapper" v-show="showCamera">
      <video ref="video"
             class="qrcode-reader--camera"
             muted
             playsinline>
      </video>

      <canvas ref="tracker"
              class="qrcode-reader--tracker">
      </canvas>
    </div>
  </div>
</template>

<script lang="ts">
  import 'webrtc-adapter';
  import '@/styles/components/QrcodeReader.scss';
  import Loading from '@/components/Loading.vue';
  import AvailableCamera from '@/components/QrcodeReader/camera/AvailableCamera';
  import Camera from '@/components/QrcodeReader/camera/Camera';
  import CameraConfig from '@/components/QrcodeReader/misc/CameraConfig';
  import QrCodeLocation from '@/components/QrcodeReader/misc/QrCodeLocation';
  import Scanner from '@/components/QrcodeReader/misc/Scanner';
  import Tracker from '@/components/QrcodeReader/misc/Tracker';
  import WorkerScanMessage from '@/components/QrcodeReader/misc/WorkerScanMessage';
  import CameraUtil from '@/components/QrcodeReader/utils/CameraUtil';
  import {isMobile} from '@/utils/browser';
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {Loading},
  })
  export default class QrcodeReader extends Vue {
    @Prop({type: Boolean, default: true})
    public delayInit!: boolean;

    @Prop({type: Boolean, default: true})
    public track!: boolean;

    @Prop({type: String, default: 'red'})
    public trackColor!: string;

    @Prop({type: String, default: null})
    public cameraId!: string|null;

    @Prop(HTMLElement)
    public wrapperRef?: HTMLElement;

    public cameraInstance: Camera|null = null;

    private showErrorMessage: boolean = false;

    private availableCameras: AvailableCamera[]|null = null;

    private animationId?: number;

    private reseted: boolean = false;

    private stopScanning!: () => void;

    public get showCamera(): boolean {
      return !!this.cameraInstance && !this.showErrorMessage;
    }

    public get scanInterval(): number {
      return this.track ? 40 : 500;
    }

    public async mounted(): Promise<void> {
      this.resetStopScanning();

      if (!this.delayInit) {
        await this.init();
      }
    }

    public beforeDestroy(): void {
      this.reset();
    }

    @Watch('cameraId')
    public async watchCameraId(): Promise<void> {
      await this.init();
    }

    @Watch('showCamera')
    public watchShowCamera(showCamera: boolean): void {
      if (showCamera) {
        this.clearTracker();
        this.startScanning();
      } else {
        this.stopScanning();
      }
    }

    public async getAvailableCameras(): Promise<AvailableCamera[]> {
      if (null === this.availableCameras) {
        this.availableCameras = await CameraUtil.findAvailableCameras();
      }

      return this.availableCameras;
    }

    public async hasAvailableCamera(): Promise<boolean> {
      return (await this.getAvailableCameras()).length > 0;
    }

    public reset(): void {
      this.stopScanning();
      this.resetStopScanning();

      if (null !== this.cameraInstance) {
        this.cameraInstance.stop();
        this.cameraInstance = null;
      }

      if (undefined !== this.animationId) {
        cancelAnimationFrame(this.animationId);
      }

      this.showErrorMessage = false;
      this.reseted = true;
    }

    public async init(): Promise<void> {
      const videoEl = this.$refs.video as HTMLVideoElement;
      let stream: MediaStream|null = null;

      try {
        this.$emit('init');
        this.reset();
        this.reseted = false;

        const constraints = this.buildConstraints();
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        const config = await this.buildConfig(stream);

        videoEl.srcObject = stream;
        await videoEl.play();

        this.availableCameras = config.availables;
        this.cameraInstance = new Camera(videoEl, stream);

        if (!this.reseted) {
          this.$emit('initialized', config);
        } else {
          this.reset();
        }
      } catch (e) {
        if (null === this.cameraInstance && null !== stream) {
          this.cameraInstance = new Camera(videoEl, stream);
        }

        this.reset();
        this.showErrorMessage = true;
      }
    }

    private async buildConfig(stream: MediaStream): Promise<CameraConfig> {
      let selectedLabel: string = '';

      stream.getTracks().forEach((track: MediaStreamTrack) => {
        selectedLabel = track.label;
      });

      const initialSelectedLabel = selectedLabel;
      const availables = (await CameraUtil.findAvailableCameras());
      let selected: AvailableCamera|null = null;

      availables.forEach((aCam: AvailableCamera, index: number) => {
        const camLabel = aCam.label;

        if (aCam.label.includes('front')) {
          aCam.label = this.$t('scanner.camera.front') as string;
        } else if (aCam.label.includes('back')) {
          aCam.label = this.$t('scanner.camera.back') as string;
        } else if (!aCam.label) {
          if (this.cameraId && this.cameraId === aCam.id) {
            aCam.label = selectedLabel;
          } else {
            aCam.label = this.$t('scanner.camera.noname', {number: (index + 1)}) as string;
          }
        }

        if (camLabel === initialSelectedLabel) {
          selectedLabel = aCam.label;
        }

        if (this.cameraId && this.cameraId === aCam.id) {
          selected = aCam;
        }
      });

      if (1 === availables.length && !this.cameraId && selectedLabel) {
        availables[0].label = selectedLabel;
      }

      return {
        availables,
        selected: selected || new AvailableCamera(null, selectedLabel),
      };
    }

    private buildConstraints(): any {
      const constraints = {
        audio: false,
        video: {
          width: {
            min: 360,
            ideal: 640,
            max: 1920,
          },
          height: {
            min: 240,
            ideal: 480,
            max: 1080,
          },
        },
      } as any;

      if (isMobile()) {
        delete constraints.video.width.ideal;
        delete constraints.video.width.max;
        delete constraints.video.height.ideal;
        delete constraints.video.height.max;
      } else if (this.wrapperRef) {
        constraints.video.width.ideal = this.wrapperRef.offsetWidth;
        constraints.video.width.max = this.wrapperRef.offsetWidth;
        constraints.video.height.ideal = this.wrapperRef.offsetHeight;
        constraints.video.height.max = this.wrapperRef.offsetHeight;
      }

      if (this.cameraId) {
        constraints.video.deviceId = this.cameraId;
      } else {
        constraints.video.facingMode = {
          ideal: 'environment',
        };
      }

      return constraints;
    }

    private onDetect(result: WorkerScanMessage): void {
      this.$emit('detect', result);

      if (!!result.content) {
        this.$emit('decode', result.content);
      }
    }

    private onLocate(location: QrCodeLocation|null): void {
      if (this.track) {
        if (null === location) {
          this.clearTracker();
        } else {
          this.drawTracker(location);
        }
      }
    }

    private clearTracker(): void {
      const trackerEl = this.$refs.tracker as HTMLCanvasElement;
      const context = trackerEl.getContext('2d') as CanvasRenderingContext2D;

      this.animationId = window.requestAnimationFrame((): void => {
        context.clearRect(0, 0, trackerEl.width, trackerEl.height);
      });
    }

    private drawTracker(location: QrCodeLocation): void {
      const videoEl = this.$refs.video as HTMLVideoElement;
      const trackerEl = this.$refs.tracker as HTMLCanvasElement;
      const context = trackerEl.getContext('2d') as CanvasRenderingContext2D;

      const displayWidth = videoEl.offsetWidth;
      const displayHeight = videoEl.offsetHeight;
      const resolutionWidth = videoEl.videoWidth;
      const resolutionHeight = videoEl.videoHeight;

      this.animationId = window.requestAnimationFrame((): void => {
        const widthRatio = displayWidth / resolutionWidth;
        const heightRatio = displayHeight / resolutionHeight;

        trackerEl.width = displayWidth;
        trackerEl.height = displayHeight;
        location = Tracker.normalizeLocation(widthRatio, heightRatio, location);

        Tracker.thinSquare(location, context, this.trackColor);
      });
    }

    private startScanning(): void {
      if (null !== this.cameraInstance) {
        this.stopScanning = Scanner.scanning(this.cameraInstance, this.onDetect, this.onLocate, this.scanInterval);
      }
    }

    private resetStopScanning(): void {
      this.stopScanning = () => {
        // mock function
      };
    }
  }
</script>
