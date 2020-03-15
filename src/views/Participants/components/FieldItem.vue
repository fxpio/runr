<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <tr>
    <td class="font-weight-bold pa-2">{{ label }}</td>
    <td class="pa-2">
      <slot></slot>
    </td>
  </tr>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class FieldItem extends Vue {
    @Prop({type: String, required: true})
    public label!: string;
  }
</script>
