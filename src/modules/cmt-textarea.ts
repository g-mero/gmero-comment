import tippy from 'tippy.js'
import { wrap_by_div } from './utils'

const $textarea = document.createElement('textarea')
$textarea.setAttribute('placeholder', '留下你的评论...')

const $btn_confirm = document.createElement('button')
$btn_confirm.type = 'button'
$btn_confirm.innerText = '确定'
$btn_confirm.setAttribute('data-tippy-content', '点击发送')
$btn_confirm.classList.add('g-comment-btn')

const $avatar = document.createElement('div')
$avatar.classList.add('g-comment-login')
$avatar.setAttribute('data-tippy-content', '使用GITHUB账号登录')
$avatar.innerHTML = `<svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true">
<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
</svg>`

// 免责声明
const $info = document.createElement('div')
$info.style.position = 'relative'
$info.innerHTML = `<span style="opacity: .34;font-size: .65rem;position:relative;top:-3px;cursor:pointer"><svg  width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: -0.06rem;">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
</svg> 免责声明</span>`

export default function (
  onAvatarBtn: (this: GlobalEventHandlers, ev: MouseEvent) => any,
  onPostBtn: (this: GlobalEventHandlers, ev: MouseEvent) => any,
) {
  // 评论编辑工具栏
  const $textarea_tools = wrap_by_div(wrap_by_div($info), $btn_confirm)
  $textarea_tools.classList.add('g-comment-textarea-tools', 'close')

  // textarea_c 评论编辑区域
  const $textarea_c = wrap_by_div($textarea, $textarea_tools)
  $textarea_c.style.width = '100%'

  $textarea_tools.onmousedown = (e) => {
    e.preventDefault()
  }

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
  $btn_confirm.onclick = onPostBtn

  // $avatar 头像区域
  $avatar.onclick = onAvatarBtn



  const co_text = `<span style="font-size:.65rem">本评论组件会获取用户GitHub的基本信息（包括email）以保证评论及回复的有效性，当前版本0.0.1</span>`
  tippy($info, {
    offset: [0, 6],
    placement: 'auto',
    content: co_text,
    allowHTML: true,
    trigger: 'click',
    interactive: true,
  })


  const $top = document.createElement('div')
  $top.style.display = 'flex'
  $top.append(wrap_by_div($avatar))
  $top.append($textarea_c)

  return $top
}

const avatar_login_inner = $avatar.innerHTML
export function setAvatar(html?: string) {
  if (html === void 0) {
    $avatar.innerHTML = avatar_login_inner
    return
  }
  $avatar.innerHTML = html
}

export function setAvatarBtn(
  func?: (this: GlobalEventHandlers, ev: MouseEvent) => any,
) {
  if (func !== void 0) {
    $avatar.onclick = func
    return
  }
  $avatar.onclick = void 0
}
