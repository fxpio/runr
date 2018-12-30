<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <div class="bib-label">
    <div class="bl-competition">{{competitionFormatted()}}</div>
    <div class="bl-competition-unit">{{competitionUnit}}</div>
    <div class="bl-firstname">{{firstName}}</div>

    <div class="bl-bib-number">N° {{bibNumber}}</div>

    <div class="bl-phone-urgency-label">Téléphone d'urgence</div>
    <div class="bl-phone-urgency">{{phoneUrgency}}</div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import '@/styles/components/BibLabel.scss';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class BibLabel extends Vue {
    @Prop([String, Number])
    public competition?: string|number;

    @Prop(String)
    public competitionUnit?: string;

    @Prop([String, Number])
    public bibNumber?: string|number;

    @Prop(String)
    public firstName?: string;

    @Prop(String)
    public phoneUrgency?: string;

    public competitionFormatted(): string {
      return String(this.competition).replace(',', '.');
    }
  }
</script>
