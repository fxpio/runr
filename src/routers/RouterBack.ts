/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VueRouter, {Route} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class RouterBack {
    private readonly router: VueRouter;

    private readonly isStandalone: boolean;

    private rootPath: string|null = null;

    constructor(router: VueRouter) {
        this.router = router;
        this.isStandalone = ('matchMedia' in window && window.matchMedia('(display-mode: standalone)').matches);
    }

    public isRoot(): boolean {
        if (!this.rootPath) {
            const route = this.getRoute('/');
            this.rootPath = route ? route.fullPath : '/';
        }

        return this.rootPath === this.router.currentRoute.fullPath;
    }

    public back(): void {
        if (this.isStandalone) {
            this.router.back();

            return;
        }

        let parentPath = this.router.currentRoute.fullPath.replace(/\/$/, '');

        while (true) {
            const match = parentPath.match(/.*\//);

            if (match) {
                parentPath = '/' === match[0] ? '/' : match[0].replace(/\/$/, '');
                const findParentRoute = this.getRoute(parentPath);

                if (findParentRoute) {
                    parentPath = findParentRoute.fullPath;
                    break;
                }
            } else {
                break;
            }
        }

        this.router.replace(parentPath);
    }

    private getRoute(path: string): Route|null {
        const resolved = this.router.resolve(path);

        return resolved.route.matched.length > 0 && '*' !== resolved.route.matched[0].path ? resolved.route : null;
    }
}
