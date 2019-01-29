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
        <v-subheader>{{ $t('views.settings.account') }}</v-subheader>
        <v-card>
          <v-list two-line>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <v-icon size="52" :color="$store.state.auth.authenticated ? 'accent' : 'grey'">account_circle</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  <span v-if="$store.state.auth.authenticated">{{ $store.state.auth.fullName }}</span>
                  <span v-if="!$store.state.auth.authenticated">{{ $t('views.settings.no-account') }}</span>
                </v-list-tile-title>

                <v-list-tile-sub-title v-if="$store.state.auth.authenticated && $store.state.auth.email">
                  {{ $store.state.auth.email }}
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action v-if="!$store.state.auth.authenticated">
                <v-tooltip left>
                  <v-btn
                          slot="activator"
                          outline
                          small
                          fab
                          color="accent"
                          ripple
                          icon
                          @click="login">
                    <v-icon>person_add</v-icon>
                  </v-btn>
                  <span>{{ $t('views.login.title') }}</span>
                </v-tooltip>
              </v-list-tile-action>

              <v-list-tile-action v-if="$store.state.auth.authenticated">
                <v-tooltip left>
                  <v-btn
                          slot="activator"
                          outline
                          small
                          fab
                          color="accent"
                          ripple
                          icon
                          @click="login">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <span>{{ $t('edit') }}</span>
                </v-tooltip>
              </v-list-tile-action>

              <v-list-tile-action v-if="$store.state.auth.authenticated">
                <v-tooltip left>
                  <v-btn
                          slot="activator"
                          outline
                          small
                          fab
                          color="accent"
                          ripple
                          icon
                          @click="$store.dispatch('auth/logout', $router.currentRoute.fullPath)">
                    <v-icon>exit_to_app</v-icon>
                  </v-btn>
                  <span>{{ $t('logout') }}</span>
                </v-tooltip>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>

        <v-subheader class="mt-4">{{ $t('views.settings.general') }}</v-subheader>
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

        <v-subheader class="mt-4">{{ $t('menu.bibs') }}</v-subheader>
        <v-card>
          <v-list three-line>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ $t('views.settings.use-bib-aliases') }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ $t('views.settings.use-bib-aliases-description') }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-switch v-model="useBibAlias"></v-switch>
              </v-list-tile-action>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ $t('views.settings.start-printing-immediately') }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ $t('views.settings.start-printing-immediately-description') }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-switch v-model="startPrintingImmediately"></v-switch>
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

    public get useBibAlias(): boolean {
      return this.$store.state.bib.useAlias;
    }

    public set useBibAlias(value: boolean) {
      this.$store.commit('bib/toggleUseAlias', value);
    }

    public get startPrintingImmediately(): boolean {
      return this.$store.state.bib.startPrintingImmediately;
    }

    public set startPrintingImmediately(value: boolean) {
      this.$store.commit('bib/toggleStartPrintingImmediately', value);
    }

    public login(): void {
      this.$router.push({name: 'login', query: {redirect: this.$router.currentRoute.fullPath, force: '1'}});
    }
  }

  interface LanguageAvailable {
    code: string;
    label: string;
  }
</script>
