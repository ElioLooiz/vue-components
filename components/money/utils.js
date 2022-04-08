import { currencyList } from './currency'
import { defaultProps, defaultValue } from './defaultSettings'

export function format (value, props = defaultProps) {
  let strValue = ''

  if (typeof value === 'number') {
    strValue = value.toFixed(fixed(props.precision))
  } else {
    return defaultValue
  }

  const sign = signCorrection(strValue, props.sign)
  strValue = Math.abs(value).toString().split('.')
  const integer = integerCorrection(strValue[0])
  const decimal = decimalCorrection(strValue[1], props)
  const currency = (props.currency === null) ? '' : (currencyList[props.currency] || currencyList.default)
  return {
    sign,
    integer,
    decimal,
    currency
  }
}

function fixed (precision) {
  return Math.max(0, Math.min(precision, 20))
}

function signCorrection (value, signRule) {
    switch (signRule) {
      case 'negative-only':
        return value.indexOf('-') >= 0 ? '-' : ''
      case 'always':
        if (Number(value) > 0) return '+'
        if (Number(value) < 0) return '-'
        return ''
      case 'never':
        return ''
      case 'force-negative':
        if (Number(value) !== 0) return '-'
        return ''
      case 'force-positive':
        if (Number(value) !== 0) return '+'
        return ''
      default: break
  }
}

function decimalCorrection (value, props) {
  if (props.precision <= 0) {
    return null
  }
  if (value) {
    switch (props.decimal) {
      case 'not-zero':
        if (Number(value) === 0) {
          return '0' * props.precision
        }
        return value.slice(0, props.precision)
      case 'always':
        if (value.length < props.precision) {
          return value.slice(0, props.precision) + '0'.repeat(props.precision - value.length)
        }
        return value.slice(0, props.precision)
      case 'never':
        return null
      default: break
    }
  } else if (props.decimal === 'always') {
    return '0'.repeat(props.precision)
  }
  return null
}

function integerCorrection (value) {
  const number = parseFloat(value)
  if (isNaN(number)) return ''

  return number.toLocaleString(undefined)
}
