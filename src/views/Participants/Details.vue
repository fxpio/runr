<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <transition name="fade" mode="out-in">
    <error-message :message="previousError.message" v-if="!loading && !!previousError">
      <v-btn class="mt-3" @click.prevent="requestContent">{{ $t('retry') }}</v-btn>
    </error-message>

    <participant-card :registration="registration" v-else-if="!loading"></participant-card>
  </transition>
</template>

<script lang="ts">
  import {ListResponse} from '@/api/models/responses/ListResponse';
  import {RegistrationResponse} from '@/api/models/responses/RegistrationResponse';
  import {Registration} from '@/api/services/Registration';
  import ErrorMessage from '@/components/ErrorMessage.vue';
  import {IEdition} from '@/db/tables/IEdition';
  import {AjaxContent} from '@/mixins/AjaxContent';
  import {EditionModuleState} from '@/stores/edition/EditionModuleState';
  import '@/styles/views/Participants/Details.scss';
  import ParticipantCard from '@/views/Participants/components/ParticipantCard.vue';
  import {mixins} from 'vue-class-component';
  import {Component} from 'vue-property-decorator';

  /**
   * @author François Pluchino <francois.pluchino@gmail.com>
   */
  @Component({
    components: {ParticipantCard, ErrorMessage},
  })
  export default class Details extends mixins(AjaxContent) {
    public registration!: RegistrationResponse;

    private stateUnwatch?: () => void;

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

    private async requestContent() {
      const id = Number((this.$route.params as any).id as string);
      const requestOpts = {
        itemsPerPage: 1,
        search: {
          id: isNaN(id) ? -1 : id,
        },
      };

      const res = await this.fetchData<ListResponse<RegistrationResponse>>(() =>
              this.$api.get<Registration>(Registration).list(requestOpts));

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
