import { noop, isEmpty } from 'lodash-es'
import { errorEmitter, errorParams } from 'view/error/404'
import deepmerge from 'deepmerge'

const _options = { dataName: 'form', returnParams: {}, checkRevision: false, routesAdd: [] }

/**
 * 
 * @param {Function} getData -- api get data func
 * @param {Function} setData -- component set data func
 * @param {Object} params -- additional params to request
 * @param {Object} options -- manage mixin work options
 */
export default function ({ getData = noop, setData = noop, params = {}, options = _options }) {
  options = deepmerge(_options, options)

  return {
    beforeRouteEnter (to, from, next) {
      let modeParams = params
      /**
      * special allowed routes
      */
      if (options.routesAdd.includes(to.name)) return next()
      if (to.name === `${from.name}-return`) { modeParams = options.returnParams }

      /**
      * adding revision to query if needed. Disabling server response notification
      */
      if (options.checkRevision) modeParams = { revision: to.params.revisionNum }
      modeParams = { noNotification: true, ...modeParams }

      getData(to.params.id, ...modeParams, to).then(data => {
        next(vm => vm::setData(data, to))
      }).catch(error => {
        next(errorEmitter.emit('setError', errorParams(error, from)))
      })
    },

    beforeRouteUpdate (to, from, next) {
      let modeParams = params
      /**
      * special allowed routes
      */
      if (options.routesAdd.includes(to.name)) return next()
      if (to.name === `${from.name}-return`) { modeParams = options.returnParams }

      /**
      * adding revision to query if needed. Disabling server response notification
      */
      if (options.checkRevision) modeParams = { revision: to.params.revisionNum }
      modeParams = { noNotification: true, ...modeParams }

      if (((to.params.id && parseInt(to.params.id)) !== (from.params.id && parseInt(from.params.id)))
        || isEmpty(this[options.dataName])) {
        getData(to.params.id, ...modeParams, to).then(data => {
          this::setData(data, to)
          next()
        }).catch(error => {
          next(errorEmitter.emit('setError', errorParams(error, from)))
        })
      } else next()
    }
  }
}
