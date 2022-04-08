let elem = {}

const onScrolling = function (e) {
  const {
    clientHeight: height,
    clientWidth: width,
    scrollHeight,
    scrollWidth,
    scrollTop,
    scrollLeft
  } = elem
  const { deltaY = 0, deltaX = 0 } = e

  // detecting scroll type (horizontal or vertical)
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    // deltaY > deltaX --> vertical scroll
    if ((deltaY >= 0 && (scrollHeight - scrollTop) === height) ||
      (deltaY <= 0 && scrollTop === 0)) {
      e.preventDefault()
    }
  } else {
    // deltaX > deltaY --> horizontal scroll
    if ((deltaX >= 0 && (scrollWidth - scrollLeft) === width) ||
      (deltaX <= 0 && scrollLeft === 0)) {
      e.preventDefault()
    }
  }
}

export default {
  bind (el, binding) {
    elem = el
    if (binding.value !== false) {
      elem.addEventListener('wheel', onScrolling)
    }
  },
  update (el, binding) {
    if (binding.value !== false) {
      elem.addEventListener('wheel', onScrolling)
    } else {
      elem.removeEventListener('wheel', onScrolling)
    }
  },
  unbind (el, binding) {
    elem.removeEventListener('wheel', onScrolling)
  }
}
