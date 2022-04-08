<template lang="pug">
.phone-filter.width-full(
  v-show="showPopper"
  :style="topShift"
  ref="phoneFilter")
  el-combobox.width-full(
    v-clickoutside.down="hide"
    :body="false"
    clearable
    :disabled="disabled"
    filterable
    :filter-method="filterMethod"
    icon=""
    no-query-sort
    :options="filteredOptions"
    :placeholder="$t('el.phone.filterPlaceholder')"
    ref="picker"
    :size="size"
    @input="handleChange")
    .phone-filter__option(slot="option" slot-scope="{ data }" :title="nameTranslator(data.name)")
      i(:class="`fi fi-${data.country}`")
      span {{ nameTranslator(data.name) }}
      span {{ data.code }}
</template>

<script>
import Clickoutside from '@/mixins/clickoutside'
import { optionsPicker } from './options'
import Popper from '@/mixins/vue-popper'

export default {
  mixins: [Popper],
  directives: { Clickoutside },
  props: {
    countryList: {
      type: Array,
      default: () => ['RU']
    },
    disabled: Boolean,
    priorityCountries: {
      type: Array,
      default: () => []
    },
    size: String
  },
  data: () => ({
    filteredOptions: [],
    options: [],
    topShift: 0
  }),
  computed: {
    translatorInstance () {
      return new Intl.DisplayNames([this.$i18n.locale.substring(0, 2)], { type: 'region' })
    }
  },
  watch: {
    '$i18n.locale' () {
      this.options = this.getOptionsAlphabet()
      this.filterMethod() // force redraw options in c-box
    }
  },
  mounted () {
    this.options = this.getOptionsAlphabet()
    this.popperElm = this.$refs.phoneFilter
  },
  methods: {
    filterMethod (query = '') {
      const options = this.options.filter(item => (item.code.includes(query) || this.nameTranslator(item.name).toLowerCase().includes(query)))

      this.filteredOptions = options.sort((a, b) => {
        const includeA = this.priorityCountries.includes(a.name)
        const includeB = this.priorityCountries.includes(b.name)

        if (includeA && !includeB) return -1
        if (!includeA && includeB) return 1

        if (includeA && includeB) {
          if (this.priorityCountries.indexOf(a.name) > this.priorityCountries.indexOf(b.name)) return 1
          else return -1
        }

        return 0
      })
    },
    getOptionsAlphabet () {
      return optionsPicker(this.countryList).sort((a, b) => {
        const nameA = this.nameTranslator(a.name)
        const nameB = this.nameTranslator(b.name)
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })
    },
    nameTranslator (name) {
      return this.translatorInstance.of(name)
    },
    show () {
      this.topShift = `top: ${this.$parent?.$el?.clientHeight}px`
      this.showPopper = true
      this.$nextTick(() => {
        this.$refs.picker.focus()
        this.$refs.picker.open()
      })
    },
    hide (e) {
      if (!this.showPopper) return

      this.$emit('hide', e)
      this.$refs.picker.blur({ close: true }) // force close dropdown poppper
      this.showPopper = false

      this.$nextTick(() => {
        this.$refs.picker.clear()
      })
    },
    handleChange (v) {
      this.$emit('country-change', v)
      this.hide()
    }
  }
}
</script>

<style lang="sass">
.phone-filter
  width: inherit
  position: absolute
  z-index: 1002
  background-color: #fff
  box-sizing: border-box
  box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 4px 6px rgba(0,0,0,.12)
  +border-radius
  border-top-left-radius: 0
  border-top-right-radius: 0

.phone-filter__option
  display: flex
  align-items: center
  justify-content: space-between
  img
    min-width: 20px
  span
    width: 40%
    text-align: right
  span
    &:first-of-type
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      word-break: break-word
      text-align: left
      padding-left: 8px
      width: 50%
</style>
