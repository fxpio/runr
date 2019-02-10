/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import WorkerScanMessage from '@/components/QrcodeReader/misc/WorkerScanMessage';
import jsQR from 'jsqr';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
const ctx: Worker = self as any;

ctx.onmessage = (event: MessageEvent): void => {
    const imageData = event.data as ImageData|null;
    let content = null;
    let location = null;
    let imageBuffer;

    try {
        if (imageData) {
            const result = jsQR(imageData.data, imageData.width, imageData.height);
            imageBuffer = [imageData.data.buffer];

            if (null !== result) {
                content = result.data;
                location = result.location;
            }
        }
    } catch (e) {
        // silently
    }

    const message = {
        content,
        location,
        imageData,
    } as WorkerScanMessage;

    ctx.postMessage(message, imageBuffer);
};
