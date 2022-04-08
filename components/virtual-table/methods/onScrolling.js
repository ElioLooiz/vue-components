export default function (value) {
  let scroll = 'middle'
  if (value === 0) scroll = 'start'
  else if (value === 1) scroll = 'end'

  this.$nextTick(() => {
    this.scroll = scroll
  })
}
