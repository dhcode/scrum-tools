export function randomString(len = 10) {
  const str = [];
  for (let i = 0; i < len; i += 10) {
    str.push(Math.random().toString(36).substr(2, 10));
  }
  return str.join('').substr(0, len);
}

export function eJsonStringify(obj: any): string {
  return JSON.stringify(obj, function (key, value) {
    if (this[key] instanceof Date) {
      return { $date: this[key].toISOString() };
    } else {
      return value;
    }
  });
}

export function eJsonParse(encoded: string): any {
  return JSON.parse(encoded, (key, value) => {
    if (typeof value === 'object' && value && value.$date) {
      const keys = Object.keys(value);
      if (keys.length === 1 && keys[0] === '$date') {
        return new Date(value.$date);
      }
    }
    return value;
  });
}
