/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
const canvas = document.createElement('canvas');
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 1920;
canvas.height = 1080;

export default class ImageDataUtil {
    public static fromCanvas(canvasImageSource: CanvasImageSource, width: number, height: number): ImageData|null {
        const ratio = Math.min(1, canvas.width / width, canvas.height / height);
        const widthScaled = ratio * width;
        const heightScaled = ratio * height;

        canvasContext.drawImage(canvasImageSource, 0, 0, widthScaled, heightScaled);

        return widthScaled > 0 && heightScaled > 0
            ? canvasContext.getImageData(0, 0, widthScaled, heightScaled)
            : null;
    }

    public static fromVideo(videoElement: HTMLVideoElement): ImageData|null {
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;

        return ImageDataUtil.fromCanvas(videoElement, width, height);
    }
}
