<template>
  <v-card>
    <v-card-title class="text-center">
      <v-spacer />Supprimer {{ title }} ?<v-spacer />
    </v-card-title>
    <v-card-text class="text-center">
      <slot></slot>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="red" dark :elevation="0" class="mb-2" @click="action">
        confirmer
      </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String as () => string,
      required: true,
      default: '',
    },
    action: {
      type: Function,
      required: true,
      default: () => {},
    },
  },
})
</script>
