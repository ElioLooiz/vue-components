export default function () {
  this.parseColumns()
  this.middleHeader = this.getDataTableHeader('middle')
  this.middleItems = this.getDataTableCell('middle')
  this.middleFooter = this.getDataTableFooter('middle')
  if (this.isMobile) return

  this.leftHeader = this.getDataTableHeader('left')
  this.leftItems = this.getDataTableCell('left')
  this.leftFooter = this.getDataTableFooter('left')

  this.rightHeader = this.getDataTableHeader('right')
  this.rightItems = this.getDataTableCell('right')
  this.rightFooter = this.getDataTableFooter('right')
}
