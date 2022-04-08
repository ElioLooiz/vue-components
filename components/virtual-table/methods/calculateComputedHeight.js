export default function () {
  this.height = this.$parent.$el.getBoundingClientRect().height
    - this.$refs.toolbar.$el.getBoundingClientRect().height
}
