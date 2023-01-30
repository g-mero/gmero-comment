import { convertIt } from './grammar'
import { wrap_by_div } from './utils'

import styles from '../index.module.scss'

interface comment_g {
  nickname: string
  avatar_url: string
  content: string
  likes: number
  replys: number
  children: comment_g[]
}

const testcomment: comment_g = {
  nickname: 'test1',
  avatar_url:
    'https://pic1.zhimg.com/v2-807cb31dd5c24356fbe4caa5cdc35f43_l.jpg?source=06d4cd63',
  content: 'test',
  likes: 10,
  replys: 2,
  children: [],
}

const testcomment_c: comment_g = {
  nickname: 'test2',
  avatar_url:
    'https://pic1.zhimg.com/v2-807cb31dd5c24356fbe4caa5cdc35f43_l.jpg?source=06d4cd63',
  content: '[点我前往百度](https://baidu.com)',
  likes: 10,
  replys: 2,
  children: [testcomment, testcomment],
}

export const testcomments: comment_g[] = [testcomment_c, testcomment]

const gen_acomment = (cmt: comment_g) => {
  const $comment = document.createElement('div')
  $comment.classList.add(styles['d-flex'], styles['single-comment'])
  $comment.innerHTML = `<div class="${styles['g-comment-avatar']}">
                    <img src="${cmt.avatar_url}">
                </div>
                <div class="${styles['w-100']}">
                    <div class="${styles['d-flex']}  ${
    styles['justyfy-content-between']
  }"><span>${cmt.nickname}</span>
                        <div class="comment-g-options"></div>
                    </div>
                    <div class="content">${convertIt(cmt.content)}</div>
                    <div class="bottom ${styles['d-flex']} ${
    styles['justyfy-content-between']
  }">
                        <span>2022-06-24</span>
                        <div class="reply-likes  ${styles['d-flex']} ${
    styles['justyfy-content-between']
  }">
                            <button class="${
                              styles['btn-icon-text']
                            }"><svg xmlns="http://www.w3.org/2000/svg" width="1em"
                                    height="1em" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                                </svg> 回复</button>
                            <button class="${
                              styles['btn-icon-text']
                            }"><svg xmlns="http://www.w3.org/2000/svg" width="1em"
                                    height="1em" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                    <path
                                        d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                                </svg>${cmt.likes}</button>
                        </div>
                    </div>
                </div>`
  return $comment
}

const gen_acomment_with_children = (cmt: comment_g) => {
  const $comment = wrap_by_div(gen_acomment(cmt))
  $comment.classList.add(styles['a-comment'])
  if (cmt.children.length > 0) {
    const children: Element[] = []

    cmt.children.forEach((v) => {
      children.push(gen_acomment(v))
    })

    const $tmp = wrap_by_div(...children)
    $tmp.classList.add(styles['children-comments'])

    $comment.append($tmp)
  }
  return $comment
}

export default function (comments: comment_g[]) {
  const gcomment: Element[] = []
  comments.forEach((v) => {
    gcomment.push(gen_acomment_with_children(v))
  })
  const $output = wrap_by_div(...gcomment)

  return $output
}
