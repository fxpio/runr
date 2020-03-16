<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <div class="bib-label">
    <div class="bl-distance">{{distanceFormatted()}}</div>
    <div class="bl-unit">{{unitFormatted()}}<br/>{{datesFormatted()}}</div>
    <div class="bl-firstname">{{firstName}}</div>

    <div class="bl-bib-number">N° {{bibNumber}}</div>

    <div class="bl-phone-urgency-label" v-if="phoneUrgency">Téléphone d'urgence</div>
    <div class="bl-phone-urgency" v-if="phoneUrgency">{{phoneUrgency}}</div>
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
    @Prop(String)
    public distance?: number;

    @Prop(String)
    public unit?: string;

    @Prop(String)
    public bibNumber?: string;

    @Prop(String)
    public firstName?: string;

    @Prop(String)
    public phoneUrgency?: string;

    @Prop(Date)
    public startBirthDate?: Date;

    @Prop(Date)
    public endBirthDate?: Date;

    public distanceFormatted(): string {
      let alias;

      if (this.$store.state.bib.useAlias) {
        alias = this.$store.getters['bib/getAlias'](this.distance, this.unit);
      }

      return alias ? alias : this.getFormattedDistance();
    }

    public unitFormatted(): string {
      return this.unit ? this.getFormattedDistance() + ' ' + this.unit : '';
    }

    public datesFormatted(): string {
      let dates = '';

      if (this.startBirthDate && this.endBirthDate) {
        dates += ' (' + this.startBirthDate.getFullYear() + ' - ' + this.endBirthDate.getFullYear() + ')';
      } else if (!this.startBirthDate && this.endBirthDate) {
        dates += ' (≤ ' + this.endBirthDate.getFullYear() + ')';
      } else if (this.startBirthDate && !this.endBirthDate) {
        dates += ' (≥ ' + this.startBirthDate.getFullYear() + ')';
      }

      return dates;
    }

    private getFormattedDistance(): string {
      return String(this.distance).replace(',', '.');
    }
  }
</script>
