<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height>
    <v-layout justify-space-between row fill-height wrap>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 xl6 offset-xl3>
        <v-subheader class="mt-4 primary--text">
          {{ $t('views.about.title') }}
        </v-subheader>

        <v-card flat>
          <v-list two-line>
            <v-list-tile>
              <v-list-tile-avatar>
                <v-icon color="accent">history</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ $t('views.about.fields.version') }}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ version }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile target="_blank" href="https://github.com/fxpio/runr/issues">
              <v-list-tile-avatar>
                <v-icon color="accent">bug_report</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ $t('views.about.fields.bug-report') }}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ $t('views.about.fields.bug-report-description') }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile target="_blank" href="https://github.com/fxpio/runr/releases">
              <v-list-tile-avatar>
                <v-icon color="accent">track_changes</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ $t('views.about.fields.changelog') }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>

        <v-subheader class="mt-4 primary--text">
          {{ $t('views.about.sections.author') }}
        </v-subheader>

        <v-card flat>
          <v-list two-line>
            <v-list-tile target="_blank" :href="authorGithubUrl">
              <v-list-tile-avatar>
                <v-icon color="accent">person</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ authorFullName }}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ authorGithubName }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile target="_blank" href="https://github.com/fxpio/runr">
              <v-list-tile-avatar>
                <v-icon color="accent">fab fa-github</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ $t('views.about.fields.fork-on-github') }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile :href="'mailto:' + authorEmail">
              <v-list-tile-avatar>
                <v-icon color="accent">email</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ $t('views.about.fields.send-an-email') }}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ authorEmail }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
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

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {},
  })
  export default class About extends Vue {
    public get version(): string {
      return __VERSION__;
    }

    public get authorFullName(): string {
      return 'François Pluchino';
    }

    public get authorGithubName(): string {
      return 'francoispluchino';
    }

    public get authorEmail(): string {
      return 'francois.pluchino@gmail.com';
    }

    public get authorGithubUrl(): string {
      return 'https://github.com/francoispluchino';
    }

    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.about.title') as string,
      };
    }
  }
</script>
