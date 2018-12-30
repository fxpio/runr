<!--
This file is part of the BibScan for Njuko package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
  <v-toolbar dark color="primary" app clipped-left>
    <v-toolbar-side-icon @click.stop="$store.commit('drawer/toggle')"></v-toolbar-side-icon>

    <v-menu>
      <v-toolbar-title slot="activator">
        <span>{{ $store.state.edition.current ? $store.state.edition.current.name : $t('app.name') }}</span>
        <v-icon dark>arrow_drop_down</v-icon>
      </v-toolbar-title>

      <v-list>
        <v-list-tile
                v-for="edition in $store.state.edition.all"
                :key="edition.id"
                @click="$store.dispatch('edition/select', edition.id)"
        >
          <v-list-tile-content>
            <v-list-tile-title v-text="edition.name"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-if="$store.getters['edition/isSelected'](edition.id)" color="pink">star</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile key="add" :to="{name: 'edition-add', query: {redirect: $router.currentRoute.fullPath}}">{{ $t('add.edition') }}</v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>
