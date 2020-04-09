export function randomString(len = 10) {
  const str = [];
  for (let i = 0; i < len; i += 10) {
    str.push(Math.random().toString(36).substr(2, 10));
  }
  return str.join('').substr(0, len);
}
