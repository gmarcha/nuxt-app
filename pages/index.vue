<template>
  <div>
    <SnackBar></SnackBar>
    <EventCalendar></EventCalendar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',

  middleware: ['auth', 'tutor'],
})
</script>
