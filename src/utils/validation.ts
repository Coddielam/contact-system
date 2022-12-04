//stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
export const validateUrl = (string: string | number): boolean => {
  if (typeof string !== "string") return false;
  let url: URL;
  try {
    url = new URL(string);
  } catch (error) {
    return false;
  }

  return url.protocol === "http" || url.protocol === "https";
};
