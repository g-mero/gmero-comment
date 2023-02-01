export function wrapByDiv(...el: Element[]) {
  const $wrap = document.createElement('div')
  el.forEach((v) => {
    $wrap.append(v)
  })

  return $wrap
}
