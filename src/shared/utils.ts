import { Collection } from 'mongodb';

export function randomString(len = 10) {
  const str = [];
  for (let i = 0; i < len; i += 10) {
    str.push(
      Math.random()
        .toString(36)
        .substr(2, 10),
    );
  }
  return str.join('').substr(0, len);
}

export async function retryInsert(collection: Collection, doc: Record<string, any>, tries = 10, idLen = 10) {
  for (let i = 0; i < tries; i++) {
    try {
      return await collection.insertOne(doc);
    } catch (e) {
      doc._id = randomString(idLen);
      if (tries === i - 1) {
        throw e;
      }
    }
  }
}
