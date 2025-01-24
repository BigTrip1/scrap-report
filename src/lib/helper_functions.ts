// stringify data for client component
export const stringifyForComponent = <T>(data: T[]): T[] => {
  if (!data) return [];
  return JSON.parse(JSON.stringify(data));
};

// validate that last part of email is @jcb.com
export const isJcbEmail = (str: string) => {
  if (!str) return false;
  if (str.trim().length < 9) return false;
  const lastPart = str.slice(-8).toLowerCase();
  if (lastPart !== "@jcb.com") return false;
  return true;
};

export const capitalizeFirstLetterOfAllWords = (string: string) => {
  if (!string || string.trim().length < 1) return "";
  const lowerString = string.toLowerCase().trim();
  return lowerString.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
};

export const formatDateInLocal = (date: Date) => {
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
  });
};
