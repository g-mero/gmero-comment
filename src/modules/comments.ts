import { convertIt } from './grammar'
import { timeAgo, wrapByDiv } from './utils'

import styles from '../index.module.scss'
import { replyTextarea } from './cmt-textarea'

export interface commentG {
  id: number
  userID: number
  nickname: string
  avatarUrl: string
  content: string
  likes: number
  replys: number
  isEdited: boolean
  createAt: string
  toUserNickname: string
  toCommentID: number
  children: commentG[]
}

const testcomment: commentG = {
  id: 1,
  userID: 1,
  nickname: 'test1',
  avatarUrl: 'https://pic1.zhimg.com/v2-807cb31dd5c24356fbe4caa5cdc35f43_l.jpg?source=06d4cd63',
  content: 'test',
  likes: 10,
  replys: 2,
  isEdited: false,
  toUserNickname: '',
  createAt: '2023-02-19T17:33:27.1343681+08:00',
  toCommentID: 0,
  children: [],
}

const testReply: commentG = {
  id: 1,
  userID: 3,
  nickname: 'test3',
  avatarUrl: 'https://avatars.githubusercontent.com/u/0',
  content: '<a href="sdsdsd" target="_blank">sdsd</a>',
  likes: 4,
  replys: 0,
  toUserNickname: 'test2',
  isEdited: true,
  createAt: '2023-02-19T17:33:27.1343681+08:00',
  toCommentID: 1,
  children: [],
}

const testCommentsChild: commentG = {
  id: 1,
  userID: 2,
  nickname: 'test2',
  avatarUrl: 'https://pic1.zhimg.com/v2-807cb31dd5c24356fbe4caa5cdc35f43_l.jpg?source=06d4cd63',
  content: '[点我前往百度](https://baidu.com)',
  likes: 10,
  replys: 2,
  isEdited: false,
  toUserNickname: '',
  createAt: '2023-02-19T17:33:27.1343681+08:00',
  toCommentID: 0,
  children: [testReply, testReply, testReply],
}

/**
 * 测试用例
 */
export const testcomments: commentG[] = [testCommentsChild, testcomment, testcomment, testcomment, testcomment, testcomment]

const replyArea = replyTextarea()

const svgLike = `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
<path 
d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 
5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 
26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 
21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 
32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 
4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 
99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 
2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 
1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 
11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 
67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 
477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 
61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z" fill="#9499a0">
</path></svg>`

const svgLikeFill = `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path 
d="M860.032 341.12h-182.08c7.488-17.408 14.72-38.528 18.048-60.544 5.952-39.872 
4.992-87.36-18.368-129.088-21.76-38.848-50.304-60.928-83.52-61.376-30.72-0.384-53.888 18.176-65.728 33.408a199.296 199.296 0 0 
0-32.064 59.264l-1.92 5.184c-5.44 14.976-10.88 29.952-23.04 51.456-19.712 34.816-48.832 56.128-77.696 74.368a391.936 391.936 0 0 
1-30.976 17.92v552.448a4621.952 4621.952 0 0 0 351.872-5.312c51.264-2.752 100.672-28.544 127.488-76.032 24.32-43.136 55.168-108.16 
74.368-187.264 20.416-84.16 24.64-152.704 24.576-195.968-0.128-46.336-38.72-78.4-80.96-78.4z m-561.344 541.312V341.12H215.808c-59.712 
0-113.408 42.048-120.896 104.32a1376 1376 0 0 0 0.64 330.368c7.36 58.688 56.128 100.032 113.024 102.848 25.024 1.28 55.552 2.56 
90.112 3.712z" fill="#00aeec"></path></svg>`

let lastCilck: HTMLElement | null

/**
 * 生成评论或回复的单个element
 * @param cmt - 评论对象
 * @returns 评论element
 */
