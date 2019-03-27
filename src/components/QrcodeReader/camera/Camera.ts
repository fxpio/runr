/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ImageDataUtil from '@/components/QrcodeReader/utils/ImageDataUtil';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Camera {
    private readonly el: HTMLVideoElement;

    private readonly stream: MediaStream;

    constructor(el: HTMLVideoElement, stream: MediaStream) {
        this.el = el;
        this.stream = stream;
    }

    public stop(): void {
        this.stream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    public captureFrame(): ImageData|null {
        return ImageDataUtil.fromVideo(this.el);
    }
}
