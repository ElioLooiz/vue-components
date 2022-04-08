export default {
  api: String,
  apiFilter: Object,
  apiGet: Object,
  apiMethod: { type: String, default: 'get' },
  apiModificator: Function,
  bothSelection: Boolean,
  showSummary: { type: Boolean, default: true }
}
