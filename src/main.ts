/* eslint-disable no-console */
import tippy from 'tippy.js'
import cmtTextarea, { setAvatar, setAvatarBtn } from './modules/cmt-textarea'
import cmtShowcase, { testcomments } from './modules/comments'

import styles from './index.module.scss'

export default function gcomment(config: {
  elid?: string // 可选，elementid
  onPostBtn: (this: GlobalEventHandlers, ev: MouseEvent) => void // 发送评论按钮
  onDeleteBtn?: (commentId: number) => void // 删除评论
  onUpdateConfirmBtn?: (commentId: number, content: string) => void // 更新评论
  onReplyPostBtn?: (commentId: number, content: string) => void // 回复评论
  onLikeBtn?: (commentId: number, bool: boolean) => void // 点赞评论
}) {
  // 配置项初始化处理
  const errorMsgInitFail = 'error: 关键项没有设置 comment 初始化失败'
  if (config === undefined || config.onPostBtn === undefined) {
    console.log(errorMsgInitFail)
    return undefined
  }

  const $commentArea = document.getElementById(config.elid || 'gcomment')
  if (!$commentArea) {
    console.log('没有找到element')
    return undefined
  }
  $commentArea.classList.add(styles['gcomment-main'])
  // 处理结束

  // 生成评论编辑区域
  $commentArea.append(cmtTextarea(config.onPostBtn))

  // 评论展示区域
  $commentArea.append(cmtShowcase(testcomments, 100))

  tippy('[data-tippy-content]', {
    offset: [0, 6],
    placement: 'auto',
  })

  // 返回一个包含了基本方法的对象
  return {
    element: $commentArea,
    setAvatar,
    setAvatarBtn,
    setComments: cmtShowcase,
  }
}
