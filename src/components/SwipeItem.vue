<!--
This file is part of the BibScan for Njuko package.

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

      public get classes(): Record<string, boolean> {
          return {
              'swipe-item': true,
              'swipe-item--disabled': this.disabled,
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
          if (!this.$el.classList.contains('action-opened')) {
              this.$el.classList.remove('left-action-opened', 'right-action-opened');
          }

          if (!this.$el.classList.contains('drag')) {
              this.$el.classList.remove('drag-left', 'drag-right');
          }

          (this.contentEl as HTMLElement).removeEventListener('transitionend', this.closeTransitionEndHandler);
      }

      public isOpen(): boolean {
          return this.$el.classList.contains('action-opened');
      }

      public isLeftActionOpen(): boolean {
          return this.$el.classList.contains('left-action-opened');
      }

      public isRightActionOpen(): boolean {
          return this.$el.classList.contains('right-action-opened');
      }

      public closeAction(): void {
          const el = (this.contentEl as HTMLElement);
          this.$el.classList.remove('action-opened');
          el.style.transform = '';
          el.addEventListener('transitionend', this.closeTransitionEndHandler);
      }

      public openLeftAction(): void {
          const max = (this.leftActionsEl as HTMLElement).offsetWidth;

          if (this.isOpen()) {
              this.closeAction();
          }

          this.$el.classList.add('action-opened', 'left-action-opened');
          (this.contentEl as HTMLElement).style.transform = 'translateX(' + Math.round(max) + 'px)';
      }

      public openRightAction(): void {
          const max = (this.rightActionsEl as HTMLElement).offsetWidth;

          if (this.isOpen()) {
              this.closeAction();
          }

          this.$el.classList.add('action-opened', 'right-action-opened');
          (this.contentEl as HTMLElement).style.transform = 'translateX(' + Math.round(-max) + 'px)';
      }

      public toggleLeftAction(): void {
          if (this.isOpen()) {
              this.closeAction();
          } else {
              this.openLeftAction();
          }
      }

      public toggleRightAction(): void {
          if (this.isOpen()) {
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
          if (!this.maxDrag) {
              if (Math.abs(e.deltaX as number) <= Math.abs(e.deltaY as number)) {
                  return;
              }

              let direction = Hammer.DIRECTION_LEFT === e.direction ? 'right' : 'left';
              this.dragStartPosition = getTargetPosition(el);
              this.maxDrag = new MaxDragAction(elActLeft.offsetWidth, elActRight.offsetWidth);

              if (this.isLeftActionOpen()) {
                  direction = 'left';
              } else if (this.isRightActionOpen()) {
                  direction = 'right';
              }

              this.$el.classList.add('drag', 'drag-' + direction);
              (el.style as any)['user-select'] = 'none';
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
          const opened = this.isOpen();

          e.preventDefault();
          this.$el.classList.remove('drag');
          (el.style as any)['user-select'] = '';
          delete this.maxDrag;
          delete this.dragStartPosition;

          const width = lastPosition > 0 ? elActLeft.offsetWidth : elActRight.offsetWidth;
          const movement = Math.abs((opened ? -width : 0) + Math.abs(lastPosition));
          const openActionName = 'open' + (lastPosition > 0 ? 'Left' : 'Right') + 'Action';

          if ((movement / width) > 0.3) {
              if (opened) {
                  this.closeAction();
              } else {
                  this[openActionName]();
              }
          } else {
              if (Math.abs(e.velocityX) >= 0.5) {
                  if (opened) {
                      this.closeAction();
                  } else {
                      this[openActionName]();
                  }
              } else {
                  if (opened) {
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
