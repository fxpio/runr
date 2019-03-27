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
export class MaxDragAction {
  public readonly left: number;

  public readonly right: number;

  constructor(left: number, right: number) {
      this.left = left;
      this.right = right;
  }
}
