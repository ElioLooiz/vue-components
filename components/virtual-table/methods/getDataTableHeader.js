import { upperFirst } from 'lodash-es'

export default function (side) {
  let _columns = side === 'left'
    ? this.columns.filter(c => [true, 'left'].includes(c.componentInstance.fixed))
    : side === 'right'
      ? this.columns.filter(c => ['right'].includes(c.componentInstance.fixed))
      : this.isMobile
        ? this.columns
        : this.columns.filter(c => !c.componentInstance.fixed)

  if (this.isMobile) _columns = this.columns
  let totalWidth = 0
  const length = this[`tableColumns${upperFirst(side)}`]
  const data = Array.from({ length }, (_, colIndex) => {
    totalWidth += _columns[colIndex].componentInstance.width
    return {
      column: () => _columns[colIndex].componentInstance,
      position: {
        width: _columns[colIndex].componentInstance.width,
        height: 40,
        x: totalWidth - _columns[colIndex].componentInstance.width,
        y: 0
      },
      isLastColumn: !((colIndex + 1) % length),
      colName: _columns[colIndex].componentInstance.prop,
      bordered: _columns[colIndex].componentInstance.bordered
    }
  })

  if (totalWidth < this[`width${upperFirst(side)}Table`]) {
    data.forEach((item, colIndex) => {
      item.position.width = this[`width${upperFirst(side)}Table`] / length
      item.position.x = (colIndex % length) * (this[`width${upperFirst(side)}Table`] / length)
    })
  }

  return data
}
