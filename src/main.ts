/* eslint-disable no-console */
import tippy from 'tippy.js'
import CmtTextarea, { setAvatar, setAvatarBtn } from './modules/cmt-textarea'
import cmtShowcase from './modules/comments'

import styles from './index.module.scss'

export default function gcomment(config: {
  elid?: string // 可选，elementid
  onPostBtn: (this: GlobalEventHandlers, ev: MouseEvent) => void // 发送评论按钮
  onAvatarBtn: (this: GlobalEventHandlers, ev: MouseEvent) => void // 点击头像
  onDeleteBtn?: (comment_id: number) => void // 删除评论
  onUpdateConfirmBtn?: (comment_id: number, content: string) => void // 更新评论
  onReplyPostBtn?: (commrnt_id: number, content: string) => void // 回复评论
  onLikeBtn?: (comment_id: number, bool: boolean) => void // 点赞评论
}): object {
  // 配置项初始化处理
  const errorMsgInitFail = 'error: 关键项没有设置 comment 初始化失败'
  if (config === undefined || config.onPostBtn === undefined || config.onAvatarBtn === undefined) {
    console.log(errorMsgInitFail)
    return {}
  }

  const $commentArea = document.getElementById(config.elid || 'gcomment')
  if (!$commentArea) {
    console.log('没有找到element')
    return {}
  }
  $commentArea.classList.add(styles['gcomment-main'])
  // 处理结束

  // 生成评论编辑区域
  $commentArea.append(CmtTextarea(config.onAvatarBtn, config.onPostBtn))

  // 评论展示区域
  $commentArea.append(cmtShowcase())

  tippy('[data-tippy-content]', {
    offset: [0, 6],
    placement: 'auto',
  })

  // 返回一个包含了基本方法的对象
  return {
    element: $commentArea,
    setAavatar: setAvatar,
    setAvatarBtn,
    setComments: cmtShowcase,
  }
}
