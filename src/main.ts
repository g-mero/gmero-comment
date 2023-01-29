import axios from 'axios'
import {
  $avatar,
  $btn_confirm,
  $info,
  $textarea,
  wrap_by_div,
} from './modules/comment'
import tippy from 'tippy.js'

import 'tippy.js/dist/tippy.css'
import './index.scss'
import { convertIt } from './modules/grammar'

export default function ssss(config: {
  elid?: string //可选，elementid
  onPostBtn: (this: GlobalEventHandlers, ev: MouseEvent) => any // 发送评论按钮
  onAvatarBtn: (this: GlobalEventHandlers, ev: MouseEvent) => any // 点击头像
  onDeleteBtn?: (this: GlobalEventHandlers, ev: MouseEvent) => any // 删除评论
  onUpdateBtn?: (this: GlobalEventHandlers, ev: MouseEvent) => any // 更新评论
}) {
  const _ERRMSG_INIT_FAIL_ = 'error: 关键项没有设置 comment 初始化失败'
  if (config === void 0) {
    console.log(_ERRMSG_INIT_FAIL_)
    return
  }
  config.elid = config.elid || 'gcomment'
  config.onPostBtn = config.onPostBtn || void 0
  config.onAvatarBtn = config.onAvatarBtn || void 0

  const $comment_area = document.getElementById(config.elid)
  if (!$comment_area) {
    console.log('没有找到element')
    return
  }

  const $top = document.createElement('div')
  $top.style.display = 'flex'

  // 评论编辑工具栏
  const $textarea_tools = wrap_by_div(wrap_by_div($info), $btn_confirm)
  $textarea_tools.classList.add('g-comment-textarea-tools', 'close')

  // textarea_c 评论编辑区域
  const $textarea_c = wrap_by_div($textarea, $textarea_tools)
  $textarea_c.style.width = '100%'
  $top.append(wrap_by_div($avatar))
  $top.append($textarea_c)

  $comment_area.append($top)

  $textarea.onfocus = () => {
    $textarea.setAttribute(
      'placeholder',
      '支持部分MD语法(如 链接,邮箱等),不支持html标签...',
    )
    $textarea_tools.classList.remove('close')
  }
  $textarea.onblur = () => {
    $textarea.setAttribute('placeholder', '留下你的评论...')

    if ($textarea.value == '') {
      $textarea_tools.classList.add('close')
    }
  }

  // 点击确认按钮
  $btn_confirm.onclick = config.onPostBtn

  // $avatar 头像区域
  $avatar.onclick = config.onAvatarBtn

  tippy('[data-tippy-content]', {
    offset: [0, 6],
    placement: 'auto',
  })

  const co_text = `<span style="font-size:.65rem">本评论组件会获取用户GitHub的基本信息（包括email）以保证评论及回复的有效性，当前版本0.0.1</span>`
  tippy($info, {
    offset: [0, 6],
    placement: 'auto',
    content: co_text,
    allowHTML: true,
    trigger: 'click',
    interactive: true,
  })

  const avatar_login_inner = $avatar.innerHTML
  function setAvatar(html?: string) {
    if (html === void 0) {
      $avatar.innerHTML = avatar_login_inner
      return
    }
    $avatar.innerHTML = html
  }

  function setAvatarBtn(
    func?: (this: GlobalEventHandlers, ev: MouseEvent) => any,
  ) {
    if (func !== void 0) {
      $avatar.onclick = func
      return
    }
    $avatar.onclick = void 0
  }

  return {
    element: $comment_area,
    setAavatar: setAvatar,
    setAvatarBtn: setAvatarBtn,

  }
}
