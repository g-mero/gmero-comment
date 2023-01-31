import tippy from 'tippy.js'
import cmt_textarea, { setAvatar, setAvatarBtn } from './modules/cmt-textarea'
import cmt_showcase, { comment_g, testcomments } from './modules/comments'

import styles from './index.module.scss'

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
  $comment_area.classList.add(styles['gcomment-main'])
  // 处理结束

  // 生成评论编辑区域
  $comment_area.append(cmt_textarea(config.onAvatarBtn, config.onPostBtn))

  // 评论展示区域
  $comment_area.append(cmt_showcase())

  tippy('[data-tippy-content]', {
    offset: [0, 6],
    placement: 'auto',
  })

  // 返回一个包含了基本方法的对象
  return {
    element: $comment_area,
    setAavatar: setAvatar,
    setAvatarBtn: setAvatarBtn,
    setComments: cmt_showcase,
  }
}
