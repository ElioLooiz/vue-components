import { debounce } from 'lodash-es'

export default function () {
  this.workApi()

  this.$nextTick(() => {
    this.onContainerResized()
  })

  this._onContainerResized = debounce(this.onContainerResized, 333)
  if (ResizeObserver) {
    this.resizeObserver = new ResizeObserver(this._onContainerResized)
    this.resizeObserver.observe(this.$parent.$el)
  } else {
    this.$parent.$el.addEventListener('resize', this._onContainerResized)
  }

  this._unwatchScroll = this.$watch('scroll', (scroll) => {
    this.$refs.virtualTable.dataset.scroll = this.visibleHorizontalScroll && scroll || ''
  })
  this._unwatchVisibleHorizontalScroll = this.$watch('visibleHorizontalScroll', (visibleHorizontalScroll) => {
    this.$refs.virtualTable.dataset.scroll = visibleHorizontalScroll && this.scroll || ''
  })
}
