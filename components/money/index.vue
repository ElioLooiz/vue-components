<template lang="pug">
span.money__container(
  :class="{ 'color-positive': amountColor() && isColored, 'color-negative': !amountColor() && isColored }")
  span {{ formattedValue.sign }}
  span {{ formattedValue.integer }}
  span(:class="{ money__disabled: !singleColor }")
    span(v-if="!!formattedValue.decimal") {{ delimiter + formattedValue.decimal }}
    span(v-else) &nbsp;
    span {{ formattedValue.currency }}
</template>

<script>
  import { format } from './utils'
  import { defaultProps, defaultValue } from './defaultSettings'

  export default {
    name: 'ElMoney',
    componentName: 'ElMoney',
    props: {
      colored: Boolean,
      currency: {
        type: String
      },
      decimal: {
        type: String,
        default: defaultProps.decimal
      },
      precision: {
        type: Number,
        default: defaultProps.precision,
        validator: (value) => {
          return value >= 0
        }
      },
      sign: {
        type: String,
        default: defaultProps.sign
      },
      singleColor: {
        type: Boolean,
        default: defaultProps.singleColor
      },
      value: {
        type: [Number, String],
        required: true,
        default: 0
      }
    },
    computed: {
      formattedValue () {
        if (format(this.value, this)) {
          return format(Number(this.value), this)
        } else {
          return defaultValue
        }
      },
      isColored () {
        return !!this.colored && this.value !== 0
      },
      delimiter: () => defaultValue.delimiter
    },
    methods: {
      amountColor () {
        if (this.sign === 'never') {
          if (this.value !== 0 && this.value > 0) {
            return true
          } else if (this.value !== 0) {
            return false
          }
        }
        if (format(this.value, this).sign === '-' && this.colored) {
          return false
        } else if (this.colored) {
          return true
        }
      }
    }
  }
</script>

<style lang="sass">
@import "./styles"
</style>
