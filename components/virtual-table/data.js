export default () => ({
  hoveredColumn: null,
  columns: [],
  dataLoading: false,
  dataError: null,
  height: 0,
  heightHeader: 40,
  heightFooter: 40,
  hoveredRow: null,
  items: [],
  lastActiveRow: null,
  lastActiveColumn: null,
  leftItems: [],
  leftHeader: [],
  leftFooter: [],
  meta: {},
  middleItems: [],
  middleHeader: [],
  middleFooter: [],
  rightItems: [],
  rightHeader: [],
  rightFooter: [],
  scroll: '',
  scrollPosition: { x: 0, y: 0, percentX: 0 },
  selectedRow: null,
  selectedColumn: null,
  tableColumnsLeft: 0,
  tableColumnsMiddle: 0,
  tableColumnsRight: 0,
  visibleHorizontalScroll: false,
  width: 0,
  widthLeftTable: 0,
  widthMiddleTable: 0,
  widthRightTable: 0
})