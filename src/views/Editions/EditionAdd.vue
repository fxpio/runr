<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height>
    <v-layout justify-center row>
      <v-fade-transition mode="out-in">
        <v-flex sm10 md8 lg6 xl4 v-if="!pending">
          <v-subheader class="primary--text">
            {{ $t('views.editions-add.title') }}
          </v-subheader>

          <v-card flat>
            <v-tabs centered icons-and-text v-model="tabActive">
              <v-tab key="apiKey" ripple>
                <span :class="$store.state.darkMode.enabled ? '' : 'accent--text'">
                  {{ $t('views.editions-add.api-key') }}
                </span>
                <v-icon :color="$store.state.darkMode.enabled ? null: 'accent'">vpn_key</v-icon>
              </v-tab>

              <v-tab key="credentials" ripple>
                <span :class="$store.state.darkMode.enabled ? '' : 'accent--text'">
                  {{ $t('views.editions-add.credentials') }}
                </span>
                <v-icon :color="$store.state.darkMode.enabled ? null: 'accent'">account_circle</v-icon>
              </v-tab>

              <v-tab-item key="apiKey">

                <v-card-text>
                  <v-alert type="error" class="mt-3 mb-4" transition="scale-transition" :value="formAlertApiKey">
                    {{ formAlertApiKey }}
                  </v-alert>

                  <v-form ref="form" @submit.prevent>
                    <v-text-field
                            :label="$i18n.t('views.editions-add.identifier')"
                            v-model="identifier"
                            data-vv-name="identifier"
                            :data-vv-as="$i18n.t('views.editions-add.identifier')"
                            v-validate="{rules: {required: 0 === tabActive}}"
                            :error-messages="errors.collect('identifier')"
                            @keyup.enter="pingEdition"
                            autofocus
                            outline
                            clearable
                            required>
                    </v-text-field>

                    <v-text-field
                            :label="$i18n.t('views.editions-add.api-key')"
                            v-model="apiKey"
                            data-vv-name="apiKey"
                            :data-vv-as="$i18n.t('views.editions-add.api-key')"
                            v-validate="{rules: {required: 0 === tabActive}}"
                            :error-messages="errors.collect('apiKey')"
                            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                            :type="showPassword ? 'text' : 'password'"
                            @click:append="showPassword = !showPassword"
                            @keyup.enter="pingEdition"
                            outline
                            clearable
                            required>
                    </v-text-field>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-list-tile class="grow">
                    <v-layout align-center justify-end>
                      <v-btn flat ripple active-class="" @click.stop="$routerBack.back">{{$t('cancel')}}</v-btn>
                      <v-btn color="accent" depressed raised ripple @click="pingEdition">{{$t('add')}}</v-btn>
                    </v-layout>
                  </v-list-tile>
                </v-card-actions>

                <v-card-text>
                  <v-alert outline type="info" icon="help_outline" class="mt-3" value="true">
                    <p>{{ $t('views.editions-add.help.into') }}</p>
                    <ol>
                      <li>{{ $t('views.editions-add.help.step-1') }}</li>
                      <li>{{ $t('views.editions-add.help.step-2') }}</li>
                      <li>{{ $t('views.editions-add.help.step-3') }}</li>
                    </ol>
                  </v-alert>
                </v-card-text>
              </v-tab-item>

              <v-tab-item key="credentials">
                <v-card-text>
                  <v-alert type="error" class="mt-3 mb-4" transition="scale-transition" :value="formAlertCredentials">
                    {{ formAlertCredentials }}
                  </v-alert>

                  <v-form ref="form" @submit.prevent>
                    <v-text-field
                            :label="$i18n.t('views.login.email')"
                            v-model="email"
                            data-vv-name="email"
                            :data-vv-as="$i18n.t('views.login.email')"
                            v-validate="{rules: {required: 1 === tabActive, email: 1 === tabActive}}"
                            :error-messages="errors.collect('email')"
                            @keyup.enter="login"
                            outline
                            clearable
                            required>
                    </v-text-field>

                    <v-text-field
                            :label="$i18n.t('views.login.password')"
                            v-model="password"
                            data-vv-name="password"
                            :data-vv-as="$i18n.t('views.login.password')"
                            v-validate="{rules: {required: 1 === tabActive}}"
                            :error-messages="errors.collect('password')"
                            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                            :type="showPassword ? 'text' : 'password'"
                            @click:append="showPassword = !showPassword"
                            @keyup.enter="login"
                            outline
                            clearable
                            required>
                    </v-text-field>

                    <v-checkbox
                            :label="$i18n.t('views.login.save-credentials')"
                            v-model="saveCredentials"
                            class="mt-0"
                    ></v-checkbox>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-list-tile class="grow">
                    <v-layout align-center justify-end>
                      <v-btn flat ripple active-class="" @click.stop="$routerBack.back">{{$t('cancel')}}</v-btn>
                      <v-btn color="accent" depressed raised ripple @click="login">{{$t('views.login.title')}}</v-btn>
                    </v-layout>
                  </v-list-tile>
                </v-card-actions>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-flex>

        <loading v-if="pending"></loading>
      </v-fade-transition>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {ApiCredentials} from '@/api/credentials/ApiCredentials';
  import {AuthCredentials} from '@/api/credentials/AuthCredentials';
  import Loading from '@/components/Loading.vue';
  import {getRequestErrorMessage} from '@/utils/error';
  import {MetaInfo} from 'vue-meta';
  import {Component, Vue} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {Loading},
  })
  export default class EditionAdd extends Vue {
    public tabActive: number|null = null;

    public formAlertApiKey: string|null = null;

    public formAlertCredentials: string|null = null;

    public identifier: string|null = null;

    public apiKey: string|null = null;

    public showPassword: boolean = false;

    public email: string|null = null;

    public password: string|null = null;

    public saveCredentials: boolean = true;

    public get pending(): boolean {
      return this.$store.state.edition.serverPending || this.$store.state.auth.authenticationPending;
    }

    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.editions-add.title') as string,
      };
    }

    public async created(): Promise<void> {
      this.email = this.$store.state.auth.email;
      this.password = this.$store.state.auth.password;
      this.tabActive = this.email ? 1 : 0;
    }

    public async beforeDestroy(): Promise<void> {
      if (0 === this.tabActive) {
        await this.$store.dispatch('edition/cancel');
      } else {
        await this.$store.dispatch('auth/cancel');
      }
    }

    public async pingEdition(): Promise<void> {
      if (await this.$validator.validateAll()) {
        try {
          await this.$store.dispatch('edition/ping', new ApiCredentials(String(this.identifier),
                  String(this.apiKey)));
        } catch (e) {
          this.formAlertApiKey = getRequestErrorMessage(this, e);
        }
      }
    }

    public async login(): Promise<void> {
      if (await this.$validator.validateAll()) {
        try {
          let redirect = (this.$router.currentRoute.query as any).redirect as string|undefined;

          if (!redirect) {
            redirect = this.$router.resolve({name: 'editions'}).route.fullPath;
          }

          await this.$store.dispatch('auth/login', new AuthCredentials(String(this.$store.state.auth.fullName),
                  this.email, this.password, this.saveCredentials, redirect));
        } catch (e) {
          this.formAlertCredentials = getRequestErrorMessage(this, e, true);
        }
      }
    }
  }
</script>
