import { searchHTML } from '../components/_search';

test('returns indicies that match query', () => {
    expect(searchHTML('<b>h</b>ello', 'HELL')).toStrictEqual([3, 8, 9, 10]);
});

test('returns empty array', () => {
    expect(searchHTML('<b>h</b>ello', 'hello there')).toStrictEqual([]);
});