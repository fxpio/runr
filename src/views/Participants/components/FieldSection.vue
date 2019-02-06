<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <tbody>
  <tr @click.prevent="$emit('input', !value)">
    <td :colspan="showButton ? 1 : 2" class="font-weight-bold subheading text-uppercase primary--text">
      <slot></slot>
    </td>
    <td v-if="showButton" class="align-right">
      <v-btn depressed fab icon ripple small flat right class="mr-0">
        <v-icon>{{ value ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
      </v-btn>
    </td>
  </tr>
  </tbody>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class FieldSection extends Vue {
    @Prop({type: Boolean, default: null})
    public value!: boolean|null;

    public get showButton(): boolean {
      return null !== this.value;
    }

    @Watch('value')
    private watchValue(value: boolean|null) {
      this.$emit('input', value);
    }
  }
</script>
