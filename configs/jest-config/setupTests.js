;(() => {
  window.ResizeObserver =
    window.ResizeObserver ||
    class {
      disconnect = () => {}
      observe = () => {}
      unobserve = () => {}
    }
})()
