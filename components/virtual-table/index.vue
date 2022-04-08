<template lang="pug">
include ./template.pug
</template>

<script>
import Clickoutside from '@/mixins/clickoutside'
import virtualList from '@/virtual-list'
import beforeDestroy from './beforeDestroy'
import computed from './computed'
import data from './data'
import methods from './methods'
import mounted from './mounted'
import props from './props'
import renderCell from './render/cell'
import renderHeader from './render/header'
import renderFooter from './render/footer'
import watch from './watch'

export default {
  name: 'VirtualTable',
  componentName: 'VirtualTable',
  components: {
    renderCell,
    renderHeader,
    renderFooter,
    virtualList
  },
  directives: {
    Clickoutside
  },
  props,
  data,
  computed,
  watch,
  mounted,
  beforeDestroy,
  methods
}
</script>

<style lang="sass">
@import './style'
</style>
