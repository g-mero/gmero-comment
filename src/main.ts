import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import './index.scss'
import cmt_textarea, { setAvatar, setAvatarBtn } from './modules/cmt-textarea'
import { convertIt } from './modules/grammar'

export default function ssss(config: {
  elid?: string //可选，elementid
  onPostBtn: (this: GlobalEventHandlers, ev: MouseEvent) => any // 发送评论按钮
  onAvatarBtn: (this: GlobalEventHandlers, ev: MouseEvent) => any // 点击头像
  onDeleteBtn?: (this: GlobalEventHandlers, ev: MouseEvent) => any // 删除评论
  onUpdateBtn?: (this: GlobalEventHandlers, ev: MouseEvent) => any // 更新评论
}) {
  // 配置项初始化处理
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
  // 处理结束

  // 生成评论编辑区域
  $comment_area.append(cmt_textarea(config.onAvatarBtn, config.onPostBtn))

  tippy('[data-tippy-content]', {
    offset: [0, 6],
    placement: 'auto',
  })

  return {
    element: $comment_area,
    setAavatar: setAvatar,
    setAvatarBtn: setAvatarBtn,
  }
}
