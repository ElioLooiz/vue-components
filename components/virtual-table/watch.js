export default {
  apiMeta: {
    deep: true,
    handler () {
      this.parseColumns()
      this.workApi()
    }
  },
  scrollPosition: {
    deep: true,
    immediate: true,
    handler (value) {
      this.onScrolling(value.percentX)
    }
  }
}
