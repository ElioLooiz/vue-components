import { pickBy } from 'lodash-es'
import { get, length } from '@/mixins/native'

export default {
  apiMeta () {
    const params = {}
    // extra get params
    if (this.apiGet && this.$isObject(this.apiGet)) {
      Object.keys(this.apiGet).forEach(p => { params[p] = this.apiGet[p] })
    }

    // filters
    let filters
    if (this.apiFilter && length(this.apiFilter)) filters = this.apiFilter
    if (filters) {
      filters = pickBy(filters, f => f !== null)
      if (length(filters)) params._filter = filters
    }

    return params
  },
  bodyHeight () {
    return this.height - this.heightHeader
  },
  cellAttributes () {
    return {
      selectedRow: this.selectedRow,
      selectedColumn: this.selectedColumn,
      hoveredRow: this.hoveredRow,
      hoveredColumn: this.hoveredColumn,
      lastActiveRow: this.lastActiveRow,
      lastActiveColumn: this.lastActiveColumn
    }
  },
  cellListeners () {
    return {
      'update:selected-row': (e) => this.selectedRow = e,
      'update:hovered-row': (e) => this.hoveredRow = e,
      'update:hovered-column': (e) => this.hoveredColumn = e,
      'update:selected-column': this.handleColumnSelection
    }
  },
  isMobile () {
    return this.$adaptive.is.mobile
  },
  _showSummary: ({ showSummary, meta, dataError }) => showSummary && meta.total && !dataError,
  summaryData: ({ meta }) => get(meta, 'total', {})
}
