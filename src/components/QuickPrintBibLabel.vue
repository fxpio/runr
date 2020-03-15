<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-dialog v-model="value"
            eager
            fullscreen
            dark
            transition="dialog-bottom-transition"
            ref="printDialog"
            hide-overlay>

    <v-card shaped flat>
      <v-toolbar dark flat>
        <v-btn icon dark @click.prevent="$emit('input', false)">
          <v-icon>close</v-icon>
        </v-btn>

        <v-toolbar-title>
          {{ $t('views.bib-labels-print-one.title') }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-tooltip left eager>
          <template v-slot:activator="{on}">
            <v-btn v-on="on" icon ripple @click.prevent="print">
              <v-icon>print</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('print') }}</span>
        </v-tooltip>
      </v-toolbar>

      <v-container fluid fill-height>
        <v-layout column align-center justify-center>
          <div class="bib-label-wrapper" v-if="bib">
            <bib-label :key="bib.bibNumber"
                       :distance="bib.distance"
                       :unit="bib.unit"
                       :firstName="bib.firstName"
                       :bibNumber="bib.bibNumber"
                       :phoneUrgency="bib.phoneUrgency"
                       :startBirthDate="bib.startBirthDate"
                       :endBirthDate="bib.endBirthDate"
            ></bib-label>
          </div>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import BibItem from '@/bib/BibItem';
  import BibLabel from '@/components/BibLabel.vue';
  import {Bib} from '@/mixins/Bib';
  import {Printerable} from '@/mixins/Printerable';
  import {mixins} from 'vue-class-component';
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {BibLabel},
  })
  export default class QuickPrintBibLabel extends mixins(Bib, Printerable) {
    @Prop({type: Boolean, default: false})
    public value!: boolean;

    @Prop()
    public registration?: RegistrationResponse;

    private bib: BibItem = new BibItem();

    private dialog!: HTMLElement;

    public async beforeMount(): Promise<void> {
      this.bib = this.registration
              ? await this.convertRegistrationToBib(this.registration)
              : this.createMockBib();
    }

    public mounted(): void {
      this.dialog = (this.$refs.printDialog as Vue).$refs.dialog as HTMLElement;
    }

    public destroyed(): void {
      this.dialog.removeEventListener('transitionend', this.print);
    }

    @Watch('registration')
    public async watchRegistration(): Promise<void> {
      this.bib = this.registration
              ? await this.convertRegistrationToBib(this.registration)
              : this.createMockBib();
    }

    @Watch('value')
    public watchValue(): void {
      if (this.value) {
        this.dialog.addEventListener('transitionend', this.print);
      } else {
        this.dialog.removeEventListener('transitionend', this.print);
      }
    }

    public print(): void {
      this.dialog.removeEventListener('transitionend', this.print);
      this.printer.print([...document.querySelectorAll('.bib-label-wrapper .bib-label').values()]);
    }
  }
</script>
