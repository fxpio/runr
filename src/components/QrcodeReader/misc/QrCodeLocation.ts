/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import QrCodePoint from '@/components/QrcodeReader/misc/QrCodePoint';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default interface QrCodeLocation {
    bottomLeftCorner: QrCodePoint;
    bottomLeftFinderPattern: QrCodePoint;
    bottomRightAlignmentPattern: QrCodePoint;
    bottomRightCorner: QrCodePoint;
    topLeftCorner: QrCodePoint;
    topLeftFinderPattern: QrCodePoint;
    topRightCorner: QrCodePoint;
    topRightFinderPattern: QrCodePoint;
}
