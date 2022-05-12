<template>
  <v-snackbar
    v-model="show"
    timeout="3000"
    :color="color"
    style="cursor: pointer"
    @click.native="show = false"
  >
    <b>{{ message }}</b>
    <template #action="{ attrs }">
      <v-icon v-bind="attrs" right dark>
        {{ icon }}
      </v-icon>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'SnackBar',

  computed: {
    show: {
      get() {
        return this.$store.state.snackbar.show
      },
      set(value) {
        this.$store.commit('snackbar/SET_SHOW', value)
      },
    },
    ...mapState({
      color: (state: any) => state.snackbar.color,
      icon: (state: any) => state.snackbar.icon,
      message: (state: any) => state.snackbar.message,
    }),
  },
})
</script>
