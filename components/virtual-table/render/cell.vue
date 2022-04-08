<script>
import { get } from '@/mixins/native'
import types from './types'

export default {
  props: {
    hoveredColumn: String,
    hoveredRow: Number,
    item: Object,
    lastActiveRow: Number,
    lastActiveColumn: String,
    selectedRow: Number,
    selectedColumn: String
  },
  render (h) {
    const column = this.item.column()
    const renderTypeCell = get(types, `[${column.type}].renderCell`)

    const renderCell = () => column.$scopedSlots.default
      ? column.$scopedSlots.default(this.item)
      : column.$slots.default

    const cell = renderTypeCell
      ? renderTypeCell(h, { column, row: this.item.row })
      : renderCell(this.item)

    const onRowClick = () => {
      this.$emit('update:selected-row', this.item.rowIndex)
      this.$emit('update:selected-column', this.item.colName)
    }

    const onRowOver = () => {
      this.$emit('update:hovered-row', this.item.rowIndex)
      this.$emit('update:hovered-column', this.item.colName)
    }

    return h('div', {
      class: [
        get(types, `[${column.type}].headerAlign`),
        {
          bordered: this.item.bordered && !this.item.isLastColumn,
          hovered: this.hoveredRow === this.item.rowIndex || this.hoveredColumn === this.item.colName,
          'last-active': this.lastActiveRow === this.item.rowIndex || this.lastActiveColumn === this.item.colName,
          'last-row': this.item.isLastRow,
          striped: this.item.striped,
          selected: this.selectedRow === this.item.rowIndex || this.selectedColumn === this.item.colName,
          'virtual-table__render-cell': true
        }
      ],
      on: {
        click: onRowClick,
        mouseover: onRowOver
      }
    }, [
      cell
    ])
  }
}
</script>
