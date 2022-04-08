import types from '@/table/column/types'
import { get } from '@/mixins/native'

export default {
  money: {
    ...types.money,
    renderFooter: (h, { column, summaryData }) => {
      const value = column.summaryProp
        ? get(summaryData, column.summaryProp)
        : get(summaryData, column.property)
      return <el-money value={ value } currency={ null }></el-money>
    }
  }
}
