/* eslint-disable no-console */
import cmtTextarea from './modules/cmt-textarea'
import cmtShowcase, { commentG, genOneComment } from './modules/comments'

import styles from './index.module.scss'
import { removeClassDelay, wrapByDiv } from './modules/utils'

interface CONFType {
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
  onPostBtn?: (content: string) => void // 发送评论按钮
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
  onReplyPostBtn?: (content: string, toCommentID: number, toUserID: number, element: HTMLDivElement) => void // 回复评论
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
  onPagiClick?: (pageNum: number) => void
}

/**
 * 默认的配置
 */
const DEFAULT_CONFIG = {
  elid: 'gcomment',
  defaultAvatarHtml: '',
  avatarTippy: '',
  onDeleteBtn() {
    return false
  },
  onLikeBtn() {
    return false
  },
  onPagiClick() {
    return false
  },
  onPostBtn() {
    return false
  },
  onReplyPostBtn() {
    return false
  },
  onUpdateConfirmBtn() {
    return false
  },
}

interface outObjectType {
  init: (conf: CONFType) => void
  /**
   * 评论区域的Dom对象
   */
  element: HTMLElement
  /**
   * 设置右侧头像区域的内容
   */
  setAvatar: (html?: string, tippyContent?: string) => void
  /**
   * 设置点击头像的触发函数，可空
   */
  setAvatarBtn: (func?: ((this: GlobalEventHandlers, ev: MouseEvent) => void) | undefined) => void
  /**
   * 设置评论展示区域的内容
   * @param comments 评论组
   * @param total 总数用于分页
   */
  setComments: (comments?: commentG[], total?: number, pages?: number, currentPage?: number) => void
  /**
   * 生成一个评论的element
   * @param cmt 评论对象
   */
  insertOneComment: (cmt: commentG, el: Element, type: number) => void
  loading: (bool: boolean) => void
}

/**
 * 核心函数，返回一个控制对象
 * @returns 一个包含了几个方法的对象
 */
function gComment(CONF = DEFAULT_CONFIG) {
  let $commentArea = document.getElementById(CONF.elid)
  if ($commentArea === null) {
    console.error('没有找到element')
    $commentArea = document.createElement('div')
  }
  $commentArea.classList.add(styles['gcomment-main'])
  // 清空区域内容
  $commentArea.innerHTML = ''
  // 处理结束

  // 生成评论编辑区域
  const editor = cmtTextarea(CONF.onPostBtn, CONF.defaultAvatarHtml, CONF.avatarTippy)
  $commentArea.append(editor.element)

  // 评论展示区域
  const commentShowcase = cmtShowcase(CONF.onReplyPostBtn, CONF.onPagiClick, [], 0)
  $commentArea.append(commentShowcase.element)

  const setComments = (comments?: commentG[], total?: number, pages = 1, currentPage = 1) => {
    cmtShowcase(CONF.onReplyPostBtn, CONF.onPagiClick, comments, total, pages, currentPage)
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
    const $comment = genOneComment(cmt, CONF.onReplyPostBtn)
    const { classList } = $comment
    classList.add(styles['new-comment'])
    switch (type) {
      case 1: {
        const $toobar = commentShowcase.element.children[1]
        if ($toobar !== null) {
          const $tmp = document.createElement('div')
          $tmp.classList.add(styles['children-comments'])
          const $aCommnet = wrapByDiv($comment, $tmp)
          const $totalNum = $toobar.querySelector(`i.${styles['total-num']}`)
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

  const output = {
    element: $commentArea,
    setAvatar: editor.setAvatar,
    setAvatarBtn: editor.setAvatarBtn,
    setComments,
    insertOneComment,
    loading,
  }

  // 返回一个包含了基本方法的对象
  return output
}

const Gcmt: outObjectType = {
  init(conf) {
    const defaults = DEFAULT_CONFIG
    // 这里使用默认配置的副本，因为assign会改变target
    const tmpc = Object.assign(defaults, conf)
    const tmp = gComment(tmpc)
    // 这里直接修改输出项
    Object.assign(Gcmt, tmp)
  },
  element: document.createElement('div'),
  setAvatar() {
    return false
  },
  setAvatarBtn() {
    return false
  },
  setComments() {
    return false
  },
  insertOneComment() {
    return false
  },
  loading() {
    return false
  },
}

export default Gcmt
