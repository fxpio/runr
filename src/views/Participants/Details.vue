<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-container fill-height>
    <v-row no-gutters justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <transition name="fade" mode="out-in">
          <error-message :message="previousError.message" v-if="!loading && !!previousError">
            <v-btn depressed ripple color="accent" class="mt-3" @click.prevent="requestContent">
              {{ $t('retry') }}
            </v-btn>
          </error-message>

          <participant-card :registration="registration" v-else-if="!loading && !!registration">
          </participant-card>

          <error-message :message="$t('error.404-page-not-found')" v-else-if="!loading && !previousError">
            <v-btn depressed ripple color="accent" class="mt-3" @click.prevent="$routerBack.back()">
              {{ $t('views.participants.retry-search') }}
            </v-btn>
          </error-message>

          <loading v-else-if="loading"></loading>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Canceler} from '@/api/Canceler';
  import {ListResponse} from '@/api/models/responses/ListResponse';
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {Registration} from '@/api/services/Registration';
  import ErrorMessage from '@/components/ErrorMessage.vue';
  import Loading from '@/components/Loading.vue';
  import {IEdition} from '@/db/tables/IEdition';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {EditionModuleState} from '@/stores/edition/EditionModuleState';
  import '@/styles/views/Participants/Details.scss';
  import ParticipantCard from '@/views/Participants/components/ParticipantCard.vue';
  import {mixins} from 'vue-class-component';
  import {Component} from 'vue-property-decorator';
  import {Route} from 'vue-router';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {Loading, ParticipantCard, ErrorMessage},
  })
  export default class Details extends mixins(AjaxContent) {
    public registration!: RegistrationResponse;

    private stateUnwatch?: () => void;

    public async beforeRouteUpdate(to: Route, from: Route, next: () => void): Promise<void> {
      await this.requestContent(Number((to.params as any).id));
      next();
    }

    public beforeMount(): void {
      this.stateUnwatch = this.$store.watch((state: EditionModuleState) => state.edition.current,
              this.watchEdition);

      this.loading = true;
    }

    public async mounted(): Promise<void> {
      let cacheSelection = this.$store.state.participant.cacheSelection;

      if (cacheSelection && cacheSelection.id !== Number((this.$route.params as any).id)) {
        this.$store.commit('participant/setSelection', null);
        cacheSelection = null;
      }

      if (cacheSelection) {
        this.registration = cacheSelection;
        this.loading = false;
      } else {
        await this.requestContent();
      }
    }

    public destroyed(): void {
      if (this.stateUnwatch) {
        this.stateUnwatch();
      }
    }

    private async requestContent(id?: number) {
      if (!id) {
        id = Number((this.$route.params as any).id as string);
      }

      const requestOpts = {
        itemsPerPage: 1,
        search: {
          id: isNaN(id) ? -1 : id,
        },
      };

      const res = await this.fetchData<ListResponse<RegistrationResponse>>((canceler: Canceler) =>
              this.$api.get<Registration>(Registration).list(requestOpts, canceler));

      if (res) {
        this.registration = res.results[0];
      }

      this.loading = false;
    }

    private watchEdition(edition: IEdition|null, previousEdition?: IEdition|null): void {
      if (previousEdition) {
        this.$router.replace({name: 'participants'});
      }
    }
  }
</script>
