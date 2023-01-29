export function convertIt(content: string) {
  // 匹配转换<link or email>
  function trans_link_email(content: string) {
    const reg = /<(.+?)>/gm
    if (content.search(reg) == -1) return false

    const urlreg = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-.\/?%&=]*)?$/
    const emailreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

    const handleLink = (
      match: string /* 匹配到的字符串 */,
      p1: string,
      offset: number,
      string: string /* 原始字符串 */,
    ) => {
      if (p1.search(urlreg) != -1)
        return `<a href="${p1}" target="_blank" rel="noopener noreferrer">${p1}</a>`
      if (p1.search(emailreg) != -1)
        return `<a href="mailto:${p1}" target="_blank" rel="noopener noreferrer">${p1}</a>`
      return match
    }

    return content.replace(reg, handleLink)
  }

  //匹配转换 [text](link)
  function trans_links(content: string) {
    const reg = /\[([^ ].+?)\]\((.+?)\)/gm
    if (content.search(reg) == -1) return false

    const urlreg = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-.\/?%&=]*)?$/

    const handleLink = (
      match: string /* 匹配到的字符串 */,
      p1: string,
      p2: string,
      offset: number,
      string: string /* 原始字符串 */,
    ) => {
      if (p2.search(urlreg) == -1) return match
      return `<a href="${p2}" target="_blank" rel="noopener noreferrer">${p1}</a>`
    }

    return content.replace(reg, handleLink)
  }

  content = trans_links(content) || content
  console.log(content)

  content = trans_link_email(content) || content

  return content
}
