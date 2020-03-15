<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-card flat
          ripple
          hover
          :color="color"
          class="white--text text-align-left"
          height="100%"
          :to="to">
    <v-container>
      <v-row no-gutters>
        <v-col>
          <v-icon size="64" center :color="color + ' lighten-3'">
            {{ icon }}
          </v-icon>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="headline mt-2 mb-4">
          {{ label }}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col>
          <slot></slot>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
export default class QuickAction extends Vue {
    @Prop({type: String, required: true})
    public color!: string;

    @Prop({type: String, required: true})
    public icon!: string;

    @Prop({type: String, required: true})
    public label!: string;

    @Prop({type: [Object, String], required: true})
    public to!: object|string;
  }
</script>
