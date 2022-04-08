<template lang="pug">
.el-input-phone(:class="rootClass")
  span.el-input-phone__code-cover(
    v-if="isPickerVisible && !disabled"
    :style="codeCoverStyle"
    :title="$t('el.phone.title')"
    @mousedown="handleMousedown"
    @click="handleCodeClick")
  el-input.el-input-phone__inner(
    v-model="currentValue"
    v-bind="inputAttributes"
    v-on="inputListeners"
    ref="input")
  phone-filter(
    v-if="isPickerVisible"
    :size="size"
    :priority-countries="priorityCountries"
    :country-list="countries"
    :disabled="disabled"
    ref="phoneFilter"
    @hide="handlePickerHide"
    @country-change="handleCountryChange")
</template>

<script>
import Emitter from '@/mixins/emitter'
import { exec } from '@/mixins/native'
import { optionsPicker } from './options'
import PhoneFilter from './filter'
import 'flag-icons/sass/flag-icons.scss'
import { debounce } from 'lodash-es'
import parsePhoneNumber from 'libphonenumber-js'

const CLEAN_CODE = /[+]/g
const PADDINGS = {
  mini: 6,
  small: 8,
  normal: 8,
  large: 13
}

const FONT_SIZES = {
  mini: 6,
  small: 7,
  normal: 8,
  large: 10
}

export default {
  name: 'ElPhoneInput',
  componentName: 'ElInput',
  mixins: [Emitter],
  components: {
    PhoneFilter
  },
  props: {
    countries: { // ISO Alpha-2 -- https://www.nationsonline.org/oneworld/country_code_list.htm
      type: Array,
      default: () => []
    },
    disabled: Boolean,
    favorite: String,
    priorityCountries: { // ISO Alpha-2
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'normal'
    },
    value: {}
  },
  data: (vm) => ({
    currentValue: vm.value,
    countryId: null,
    focused: false, // is all component focused
    isPickerActive: false,
    inputFocused: false, // is only phone input focused
    maskedValue: null,
    options: optionsPicker(vm.countries),
    unmaskedValue: null
  }),
  computed: {
    country () {
      return this.countryId && this.options.find(item => item.id === this.countryId)
        || this.favorite && this.options.find(item => item.name === this.favorite)
        || this.options[0]
    },
    codeLength () {
      return this.country?.code.length
    },
    codeCoverStyle () {
      return `width: ${this.country.code.length * FONT_SIZES[this.size] + PADDINGS[this.size]}px`
    },
    inputListeners () {
      return {
        ...this.$listeners,
        blur: this.handleBlur,
        focus: this.handleFocus,
        input: this.handleInput,
        paste: this.handlePaste
      }
    },
    inputAttributes () {
      return {
        ...this.$attrs,
        blocks: {
          NUM: {
            lazy: true,
            mask: this.country.mask
          }
        },
        disabled: this.disabled,
        lazy: false,
        mask: `{${this.country.code.replaceAll('0', '\\0')}}` + ' NUM',
        overwrite: true,
        unmask: true,
        placeholder: this.$t('el.phone.placeholder'),
        size: this.size
      }
    },
    isPickerVisible () {
      return this.options.length > 1
    },
    maskRef () {
      return this.$refs.input?.$refs.input?.maskRef
    },
    rootClass () {
      const c = []
      c.push('el-input')
      if (this.disabled) c.push('is-disabled')
      if (this.focused) c.push('is-focused')
      if (this.size) c.push(`el-input--${this.size}`)
      return c
    }
  },
  watch: {
    currentValue () {
      this.$nextTick(() => {
        this.maskedValue = this.maskRef?.value
        this.unmaskedValue = this.country.code + this.maskRef?.unmaskedValue
      })
    },
    focused (v) {
      if (!v) this.$emit('blur')
    },
    value (v) {
      this.setCurrentValue(v)
    }
  },
  created () {
    this.countryCheckDebounced = debounce(this.countryCheck, 300)
  },
  methods: {
    countryCheck (value) {
      const phoneNumber = parsePhoneNumber(value)
      if (!phoneNumber) return

      // country detected && country names are different. current mask guarantees same calling codes
      if (phoneNumber?.country && phoneNumber?.country !== this.country.name) {
        const option = this.options.find(item => item.name === phoneNumber.country)

        if (!option) return // if new country is not provided in current countries (prop)
        this.countryId = option.id
      }
    },
    clear () {
      exec(this.$refs, 'input.clear', {})
      this.dispatch('ModelFormItem', 'fieldReset')
    },
    cleanValue (value) {
      const codes = [this.country.code.replace(CLEAN_CODE, '')]
      if (this.country.trunkPrefix && this.country.trunkPrefix !== '0') codes.push(this.country.trunkPrefix)

      const reg = new RegExp(`${codes.join('|')}`)
      const countryCode = this.country.code

      const oldValueExist =
        this.currentValue.length > countryCode.length &&
        this.currentValue.length < this.country.maxLen
      const newValueLength = value.replace(/[^0-9]+/g, '').length
      const cleanNewValue = value.replace(/[^0-9]+/g, '')
      const selectionLength = window.getSelection().toString().length

      if (oldValueExist && selectionLength === 0) {
        return `${this.currentValue}${cleanNewValue}`.slice(0, this.country.maxLen)
      }

      if (newValueLength < this.country.maxLen - 1) {
        return `${countryCode}${cleanNewValue}`.slice(0, this.country.maxLen)
      }

      return `${countryCode}${cleanNewValue.replace(reg, '')}`.slice(
        0,
        this.country.maxLen
      )
    },
    focus () {
      exec(this.$refs, 'input.focus')
    },
    handlePaste (event) {
      event.preventDefault()
      const paste = (event.clipboardData || window.clipboardData).getData('text')

      this.setCurrentValue(this.cleanValue(paste))
    },
    handleFocus () {
      this.inputFocused = true
      this.focused = true
    },
    handleBlur () {
      this.inputFocused = false
      if (!this.isPickerActive) {
        this.focused = false
      }
    },
    handleCodeClick () {
      exec(this.$refs, 'phoneFilter.show')
    },
    handleInput (value) {
      this.countryCheckDebounced(value)
      if (value.length > this.codeLength) {
        this.$emit('input', value)
        this.$nextTick(() => {
          this.dispatch('ModelFormItem', 'el.form.change', value)
        })
      } else {
        this.$emit('input', '')
      }
    },
    handleCountryChange (v) {
      const phoneNumber = parsePhoneNumber(this.currentValue) || {}
      const newCountry = this.options.find(item => item.id === v)

      // different country codes -> clear
      if (newCountry.code !== this.country.code) {
        this.clear()
      }

      // country codes are the same, but current value is not valid for new country -> clear
      if (newCountry.code === this.country.code && phoneNumber.country && phoneNumber.country !== newCountry.name) {
        this.clear()
      }

      this.countryId = v
      this.$nextTick(this.focus)
    },
    handleMousedown () {
      this.isPickerActive = true
    },
    handlePickerHide () {
      this.isPickerActive = false
      this.$nextTick(() => {
        if (!this.inputFocused) this.focused = false
      })
    },
    setCurrentValue (value = '') {
      this.currentValue = value
    }
  }
}
</script>

<style lang="sass">
.el-input-phone
  height: fit-content
  width: fit-content
  display: inline-flex
  flex-direction: column

.el-input-phone__code-cover
  z-index: 1
  cursor: pointer
  box-sizing: border-box
  height: 100%
  position: absolute
  &:hover
    background-color: rgba($primary, .1)
</style>
