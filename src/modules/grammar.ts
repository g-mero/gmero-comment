import { HtmlUtil } from './utils'

export function convertIt(content: string) {
  // 匹配转换<link or email>
  function transLinkEmail(str: string) {
    const reg = /<(.+?)>/gm
    if (str.search(reg) === -1) return false

    const urlreg = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/
    const emailreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

    const handleLink = (match: string /* 匹配到的字符串 */, p1: string) => {
      if (p1.search(urlreg) !== -1) return `<a href="${p1}" target="_blank" rel="noopener noreferrer">${p1}</a>`
      if (p1.search(emailreg) !== -1) return `<a href="mailto:${p1}" target="_blank" rel="noopener noreferrer">${p1}</a>`
      return match
    }

    return str.replace(reg, handleLink)
  }

  // 匹配转换 [text](link)
  function transLinks(str: string) {
    const reg = /\[([^ ].+?)\]\((.+?)\)/gm
    if (str.search(reg) === -1) return false

    const urlreg = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/

    const handleLink = (match: string /* 匹配到的字符串 */, p1: string, p2: string) => {
      if (p2.search(urlreg) === -1) return match
      return `<a href="${p2}" target="_blank" rel="noopener noreferrer">${p1}</a>`
    }

    return str.replace(reg, handleLink)
  }

  let output = content
  // 对内容进行安全编码
  output = HtmlUtil.htmlEncode(output)

  output = transLinks(output) || output

  output = transLinkEmail(output) || output

  return output
}
