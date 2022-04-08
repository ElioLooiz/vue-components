<script>
import { get } from '@/mixins/native'
import types from './types'

export default {
  props: {
    item: Object,
    hoveredHeader: String
  },
  render (h) {
    const column = this.item.column()
    const renderTypeHeader = get(types, `[${column.type}].renderHeader`)

    const renderHeader = () => column.$scopedSlots.label
      ? column.$scopedSlots.label(this.item)
      : column.$slots.label

    const header = renderTypeHeader
      ? renderTypeHeader(h, { column, header: this })
      : renderHeader(this.item) || column.label

    const onHeaderOver = () => {
      this.$emit('update:hovered-header', this.item.colName)
    }

    return h('div', {
      class: [
        get(types, `[${column.type}].headerAlign`),
        {
          bordered: this.item.bordered && !this.item.isLastColumn,
          hovered: this.hoveredHeader === this.item.colName,
          'virtual-table__render-header': true
        }
      ],
      on: {
        mouseover: onHeaderOver
      }
    }, [
      header
    ])
  }
}
</script>
