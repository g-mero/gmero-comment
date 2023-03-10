export function wrapByDiv(...el: Element[]) {
  const $wrap = document.createElement('div')
  el.forEach((v) => {
    $wrap.append(v)
  })

  return $wrap
}

export function removeClassDelay(classStr: string, el: Element) {
  setTimeout(() => {
    el.classList.remove(classStr)
  }, 10)
}

/**
 * HTML工具，实现编码解码等功能
 */
export const HtmlUtil = {
  /**
   * 将html安全编码
   * @param html 需要编码的内容
   * @returns 编码后的内容
   */
  htmlEncode(html: string) {
    // 1.首先动态创建一个容器标签元素，如DIV
    const temp = document.createElement('div')
    // 2.然后将要转换的字符串设置为这个元素的innerText
    temp.innerText = html
    // 3.最后返回这个元素的innerHTML
    const output = temp.innerHTML
    return output
  },
  /**
   * 将字符串解码成html
   * @param text 需要解码的字符串
   * @returns 解码后的内容
   */
  htmlDecode(text: string) {
    // 1.首先动态创建一个容器标签元素，如DIV
    const temp = document.createElement('div')
    // 2.然后将要转换的字符串设置为这个元素的innerHTML
    temp.innerHTML = text
    // 3.最后返回这个元素的innerText
    const output = temp.innerText
    return output
  },
}

export function timeAgo(time: string): string {
  const past = new Date(time)
  const now = new Date(Date.now())

  let tmp = now.getFullYear() - past.getFullYear()

  if (tmp > 0) return `${tmp}年前`
  tmp = now.getMonth() - past.getMonth()
  if (tmp > 0) return `${tmp}个月前`
  // fix：getDay是周几，Date才是几日
  tmp = now.getDate() - past.getDate()
  if (tmp > 0) return `${tmp}天前`
  tmp = now.getHours() - past.getHours()
  if (tmp > 0) return `${tmp}小时前`
  tmp = now.getMinutes() - past.getMinutes()
  if (tmp > 0) return `${tmp}分钟前`
  tmp = now.getSeconds() - past.getSeconds()
  if (tmp > 0) return `${tmp}秒前`
  return '刚刚'
}
