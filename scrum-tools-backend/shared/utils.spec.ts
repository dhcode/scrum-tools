import { eJsonParse, eJsonStringify, randomString } from './utils';

describe('Utils', () => {
  it('should generate random string', () => {
    expect(randomString(5)).toHaveLength(5);
    expect(randomString(10)).toHaveLength(10);
    expect(randomString()).toHaveLength(10);
  });

  it('should serialize', () => {
    const dt = new Date();
    expect(eJsonStringify(dt)).toEqual('{"$date":"' + dt.toISOString() + '"}');
    expect(eJsonStringify(null)).toEqual('null');
    expect(eJsonStringify(true)).toEqual('true');
    expect(eJsonStringify(false)).toEqual('false');
    expect(eJsonStringify(23)).toEqual('23');
    expect(eJsonStringify('abc')).toEqual('"abc"');
  });

  it('should deserialize', () => {
    expect(eJsonParse('{"$date":"2020-04-10T08:06:18.241Z"}')).toEqual(new Date('2020-04-10T08:06:18.241Z'));
    expect(eJsonParse('null')).toEqual(null);
    expect(eJsonParse('true')).toEqual(true);
    expect(eJsonParse('false')).toEqual(false);
    expect(eJsonParse('23')).toEqual(23);
    expect(eJsonParse('"abc"')).toEqual('abc');
  });

  it('should serialize and deserialize complex structure', () => {
    const data = {
      name: 'Test',
      at: new Date(),
      active: true,
    };
    const str = eJsonStringify(data);
    expect(eJsonParse(str)).toEqual(data);
  });
});
