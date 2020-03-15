<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-fade-transition mode="out-in">
    <v-container v-if="!$store.state.auth.authenticationPending">
      <v-row no-gutters justify="center">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          <v-card flat>
            <v-card-title primary-title>
              <div class="headline primary--text">
                {{ $t('views.login.title') }}
              </div>
            </v-card-title>

            <v-card-text>
              <v-alert type="error" class="mt-3 mb-4" transition="scale-transition" :value="null !== formAlert">
                {{ formAlert }}
              </v-alert>

              <v-form ref="form" @submit.prevent>
                <v-text-field
                        :label="$i18n.t('views.login.full-name')"
                        v-model="fullName"
                        data-vv-name="fullName"
                        :data-vv-as="$i18n.t('views.login.full-name')"
                        v-validate="'required'"
                        :error-messages="errors.collect('fullName')"
                        @keydown.enter="login"
                        autofocus
                        outlined
                        clearable
                        required>
                </v-text-field>

                <v-switch
                        :label="$i18n.t('views.login.login-with-my-credentials')"
                        v-model="loginWithMyCredentials"
                ></v-switch>

                <v-slide-y-transition>
                  <div v-if="loginWithMyCredentials">
                    <v-text-field
                            type="email"
                            :label="$i18n.t('views.login.email')"
                            v-model="email"
                            data-vv-name="email"
                            :data-vv-as="$i18n.t('views.login.email')"
                            v-validate="'required|email'"
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
                            v-validate="'required'"
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
                  </div>
                </v-slide-y-transition>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text ripple active-class="" @click.stop="$routerBack.back">{{$t('cancel')}}</v-btn>
              <v-btn color="accent" depressed raised ripple @click="login">{{$t('views.login.title')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <loading v-else></loading>
  </v-fade-transition>
</template>

<script lang="ts">
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
export default class Login extends Vue {
    public formAlert: string|null = null;

    public fullName: string|null = null;

    public loginWithMyCredentials: boolean = false;

    public email: string|null = null;

    public password: string|null = null;

    public saveCredentials: boolean = true;

    public showPassword: boolean = false;

    public metaInfo(): MetaInfo {
      return {
        title: this.$t('views.login.title') as string,
      };
    }

    public async mounted(): Promise<void> {
      this.fullName = this.$store.state.auth.fullName;
      this.email = this.$store.state.auth.email;
      this.password = this.$store.state.auth.password;
      this.loginWithMyCredentials = null !== this.email || '1' === (this.$router.currentRoute.query as any).auth;
    }

    public async beforeDestroy(): Promise<void> {
      await this.$store.dispatch('auth/cancel');
    }

    public async login(): Promise<void> {
      if (await this.$validator.validateAll()) {
        try {
          const email = this.loginWithMyCredentials ? this.email : null;
          const password = this.loginWithMyCredentials ? this.password : null;
          const saveCredentials = this.loginWithMyCredentials ? this.saveCredentials : false;
          const force = (this.$router.currentRoute.query as any).force;
          let redirect = (this.$router.currentRoute.query as any).redirect;

          if ('1' !== force || !redirect) {
            redirect = email && password ? this.$router.resolve({name: 'editions'}).route.fullPath : null;
          }

          await this.$store.dispatch('auth/login', new AuthCredentials(String(this.fullName),
                  email, password, saveCredentials, redirect));
        } catch (e) {
          this.formAlert = getRequestErrorMessage(this, e, true);
        }
      }
    }
  }
</script>
