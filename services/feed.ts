import emojiRegex from 'emoji-regex'

export const cutText = (text: string, length: number = 50) => {
  if (!text) return ' ...'
  const textSplited = text.split(' ')
  textSplited.length = length
  return `${textSplited.join(' ').replace('.', '.<br/>')} ...`
}

export const removeEmoji = (str: string): string => {
  return str ? str.replace(emojiRegex(), '') : ''
}