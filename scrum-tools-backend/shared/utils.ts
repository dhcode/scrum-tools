export function randomString(len = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const pool = chars + chars.toUpperCase() + numbers;
  const str = [];
  for (let i = 0; i < len; i++) {
    str.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return str.join('');
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
