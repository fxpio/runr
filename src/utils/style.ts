/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

type CSSMatrix = DOMMatrix;
declare var CSSMatrix: typeof DOMMatrix;

type MSCSSMatrix = DOMMatrix;
declare var MSCSSMatrix: typeof DOMMatrix;

/**
 * Get the horizontal position of target element.
 */
export function getTargetPosition(el: HTMLElement): number {
    const transformCss = getComputedStyle(el).transform;
    let transform = {e: 0, f: 0};
    let reMatrix;
    let match;

    if (transformCss) {
        if ('function' === typeof CSSMatrix) {
            transform = new CSSMatrix(transformCss);
        } else if ('function' === typeof WebKitCSSMatrix) {
            transform = new WebKitCSSMatrix(transformCss);
        } else if ('function' === typeof MSCSSMatrix) {
            transform = new MSCSSMatrix(transformCss);
        } else {
            reMatrix = new RegExp('matrix\\(\\s*-?\\d+(?:\\.\\d+)?\\s*,\\s*-?\\d+(?:\\.\\d+)?\\s*,'
                + '\\s*-?\\d+(?:\\.\\d+)?\\s*,\\s*-?\\d+(?:\\.\\d+)?\\s*,\\s*(-?\\d+(?:\\.\\d+)?)\\s*,'
                + '\\s*(-?\\d+(?:\\.\\d+)?)\\s*\\)');
            match = transformCss.match(reMatrix);

            if (match) {
                transform.e = parseInt(match[1], 10);
                transform.f = parseInt(match[2], 10);
            }
        }
    }

    return transform.e;
}
