<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-layout row justify-center v-if="fullscreen">
    <v-dialog v-model="value" persistent fullscreen hide-overlay transition="fade-transition">
      <v-card height="100%">
        <v-layout align-center justify-center column fill-height>
          <v-progress-circular indeterminate :size="46" :color="progressColor"></v-progress-circular>
          <h1 v-if="message != null">{{message}}</h1>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-layout>

  <v-layout align-center justify-center column fill-height v-else>
    <v-progress-circular indeterminate :size="46" :color="progressColor"></v-progress-circular>
    <h1 v-if="message != null">{{message}}</h1>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class Loading extends Vue {
    @Prop({type: Boolean, default: false})
    public value!: boolean;

    @Prop({type: String, default: null})
    public message!: string|null;

    @Prop({type: String, default: 'accent'})
    public progressColor!: string;

    @Prop({type: Boolean, default: false})
    public fullscreen!: boolean;
  }
</script>
