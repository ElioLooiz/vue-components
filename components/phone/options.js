/**
 * based on libphonenumber-js
 * https://github.com/catamphetamine/libphonenumber-js
 */

import { pick } from 'lodash-es'
import { getExampleNumber } from 'libphonenumber-js'
import EXAMPLES from 'libphonenumber-js/examples.mobile.json'

/**
 * if options array is empty => return all countries exist in libphonenumber EXAMPLES config
 */
export const optionsPicker = (options) => {
  if (!options.length) return Object.values(OPTIONS)

  return Object.values(pick(OPTIONS, options))
}

const OPTIONS = Object.keys(EXAMPLES).reduce((acc, name, id) => {
  const number = getExampleNumber((name), EXAMPLES)
  const mask = number.formatInternational()
        .slice(number.countryCallingCode.length + 2) // +2 to trim after code
        .replaceAll(/\d/gm, '0')

  const result = {
    country: name.toLowerCase(),
    code: '+' + number.countryCallingCode,
    id: id + 1,
    name,
    mask,
    maxLen: number.number.length,
    numLen: number.nationalNumber.length
  }

  /**
   * Including trunk prefix to the result object to provide better on-paste event number parsing in component
   *
   * Some countries has specific internal trunk prefix, like:
   * RU: 8,
   * HG: 06,
   * etc. by the link https://en.wikipedia.org/wiki/Trunk_prefix
   *
   * number.metadata.countries[name][5] - trunk prefix.
   */
  if (number.metadata.countries[name][5] !== undefined) {
    result.trunkPrefix = number.metadata.countries[name][5]
  }
  Object.assign(acc, { [name]: result })

  return acc
}, {})

export default OPTIONS
