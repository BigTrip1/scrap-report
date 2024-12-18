// stringify data for client component
export const stringifyForComponent = (data: any[]) => {
  if (!data) return []
  return JSON.parse(JSON.stringify(data))
}

// validate that last part of email is @jcb.com
export const isJcbEmail = (str: string) => {
  if (!str) return false
  if (str.trim().length < 9) return false
  const lastPart = str.slice(-8).toLowerCase()
  if (lastPart !== '@jcb.com') return false

  return true
}

export const capitalizeFirstLetterOfAllWords = (string: string) => {
  //    ^ matches the beginning of the string.
  //    w matches any word character.
  //    {1} takes only the first character.
  //     Thus, ^\w{1} matches the first letter of the word.
  //    | works like the boolean OR. It matches the expression after and before the |.
  //    \s+ matches any amount of whitespace between the words (for example spaces, tabs, or line breaks).

  // handle if no string or empty string
  if (!string || string.trim().length < 1) {
    return ''
  }

  // first convert to all lowercase
  const lowerString = string.toLowerCase().trim()

  return lowerString.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
}

export const formatDateInLocal = (date: Date) => {
  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour12: true,
  })
}
