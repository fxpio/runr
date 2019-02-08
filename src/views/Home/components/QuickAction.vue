<!--
This file is part of the BibScan for Njuko package.

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
    <v-card-title>
      <v-layout row wrap>
        <v-flex xs12>
          <v-icon size="64" center :color="color + ' lighten-3'">
            {{ icon }}
          </v-icon>
        </v-flex>

        <v-flex xs12>
          <div class="headline mt-2 mb-4">
            {{ label }}
          </div>
        </v-flex>
      </v-layout>

      <slot></slot>
    </v-card-title>
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
