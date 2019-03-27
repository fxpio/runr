<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div :disabled="disabled" :class="classes">
        <div class="swipe-item-actions left">
            <slot name="action-left"></slot>
        </div>
        <div class="swipe-item-actions right">
            <slot name="action-right"></slot>
        </div>
        <div :class="contentClasses">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
  import {Elevatable} from '@/mixins/Elevatable';
  import {Themeable} from '@/mixins/Themeable';
  import {MaxDragAction} from '@/touch/MaxDragAction';
  import {getTargetPosition} from '@/utils/style';
  import {mixins} from 'vue-class-component';
  import {Component, Prop} from 'vue-property-decorator';
  import '@/styles/components/SwipeItem.scss';
  import Hammer from 'hammerjs';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class SwipeItem extends mixins(Themeable, Elevatable) {
      @Prop({type: [Number, String], default: 12})
      public elevation?: number;

      @Prop({type: Boolean, default: false})
      public disabled!: boolean;

      [key: string]: any;

      public opened: boolean = false;

      public openedLeft: boolean = false;

      public openedRight: boolean = false;

      public drag: boolean = false;

      public dragLeft: boolean = false;

      public dragRight: boolean = false;

      public get classes(): Record<string, boolean> {
          return {
              'swipe-item': true,
              'swipe-item--disabled': this.disabled,
              'action-opened': this.opened,
              'left-action-opened': this.openedLeft,
              'right-action-opened': this.openedRight,
              'drag': this.drag,
              'drag-left': this.dragLeft,
              'drag-right': this.dragRight,
              ...this.themeClasses,
          };
      }

      public get contentClasses(): Record<string, boolean> {
          return {
              'swipe-item-content': true,
              ...this.elevationClasses,
          };
      }

      private hammer?: HammerManager;

      private contentEl?: HTMLElement;

      private leftActionsEl?: HTMLElement;

      private rightActionsEl?: HTMLElement;

      private maxDrag?: MaxDragAction;

      private dragStartPosition?: number;

      public mounted(): void {
          this.contentEl = this.$el.querySelector('.swipe-item-content') as HTMLElement;
          this.leftActionsEl = this.$el.querySelector('.swipe-item-actions.left') as HTMLElement;
          this.rightActionsEl = this.$el.querySelector('.swipe-item-actions.right') as HTMLElement;
          this.hammer = new Hammer(this.$el as HTMLElement, {});
          this.hammer.get('swipe').set({enable: false});
          this.hammer.get('tap').set({enable: false});

          this.hammer.on('panstart', this.onDrag);
          this.hammer.on('pan', this.onDrag);
          this.hammer.on('panend', this.onDragEnd);
      }

      public closeTransitionEndHandler(): void {
          if (!this.opened) {
              this.openedLeft = false;
              this.openedRight = false;
          }

          if (!this.drag) {
              this.dragLeft = false;
              this.dragRight = false;
          }

          (this.contentEl as HTMLElement).removeEventListener('transitionend', this.closeTransitionEndHandler);
          this.$emit('actions-closed');
      }

      public openTransitionEndHandler(): void {
          if (this.openedLeft) {
              this.$emit('actions-left-opened');
          }

          if (this.openedRight) {
              this.$emit('actions-right-opened');
          }

          this.$emit('actions-opened');
      }

      public closeAction(): void {
          const el = (this.contentEl as HTMLElement);
          this.opened = false;
          el.style.transform = '';
          el.addEventListener('transitionend', this.closeTransitionEndHandler);
      }

      public openLeftAction(): void {
          const el = (this.contentEl as HTMLElement);
          const max = (this.leftActionsEl as HTMLElement).offsetWidth;
          const lastPosition = getTargetPosition(el);

          if (this.opened) {
              this.closeAction();
          }

          this.opened = true;
          this.openedLeft = true;

          if (Math.abs(lastPosition) >= max) {
              this.openTransitionEndHandler();
          } else {
              el.addEventListener('transitionend', this.openTransitionEndHandler);
          }

          el.style.transform = 'translateX(' + Math.round(max) + 'px)';
      }

      public openRightAction(): void {
          const el = (this.contentEl as HTMLElement);
          const max = (this.rightActionsEl as HTMLElement).offsetWidth;
          const lastPosition = getTargetPosition(el);

          if (this.opened) {
              this.closeAction();
          }

          this.opened = true;
          this.openedRight = true;

          if (Math.abs(lastPosition) >= max) {
              this.openTransitionEndHandler();
          } else {
              el.addEventListener('transitionend', this.openTransitionEndHandler);
          }

          el.style.transform = 'translateX(' + Math.round(-max) + 'px)';
      }

      public toggleLeftAction(): void {
          if (this.opened) {
              this.closeAction();
          } else {
              this.openLeftAction();
          }
      }

      public toggleRightAction(): void {
          if (this.opened) {
              this.closeAction();
          } else {
              this.openRightAction();
          }
      }

      public destroyed(): void {
          if (this.hammer) {
              this.hammer.destroy();
          }
      }

      private onDrag(e: HammerInput): void {
          const el = this.contentEl as HTMLElement;
          const elActLeft = this.leftActionsEl as HTMLElement;
          const elActRight = this.rightActionsEl as HTMLElement;

          // drag start
          if (!this.drag) {
              if (Math.abs(e.deltaX as number) <= Math.abs(e.deltaY as number)) {
                  return;
              }

              (el.style as any)['user-select'] = 'none';
              this.drag = true;
              this.dragLeft = this.openedLeft;
              this.dragRight = this.openedRight;
              this.dragStartPosition = getTargetPosition(el);
              this.maxDrag = new MaxDragAction(elActLeft.offsetWidth, elActRight.offsetWidth);
          }

          // drag
          if (-1 === [Hammer.DIRECTION_LEFT, Hammer.DIRECTION_RIGHT].indexOf(e.direction)) {
              return;
          }

          e.preventDefault();
          el.style.transform = 'translateX(' + this.getDelta((this.dragStartPosition || 0) + e.deltaX) + 'px)';
      }

      private onDragEnd(e: HammerInput): void {
          const el = this.contentEl as HTMLElement;
          const elActLeft = this.leftActionsEl as HTMLElement;
          const elActRight = this.rightActionsEl as HTMLElement;
          const lastPosition = getTargetPosition(el);

          e.preventDefault();
          (el.style as any)['user-select'] = '';
          this.drag = false;
          delete this.maxDrag;
          delete this.dragStartPosition;

          const width = lastPosition > 0 ? elActLeft.offsetWidth : elActRight.offsetWidth;
          const movement = Math.abs((this.opened ? -width : 0) + Math.abs(lastPosition));
          const openActionName = 'open' + (lastPosition > 0 ? 'Left' : 'Right') + 'Action';

          if ((movement / width) > 0.3) {
              if (this.opened) {
                  this.closeAction();
              } else {
                  this[openActionName]();
              }
          } else {
              if (Math.abs(e.velocityX) >= 0.5) {
                  if (this.opened) {
                      this.closeAction();
                  } else {
                      this[openActionName]();
                  }
              } else {
                  if (this.opened) {
                      this[openActionName]();
                  } else {
                      this.closeAction();
                  }
              }
          }
      }

      private getDelta(delta: number): number {
          if (this.maxDrag) {
              if (delta > this.maxDrag.left) {
                  delta = this.maxDrag.left;
              } else if (delta < -this.maxDrag.right) {
                  delta = -this.maxDrag.right;
              }
          }

          return Math.round(delta);
      }
  }
</script>
