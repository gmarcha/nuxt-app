import Vue from 'vue'

Vue.filter('capitalize', (value: string[]) => {
  if (!value) return ''
  for (let i = 0; i < value.length; i++) {
    value[i] = value[i].toString()
    value[i] =
      value[i].charAt(0).toUpperCase() + value[i].slice(1).toLowerCase()
  }
  return value
})
