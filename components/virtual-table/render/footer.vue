<script>
import { get } from '@/mixins/native'
import types from './types'

export default {
  props: {
    item: Object,
    hoveredFooter: String
  },
  render (h) {
    const column = this.item.column()
    const renderTypeFooter = get(types, `[${column.type}].renderFooter`)

    const renderFooter = () => column.$scopedSlots.summary
      ? column.$scopedSlots.summary(this.item)
      : column.$slots.summary

    const footer = renderTypeFooter
      ? renderTypeFooter(h, { column, summaryData: this.item.summaryData })
      : renderFooter(this.item) || column.summaryTitle

    const onFooterOver = () => {
      this.$emit('update:hovered-footer', this.item.colName)
    }

    return h('div', {
      class: [
        get(types, `[${column.type}].headerAlign`),
        {
          bordered: this.item.bordered && !this.item.isLastColumn,
          hovered: this.hoveredFooter === this.item.colName,
          'virtual-table__render-footer': true
        }
      ],
      on: {
        mouseover: onFooterOver
      }
    }, [
      footer
    ])
  }
}
</script>
