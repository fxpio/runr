/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/* tslint:disable:no-var-requires */
const Worker = require('worker-loader?inline=true&fallback=false!./Worker.ts');
import Camera from '@/components/QrcodeReader/camera/Camera';
import QrCodeLocation from '@/components/QrcodeReader/misc/QrCodeLocation';
import WorkerScanMessage from '@/components/QrcodeReader/misc/WorkerScanMessage';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Scanner {
    public static scanning(camera: Camera,
                           detectHandler: (result: WorkerScanMessage) => void,
                           locateHandler: (location: QrCodeLocation|null) => void,
                           delay: number): () => void {
        const worker = new Worker();

        let workerBusy = false;
        let contentBefore: string|null = null;
        let locationBefore: QrCodeLocation|null = null;
        let lastScanned: number = performance.now();
        let animationId: number;

        worker.onmessage = (event: MessageEvent): void => {
            workerBusy = false;

            const {content, location} = event.data as WorkerScanMessage;

            if (null !== content && '' !== content && content !== contentBefore) {
                detectHandler(event.data);
            }

            if (location !== locationBefore) {
                locateHandler(location);
            }

            contentBefore = content || contentBefore;
            locationBefore = location;
        };

        const processFrame = (timeNow: number = 0): void => {
            animationId = window.requestAnimationFrame(processFrame);

            if (timeNow - lastScanned >= delay) {
                lastScanned = timeNow;

                if (!workerBusy) {
                    workerBusy = true;
                    const imageData = camera.captureFrame();

                    if (imageData) {
                        worker.postMessage(imageData, [imageData.data.buffer]);
                    } else {
                        worker.postMessage(imageData);
                    }
                }
            }
        };

        processFrame();

        return () => {
            if (undefined !== animationId) {
                window.cancelAnimationFrame(animationId);
            }

            worker.terminate();
        };
    }
}
