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
export class Printer {
    private readonly parent: HTMLElement;

    private wrapper?: HTMLDivElement;

    constructor(parent: HTMLElement = window.document.body) {
        this.parent = parent;
    }

    public print(nodes: Element[]): void {
        const wrapper = this.createWrapper();
        let pageStyled = false;

        for (const node of nodes) {
            if (!pageStyled) {
                const compStyle = window.getComputedStyle(node as Element);
                pageStyled = true;

                const cssText = `@media print {
                    @page {
                        size: ${compStyle.width} ${compStyle.height};
                    }

                    #printer-wrapper {
                        position: absolute !important;
                        top: 0 !important;
                        bottom: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        visibility: visible !important;
                        width: auto !important;
                        height: auto !important;
                        z-index: auto !important;
                    }

                    body > div:not(#printer-wrapper) {
                        display: none;
                    }
                }`;
                const style: HTMLStyleElement = window.document.createElement('style');
                style.id = 'printer-page-size-style';
                (style as any).type = 'text/css';
                style.appendChild(window.document.createTextNode(cssText));

                window.document.head.appendChild(style);
            }

            const cNode = node.cloneNode(true) as Element;
            cNode.removeAttribute('id');

            for (const cChildNode of [...cNode.querySelectorAll('*')]) {
                cChildNode.removeAttribute('id');
            }

            wrapper.appendChild(cNode);
        }

        const result: boolean = window.document.execCommand('print', false);

        if (!result) {
            window.print();
        }
    }

    public reset(): void {
        const pageStyle = window.document.getElementById('printer-page-size-style');

        if (pageStyle) {
            pageStyle.remove();
        }

        if (this.wrapper) {
            this.wrapper.remove();
            this.wrapper = undefined;
        }
    }

    public destroy(): void {
        this.reset();
    }

    private createWrapper(): HTMLDivElement {
        this.reset();

        const el: HTMLDivElement = window.document.createElement('div');

        el.setAttribute('style', 'visibility:hidden;width:0;height:0;position:fixed;z-index:-9999;bottom:0;');
        el.setAttribute('id', 'printer-wrapper');
        el.setAttribute('width', '0');
        el.setAttribute('height', '0');

        this.parent.appendChild(el);

        return this.wrapper = el;
    }
}
