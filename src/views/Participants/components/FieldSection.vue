<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <tbody>
  <tr @click.prevent="$emit('input', !value)">
    <td colspan="2" class="font-weight-bold subheading text-uppercase primary--text pt-2" style="word-break: normal;">
      <v-row no-gutters align="center" align-content="space-between">
        <v-col>
          <slot></slot>
        </v-col>
        <v-col class="text-right">
          <v-btn depressed fab icon ripple small text right class="mr-0">
            <v-icon>{{ value ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
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
