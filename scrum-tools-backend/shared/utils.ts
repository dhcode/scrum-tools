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

/**
 * Maps all not done values
 */
export function mapAsync<T, R>(iterator: AsyncIterator<T>, mapFn: (item: T) => R): AsyncIterator<R> {
  return {
    next(): Promise<IteratorResult<R, any>> {
      return iterator.next().then((res) => {
        if (res.done) {
          return res;
        } else {
          return { value: mapFn(res.value), done: false };
        }
      });
    },
  };
}

export function mapAsyncField<T, I>(
  iterator: AsyncIterator<T>,
  field: string,
  mapFn: (item: I, ...args) => I,
  ...args
): AsyncIterator<T> {
  return mapAsync(iterator, (item: any) => {
    if (item && field in item) {
      item[field] = mapFn(item[field], ...args);
    }
    return item;
  });
}