const genOneComment = (
  cmt: commentG,
  onReplyPostBtn: (content: string, toCommentID: number, toUserID: number) => void,
  isReply = false
) => {
  const $comment = document.createElement('div')
  $comment.classList.add(styles['single-comment'])
  $comment.innerHTML = `<div class="${styles['d-flex']}"><div class="${styles['g-comment-avatar']}">
                    <img src="${cmt.avatarUrl}">
                </div>
                <div class="${styles['w-100']}">
                    <div class="${styles['d-flex']}  ${styles['justyfy-content-between']}"><span class="nickname">${cmt.nickname}${
    cmt.toUserNickname !== '' ? `回复@${cmt.toUserNickname}` : ''
  }</span>
                        <div class="comment-g-options"></div>
                    </div>
                    <div class="${styles.content}">${convertIt(cmt.content)}</div>
                    <div class="${styles.bottom} ${styles['d-flex']}">
                        <span> ${timeAgo(cmt.createAt)}</span>
                        <span class="${styles['btn-icon-text']} ${styles['like-btn']}"><i class="${styles.icon}">${svgLike}</i>${
    cmt.likes
  }</span>
                        <span class="${styles['btn-icon-text']} ${styles['reply-btn']}">回复</span>
                    </div>
                </div></div>`
  const $btnReply = $comment.querySelector(`.${styles['reply-btn']}`) as HTMLElement
  const $btnLike = $comment.querySelector(`.${styles['like-btn']}`) as HTMLElement

  if ($btnReply !== null && $btnLike !== null) {
    $btnReply.onclick = () => {
      if (lastCilck === $btnReply) {
        replyArea.hide()
        lastCilck = null
        return
      }
      lastCilck = $btnReply
      replyArea.show()
      replyArea.setPlaceholder(`回复@${cmt.nickname}`)
      // 由于回复评论与回复评论下的回复有不同，所以要做区分
      replyArea.setPostBtn(() => {
        onReplyPostBtn(replyArea.getValue(), isReply ? cmt.toCommentID : cmt.id, isReply ? cmt.userID : 0)
        replyArea.clear()
      })

      $comment.append(replyArea.element)
    }

    let bool = false

    $btnLike.onclick = () => {
      if (bool) {
        $btnLike.innerHTML = `<i class="${styles.icon}">${svgLike}</i>${cmt.likes}`
        bool = false
      } else {
        $btnLike.innerHTML = `<i class="${styles.icon}">${svgLikeFill}</i>${cmt.likes + 1}`
        bool = true
      }
    }
  }
  return $comment
}

/**
 * 生产当前评论的评论内容及回复
 * @param cmt -评论对象
 * @returns 评论的element
 */
const genComments = (cmt: commentG, onReplyPostBtn: (content: string, toCommentID: number, toUserID: number) => void) => {
  const $comment = wrapByDiv(genOneComment(cmt, onReplyPostBtn))
  $comment.classList.add(styles['a-comment'])
  if (cmt.children.length > 0) {
    const children: Element[] = []

    cmt.children.forEach((v) => {
      children.push(genOneComment(v, onReplyPostBtn, true))
    })

    const $tmp = wrapByDiv(...children)
    $tmp.classList.add(styles['children-comments'])

    $comment.append($tmp)
  }
  return $comment
}

/**
 * 顶部的信息栏，显示评论数以及切换显示模式
 */
const $toolbar = document.createElement('div')
$toolbar.classList.add(styles['d-flex'], styles['justyfy-content-between'], styles['toolbar-comments'])

/**
 * 生成或修改顶部toolbar信息展示
 * @param num - 评论的总数
 * @returns $toolbar
 */
function genToolBar(num: number): Element {
  $toolbar.innerHTML = `<div>${num} 条评论</div><div></div>`
  return $toolbar
}

/**
 * 生成评论展示区域
 *
 * @param comments - comments list
 * @returns element of comments
 *
 */
export default function cmtShowcase(
  onReplyPostBtn: (content: string, toCommentID: number, toUserID: number) => void,
  comments?: commentG[],
  total?: number
) {
  if (comments === undefined || comments.length < 1 || total === undefined || total === 0) {
    return wrapByDiv(genToolBar(0))
  }
  const gcomment: Element[] = []
  comments.forEach((v) => {
    gcomment.push(genComments(v, onReplyPostBtn))
  })
  return wrapByDiv(genToolBar(total), ...gcomment)
}
