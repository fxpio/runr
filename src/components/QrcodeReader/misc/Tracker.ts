/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import QrCodeLocation from '@/components/QrcodeReader/misc/QrCodeLocation';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class Tracker {
    public static thinSquare(location: QrCodeLocation, canvasContext: CanvasRenderingContext2D, color: string): void {
        canvasContext.strokeStyle = color;

        canvasContext.beginPath();
        canvasContext.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
        canvasContext.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
        canvasContext.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
        canvasContext.lineTo(location.topRightCorner.x, location.topRightCorner.y);
        canvasContext.lineTo(location.topLeftCorner.x, location.topLeftCorner.y);
        canvasContext.closePath();

        canvasContext.stroke();
    }

    public static normalizeLocation(widthRatio: number, heightRatio: number, location: QrCodeLocation): QrCodeLocation {
        const normLocation = {} as any;

        for (const key of Object.keys(location)) {
            normLocation[key] = {
                x: Math.floor((location as any)[key].x * widthRatio),
                y: Math.floor((location as any)[key].y * heightRatio),
            };
        }

        return normLocation as QrCodeLocation;
    }
}
