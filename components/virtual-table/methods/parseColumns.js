import { sum } from 'lodash-es'
import { length } from '@/mixins/native'

export default function () {
  this.columns = this.$scopedSlots.default().filter(({ componentInstance }) => {
    const { componentName, name } = componentInstance.$options
    return [componentName, name].includes('VirtualTableColumn')
  })

  if (this.isMobile) {
    // if mobile-mode --> all items to middle table
    this.tableColumnsRight = this.widthRightTable = this.tableColumnsLeft = this.widthLeftTable = 0
    this.tableColumnsMiddle = length(this.columns)
    this.widthMiddleTable = this.width - this.widthLeftTable - this.widthRightTable
    return
  }

  const columns = this.columns.map(({ componentInstance }) => componentInstance)

  const leftColumns = columns.filter(c => [true, 'left'].includes(c.fixed))
  this.tableColumnsLeft = length(leftColumns)
  if (this.tableColumnsLeft) {
    this.widthLeftTable = sum(leftColumns.map(c => parseFloat(c.width)))
  }

  const rightColumns = columns.filter(c => ['right'].includes(c.fixed))
  this.tableColumnsRight = length(rightColumns)
  if (this.tableColumnsRight) {
    this.widthRightTable = sum(rightColumns.map(c => parseFloat(c.width)))
  }

  const middleColumns = columns.filter(c => !c.fixed)
  this.tableColumnsMiddle = length(middleColumns)
  if (this.tableColumnsMiddle) {
    this.widthMiddleTable = this.width - this.widthLeftTable - this.widthRightTable
  }
}
