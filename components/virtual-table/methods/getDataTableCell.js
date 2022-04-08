import { upperFirst } from 'lodash-es'

const ROW_HEIGHT = 36

export default function (side) {
  let _columns = side === 'left'
    ? this.columns.filter(c => [true, 'left'].includes(c.componentInstance.fixed))
    : side === 'right'
      ? this.columns.filter(c => ['right'].includes(c.componentInstance.fixed))
      : this.columns.filter(c => !c.componentInstance.fixed)

  if (this.isMobile) _columns = this.columns
  const length = this[`tableColumns${upperFirst(side)}`]
  let totalWidth = 0

  const data = this.items.reduce((rows, row, rowIndex) => {
    totalWidth = 0
    const _rows = Array.from({ length }, (_, colIndex) => {
      totalWidth += _columns[colIndex].componentInstance.width
      return {
        column: () => _columns[colIndex].componentInstance,
        position: {
          width: _columns[colIndex].componentInstance.width,
          height: ROW_HEIGHT,
          x: totalWidth - _columns[colIndex].componentInstance.width,
          y: rowIndex * ROW_HEIGHT
        },
        row,
        rowIndex,
        isLastColumn: !((colIndex + 1) % length),
        isLastRow: rowIndex === this.items.length - 1,
        colName: _columns[colIndex].componentInstance.prop,
        striped: !!(rowIndex % 2),
        bordered: _columns[colIndex].componentInstance.bordered
      }
    })
    return [ ...rows, ..._rows ]
  }, [])
  if (totalWidth < this[`width${upperFirst(side)}Table`]) {
    data.forEach((item, colIndex) => {
      item.position.width = this[`width${upperFirst(side)}Table`] / length
      item.position.x = (colIndex % length) * (this[`width${upperFirst(side)}Table`] / length)
    })
  }

  return data
}
