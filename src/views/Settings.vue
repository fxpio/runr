<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height>
    <v-layout justify-space-between row fill-height wrap>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 xl6 offset-xl3>
        <v-subheader>{{ $t('views.settings.general') }}</v-subheader>
        <v-card>
          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ $t('views.settings.language') }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-menu>
                  <div slot="activator">
                    <span>{{ selectedLanguage }}</span>
                    <v-icon>arrow_drop_down</v-icon>
                  </div>

                  <v-list>
                    <v-list-tile
                            v-for="available in languageAvailables"
                            :key="available.code"
                            @click="$store.commit('i18n/setLocale', available.code)"
                    >
                      <v-list-tile-content>
                        <v-list-tile-title v-text="available.label"></v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-list-tile-action>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ $t('views.settings.dark-mode') }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-switch v-model="darkMode"></v-switch>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>

        <v-subheader class="mt-4">{{ $t('menu.label') }}</v-subheader>
        <v-card>
          <v-list three-line>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ $t('views.settings.close-after-print') }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ $t('views.settings.close-after-print-description') }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-switch v-model="closeAfterPrint"></v-switch>
              </v-list-tile-action>
            </v-list-tile>

          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {MetaInfo} from 'vue-meta';
  import {Component, Vue} from 'vue-property-decorator';
  import '@/styles/views/BibLabels.scss';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class Settings extends Vue {
    public languageAvailables: LanguageAvailable[] = [];

    public metaInfo(): MetaInfo {
      return {
        title: this.$i18n.t('views.settings.title') as string,
      };
    }

    public created(): void {
      for (const available of Object.keys(this.$i18n.messages)) {
        this.languageAvailables.push({
          code: available,
          label: this.$t('views.settings.languages.' + available) as string,
        });
      }

      this.languageAvailables.sort((a: LanguageAvailable, b: LanguageAvailable): number => {
        if (a.label < b.label) {
          return -1;
        } else if (a.label > b.label) {
          return 1;
        }

        return 0;
      });
    }

    public get selectedLanguage(): string {
      let language = this.$store.state.i18n.locale;
      language = this.$i18n.messages[language] ? language : this.$store.state.i18n.fallback;

      return this.$t('views.settings.languages.' + language) as string;
    }

    public get darkMode(): boolean {
      return this.$store.state.darkMode.enabled;
    }

    public set darkMode(value: boolean) {
      this.$store.commit('darkMode/toggle', value);
    }

    public get closeAfterPrint(): boolean {
      return this.$store.state.printer.closeAfterPrint;
    }

    public set closeAfterPrint(value: boolean) {
      this.$store.commit('printer/toggle', value);
    }
  }

  interface LanguageAvailable {
    code: string;
    label: string;
  }
</script>
