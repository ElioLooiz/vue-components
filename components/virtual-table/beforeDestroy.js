export default function () {
  if (ResizeObserver) {
    this.resizeObserver.disconnect()
  } else {
    this.$parent.$el.removeEventListener('resize', this._onContainerResized)
  }

  if (this._unwatchScroll) {
    this._unwatchScroll()
    this._unwatchScroll = undefined
  }
  if (this._unwatchVisibleHorizontalScroll) {
    this._unwatchVisibleHorizontalScroll()
    this._unwatchVisibleHorizontalScroll = undefined
  }
}
