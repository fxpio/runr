/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {PrinterModuleState} from '@/stores/printer/PrinterModuleState';
import {Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Printer<S extends PrinterModuleState> {
    private readonly store: Store<S>;

    private readonly selector: string;

    private readonly pageId: string;

    constructor(store: Store<S>, selector: string, pageId: string = 'bib-scan-print-page') {
        this.store = store;
        this.selector = selector;
        this.pageId = pageId;
    }

    public print(): void {
        let stylesHtml = '';
        let prtHtml = '';
        let width;
        let height;

        for (const node of [...document.querySelectorAll(this.selector)]) {
            prtHtml += node.outerHTML;

            if (!width) {
                const compStyle = window.getComputedStyle(node as Element);
                width = compStyle.width;
                height = compStyle.height;
            }
        }

        for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
            stylesHtml += node.outerHTML;
        }

        const winPrint = window.open('', this.pageId);
        const store = this.store;

        if (null !== winPrint) {
            winPrint.document.write(`<!DOCTYPE html>
                <html>
                  <head>
                    ${stylesHtml}
                    <style>
                      @media print {@page {size: ${width} ${height};}}
                    </style>
                  </head>
                  <body>
                    ${prtHtml}
                  </body>
                </html>`);
            winPrint.document.close();
            winPrint.onload = () => {
                winPrint.focus();
                winPrint.print();

                if (store.state.printer.closeAfterPrint) {
                    winPrint.close();
                }
            };
        }
    }
}
