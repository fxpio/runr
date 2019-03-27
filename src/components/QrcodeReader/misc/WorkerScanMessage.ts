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
export default interface WorkerScanMessage {
    content: string|null;
    location: QrCodeLocation|null;
    imageData: ImageData;
}
