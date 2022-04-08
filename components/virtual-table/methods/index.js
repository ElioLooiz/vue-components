import { get } from '@/mixins/native'
import { isPlain } from '@/mixins/typeof'

const requireAll = context => context.keys().map(context)
const requireApi = require.context('.', true, /\.\/([^/]+\/index\.(js|vue)|((?!index)[^/]+\.(js|vue)))/)
const MODULES = requireAll(requireApi)
const NAMES = requireApi.keys().map(path => path.replace(/.\/(.+?)(\/.+|\.(js|vue))/, '$1'))
const HOMIES = NAMES.reduce((acc, name, index) => {
  const imported = get(MODULES, `[${index}].default`)
  const mixin = isPlain(imported) ? imported : { [name]: imported }
  return Object.assign(acc, mixin)
}, {})

export default {
  ...HOMIES
}
