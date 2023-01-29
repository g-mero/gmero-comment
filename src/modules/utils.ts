export function wrap_by_div(...el: Element[]) {
    const $wrap = document.createElement('div')
    el.forEach((v) => {
      $wrap.append(v)
    })
  
    return $wrap
  }