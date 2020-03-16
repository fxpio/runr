<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-fade-transition mode="out-in">
    <v-container v-if="!pending">
      <v-row no-gutters justify="center">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
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
                  <v-alert type="error" class="mt-3 mb-4" transition="scale-transition" :value="null !== formAlertApiKey">
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
                            @keydown.enter="pingEdition"
                            autofocus
                            outlined
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
                            @keydown.enter="pingEdition"
                            outlined
                            clearable
                            required>
                    </v-text-field>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text ripple active-class="" @click.stop="$routerBack.back">{{$t('cancel')}}</v-btn>
                  <v-btn color="accent" depressed raised ripple @click="pingEdition">{{$t('add')}}</v-btn>
                </v-card-actions>

                <v-card-text class="pt-0 pb-0">
                  <v-alert outlined type="info" icon="help_outline" class="mt-3" :value="true">
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
                  <v-alert type="error" class="mt-3 mb-4" transition="scale-transition" :value="null !== formAlertCredentials">
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
                            @keydown.enter="login"
                            outlined
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
                            @keydown.enter="login"
                            outlined
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
                  <v-spacer></v-spacer>
                  <v-btn text ripple active-class="" @click.stop="$routerBack.back">{{$t('cancel')}}</v-btn>
                  <v-btn color="accent" depressed raised ripple @click="login">{{$t('views.login.title')}}</v-btn>
                </v-card-actions>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <loading v-else></loading>
  </v-fade-transition>
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
