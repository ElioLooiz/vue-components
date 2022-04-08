import { omit } from 'lodash-es'
import API from 'cmp-api'
import { get } from '@/mixins/native'

export default function () {
  this.dataError = false
  this.dataLoading = true
  new API({
    method: this.apiMethod,
    url: this.api
  }).set({
    body: this.apiMeta
  })
  .exec()
  .then(({ data }) => {
    this.meta = get(data, '_meta', {})

    let apiData = omit(data, ['_meta'])

    if (this.apiModificator) {
      apiData = this.apiModificator(data)
    }

    this.items = apiData
    this.setItemsAndHeader()
  })
  .catch((error) => {
    this.dataError = {
      title: this.$t('http.error.server'),
      description: this.$t(`http.error.E${error.status || 0}`)
    }
  })
  .finally(() => {
    this.dataLoading = false
  })
}
