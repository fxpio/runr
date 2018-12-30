<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height>
    <v-layout justify-center row>
      <v-flex sm10 md8 lg6 xl4 v-if="!$store.state.edition.serverPending">
        <v-subheader>{{ $t('views.edition-add.title') }}</v-subheader>

        <v-card>
          <v-card-text>
            <v-alert type="error" class="mt-3 mb-4" transition="scale-transition" :value="formAlert">
              {{ formAlert }}
            </v-alert>

            <v-form ref="form" @submit="ping">
              <v-text-field
                      :label="$i18n.t('views.edition-add.identifier')"
                      v-model="identifier"
                      data-vv-name="identifier"
                      v-validate="'required'"
                      :error-messages="errors.collect('identifier')"
                      autofocus
                      outline
                      clearable
                      required>
              </v-text-field>

              <v-text-field
                      :label="$i18n.t('views.edition-add.api-key')"
                      v-model="apiKey"
                      data-vv-name="apiKey"
                      v-validate="'required'"
                      :error-messages="errors.collect('apiKey')"
                      :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                      :type="showPassword ? 'text' : 'password'"
                      @click:append="showPassword = !showPassword"
                      outline
                      clearable
                      required>
              </v-text-field>

              <div>
                <v-btn color="accent" depressed raised ripple @click="ping">{{$t('add')}}</v-btn>
                <v-btn flat ripple active-class="" :to="{name: 'editions'}">{{$t('cancel')}}</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <v-alert outline type="info" icon="help_outline" class="mt-3" transition="scale-transition" value="true">
          <p>{{ $t('views.edition-add.help.into') }}</p>
          <ol>
            <li>{{ $t('views.edition-add.help.step-1') }}</li>
            <li>{{ $t('views.edition-add.help.step-2') }}</li>
            <li>{{ $t('views.edition-add.help.step-3') }}</li>
          </ol>
        </v-alert>
      </v-flex>

      <loading v-if="$store.state.edition.serverPending" :fullscreen="false"></loading>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {Credentials} from '@/api/Credentials';
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
    public formAlert: string|null = null;

    public identifier: string|null = null;

    public apiKey: string|null = null;

    public showPassword: boolean = false;

    public metaInfo(): MetaInfo {
      return {
        title: this.$i18n.t('views.edition-add.title') as string,
      };
    }

    public async beforeDestroy(): Promise<void> {
      await this.$store.dispatch('edition/cancel');
    }

    public async ping(): Promise<void> {
      if (await this.$validator.validateAll()) {
        try {
          await this.$store.dispatch('edition/ping', {
            identifier: this.identifier,
            apiKey: this.apiKey,
          } as Credentials);
        } catch (e) {
          this.formAlert = getRequestErrorMessage(this, e);
        }
      }
    }
  }
</script>
