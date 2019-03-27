/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AvailableCamera from '@/components/QrcodeReader/camera/AvailableCamera';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class CameraUtil {
    public static async findAvailableCameras(): Promise<AvailableCamera[]> {
        const inputDevices = await navigator.mediaDevices.enumerateDevices();
        const availableInputs: AvailableCamera[] = [];

        for (const input of inputDevices) {
            if ('videoinput' === input.kind) {
                availableInputs.push(new AvailableCamera(input.deviceId, input.label));
            }
        }

        return availableInputs;
    }
}
