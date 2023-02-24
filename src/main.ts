/* eslint-disable no-console */
import cmtTextarea from './modules/cmt-textarea'
import cmtShowcase, { commentG, genOneComment } from './modules/comments'

import styles from './index.module.scss'
import { removeClassDelay, wrapByDiv } from './modules/utils'

/**
 * 核心函数，返回一个控制对象
 * @param config 配置对象
 * @returns 一个包含了几个方法的对象
 */
export default function gcomment(config: {
  /**
   * 绑定的Dom的id，默认是gcomment
   */
  elid?: string
  /**
   * 左侧头像区域的默认显示（未登录时候的显示图像）
   */
  defaultAvatarHtml?: string
  /**
   * 左侧头像区域的提示信息
   */
  avatarTippy?: string
  /**
   * 评论确认按钮的触发函数
   * @param content textarea的内容
   * @returns void
   */
  onPostBtn: (content: string) => void // 发送评论按钮
  /**
   * 点击删除按钮的触发函数
   * @param commentID 评论的ID唯一标识
   * @returns void
   */
  onDeleteBtn?: (commentID: number) => void // 删除评论
  /**
   * 点击更新按钮的触发函数
   * @param commentID 评论的ID
   * @param content 评论的内容
   * @returns void
   */
  onUpdateConfirmBtn?: (commentID: number, content: string) => void // 更新评论
  /**
   * 点击回复编辑框的确认按钮的触发函数
   * @param toCommentID 父评论的id（即回复目标评论的唯一标识）
   * @param content 回复内容
   * @param toUserID 回复的目标用户，为0则为顶级回复（不显示回复@xxx）
   * @param element 回复目标的Dom对象，用于动态更新
   * @returns void
   */
  onReplyPostBtn: (content: string, toCommentID: number, toUserID: number, element: HTMLDivElement) => void // 回复评论
  /**
   * 点击喜欢按钮的触发函数
   * @param commentID 评论ID
   * @param bool Like or Unlike
   * @returns void
   */
  onLikeBtn?: (commentID: number, bool: boolean) => void
  /**
   * 点击页码的事件
   * @param pageNum 页码
   * @returns void
   */
  onPagiClick: (pageNum: number) => void
}) {
  // 配置项初始化处理
  const errorMsgInitFail = 'error: 关键项没有设置 comment 初始化失败'
  if (config === undefined || config.onPostBtn === undefined || config.onReplyPostBtn === undefined || config.onPagiClick === undefined) {
    console.error(errorMsgInitFail)
    return undefined
  }

  const $commentArea = document.getElementById(config.elid || 'gcomment')
  if ($commentArea === null) {
    console.error('没有找到element')
    return undefined
  }
  $commentArea.classList.add(styles['gcomment-main'])
  // 处理结束

  // 生成评论编辑区域
  const editor = cmtTextarea(config.onPostBtn, config.defaultAvatarHtml, config.avatarTippy)
  $commentArea.append(editor.element)

  // 评论展示区域
  const commentShowcase = cmtShowcase(config.onReplyPostBtn, config.onPagiClick, [], 0)
  $commentArea.append(commentShowcase.element)

  const setComments = (comments?: commentG[], total?: number) => {
    return cmtShowcase(config.onReplyPostBtn, config.onPagiClick, comments, total)
  }

  /**
   *
   * @param cmt 评论对象
   * @param el 评论目标的element
   * @param type 1：这是评论 2：这是根回复 3：这是子回复
   * @returns
   */
  const insertOneComment = (cmt: commentG, el: Element, type: number) => {
    if (![1, 2, 3].includes(type)) return
    const $comment = genOneComment(cmt, config.onReplyPostBtn)
    const { classList } = $comment
    classList.add(styles['new-comment'])
    switch (type) {
      case 1: {
        const $toobar = commentShowcase.element.children[1]
        if ($toobar !== null) {
          const $tmp = document.createElement('div')
          $tmp.classList.add(styles['children-comments'])
          const $aCommnet = wrapByDiv($comment, $tmp)
          const $totalNum = $toobar.querySelector('i.total-num')
          if ($totalNum !== null) {
            const total = Number($totalNum.innerHTML) + 1
            $totalNum.innerHTML = total.toString()
          }
          $aCommnet.classList.add(styles['a-comment'])
          $toobar.prepend($aCommnet)
          removeClassDelay(styles['new-comment'], $comment)
        }
        break
      }

      case 2: {
        el.nextElementSibling?.prepend($comment)

        removeClassDelay(styles['new-comment'], $comment)
        break
      }

      case 3: {
        el.after($comment)
        removeClassDelay(styles['new-comment'], $comment)
        break
      }

      default:
        break
    }
  }

  function loading(opt: boolean) {
    const $model = document.createElement('div')
    $model.classList.add(styles['model-loading'])
    if (opt) {
      $commentArea?.prepend($model)
      commentShowcase.loading.show()
      editor.disable(true)
    } else {
      setTimeout(() => {
        $commentArea?.querySelector(`div.${styles['model-loading']}`)?.remove()
        commentShowcase.loading.close()
        editor.disable(false)
      }, 500)
    }
  }

  // 返回一个包含了基本方法的对象
  return {
    /**
     * 评论区域的Dom对象
     */
    element: $commentArea,
    /**
     * 设置右侧头像区域的内容
     */
    setAvatar: editor.setAvatar,
    /**
     * 设置点击头像的触发函数，可空
     */
    setAvatarBtn: editor.setAvatarBtn,
    /**
     * 设置评论展示区域的内容
     * @param comments 评论组
     * @param total 总数用于分页
     */
    setComments,
    /**
     * 生成一个评论的element
     * @param cmt 评论对象
     */
    insertOneComment,
    loading,
  }
}
