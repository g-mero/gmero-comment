import tippy from 'tippy.js'
import { removeClassDelay, wrapByDiv } from './utils'

import styles from '../index.module.scss'

const githubSvgHtmlStr = `<svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true">
<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
</svg>`
const avatarDefaultInner = githubSvgHtmlStr

/**
 * 生成一个评论文本编辑框
 * @param onPostBtn 点击确认按钮事件
 * @param avatarHtmlDefault 默认头像
 * @param defaultTippy 默认提示信息
 * @returns object
 */
export default function cmtTextarea(
  onPostBtn: (content: string) => void,
  avatarHtmlDefault = avatarDefaultInner,
  defaultTippy = '',
  isReply = false
) {
  const $textarea = document.createElement('textarea')
  $textarea.setAttribute('placeholder', '留下你的评论...')

  const $btnConfirm = document.createElement('button')
  $btnConfirm.type = 'button'
  $btnConfirm.innerText = '确定'
  $btnConfirm.classList.add(styles['g-comment-btn'])
  // 点击确认按钮
  $btnConfirm.onclick = () => {
    onPostBtn($textarea.value)
  }

  function disable(opt: boolean) {
    $textarea.disabled = opt
    $btnConfirm.disabled = opt
  }

  // 回复框
  if (isReply) {
    const $tmp = wrapByDiv($textarea, $btnConfirm)
    $tmp.classList.add(styles['reply-textarea'])
    return {
      element: $tmp,
      setAvatar: () => {
        return 0
      },
      setAvatarBtn: () => {
        return 0
      },
      disable,
    }
  }

  // 评论编辑工具栏
  // 免责声明
  const $info = document.createElement('div')
  $info.style.position = 'relative'
  $info.innerHTML = `<span style="opacity: .34;font-size: .65rem;position:relative;top:-3px;cursor:pointer"><svg  width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: -0.06rem;">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
  </svg> 免责声明</span>`
  const $textareaTools = wrapByDiv(wrapByDiv($info), $btnConfirm)
  $textareaTools.classList.add(styles['g-comment-textarea-tools'], styles.close)

  $textareaTools.onmousedown = (e) => {
    e.preventDefault()
  }

  $textarea.onfocus = () => {
    $textarea.setAttribute('placeholder', '支持部分MD语法(如 链接,邮箱等),不支持html标签...')
    $textareaTools.classList.remove(styles.close)
  }
  $textarea.onblur = () => {
    $textarea.setAttribute('placeholder', '留下你的评论...')

    if ($textarea.value === '') {
      $textareaTools.classList.add(styles.close)
    }
  }

  const $avatar = document.createElement('div')
  $avatar.classList.add(styles['g-comment-login'])

  const avatarTippy = tippy($avatar, {
    content: 'hello tippy',
    offset: [0, 6],
    placement: 'auto',
  })

  /**
   * 设置Avatar区域内容
   * @param html html代码 为空则显示默认内容
   * @param tippyContent 提示内容 为空则不提示
   * @returns void
   */
  function setAvatar(html = avatarDefaultInner, tippyContent = '') {
    $avatar.innerHTML = html || avatarDefaultInner
    if (tippyContent === '' && avatarTippy.state.isEnabled) avatarTippy.disable()
    else if (tippyContent !== '' && !avatarTippy.state.isEnabled) avatarTippy.enable()
    avatarTippy.setContent(tippyContent)
  }

  function setAvatarBtn(func?: (this: GlobalEventHandlers, ev: MouseEvent) => void) {
    if (func !== undefined) {
      $avatar.onclick = func
      return
    }
    $avatar.onclick = null
  }

  /* 头像区域处理 */
  // 设置头像默认内容
  $avatar.innerHTML = avatarHtmlDefault || avatarDefaultInner
  // 设置头像提示信息
  if (defaultTippy !== '') avatarTippy.setContent(defaultTippy)
  else avatarTippy.disable()
  /* 头像区域处理end */

  // textarea_c 评论编辑区域
  const $textareaEdit = wrapByDiv($textarea, $textareaTools)
  $textareaEdit.style.width = '100%'

  const coText = `<span style="font-size:.65rem">本评论组件会获取用户GitHub的基本信息（包括email）以保证评论及回复的有效性，当前版本0.0.1</span>`
  tippy($info, {
    offset: [0, 6],
    placement: 'auto',
    content: coText,
    allowHTML: true,
    trigger: 'click',
    interactive: true,
  })

  const $top = document.createElement('div')
  $top.style.display = 'flex'
  $top.append(wrapByDiv($avatar))
  $top.append($textareaEdit)

  const outElement = $top

  return {
    element: outElement,
    setAvatar,
    setAvatarBtn,
    disable,
  }
}

export function replyTextarea() {
  const $res = cmtTextarea(
    () => {
      return 0
    },
    '',
    '',
    true
  ).element
  $res.classList.add(styles.close)
  const $textarea = $res.querySelector('textarea') as HTMLTextAreaElement
  const $btnConfirm = $res.querySelector('button') as HTMLButtonElement
  function setPlaceholder(str: string) {
    $textarea.setAttribute('placeholder', str)
  }
  function setPostBtn(onPostBtn: (this: GlobalEventHandlers, ev: MouseEvent) => void) {
    $btnConfirm.onclick = onPostBtn
  }
  function hide() {
    $res.classList.add(styles.close)
  }
  function show() {
    removeClassDelay(styles.close, $res)
  }
  function getValue() {
    return $textarea.value
  }
  function clear() {
    $textarea.value = ''
  }
  return {
    element: $res,
    getValue,
    setPlaceholder,
    setPostBtn,
    hide,
    show,
    clear,
  }
}
