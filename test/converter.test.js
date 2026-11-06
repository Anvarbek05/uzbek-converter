const assert = require('node:assert/strict');
const { convert } = require('../lib/converter');

const cases = [
  ['G‘alaba, O‘zbekiston, Shahar, Chiroy', 'old_to_new', 'Ğalaba, Özbekiston, Şahar, Çiroy'],
  ['Ғалаба, Ўзбекистон, Шаҳар, Чирой', 'cyrillic_to_new', 'Ğalaba, Özbekiston, Şahar, Çiroy'],
  ['Ğalaba, Özbekiston, Şahar, Çiroy', 'new_to_old', 'G‘alaba, O‘zbekiston, Shahar, Chiroy'],
  ['ŞAXS ÇIROY ĞALABA ÖZBEK', 'new_to_old', 'SHAXS CHIROY G‘ALABA O‘ZBEK'],
  ['Ğalaba, Özbekiston, Şahar, Çiroy', 'new_to_cyrillic', 'Ғалаба, Ўзбекистон, Шаҳар, Чирой'],
  ['Yoqut', 'old_to_new', 'Yoqut'],
  ['Ertak', 'new_to_cyrillic', 'Эртак'],
  ['kel', 'new_to_cyrillic', 'кел'],
  ['Qashqadaryo', 'new_to_cyrillic', 'Қашқадарё']
];

for (const [input, mode, expected] of cases) {
  assert.equal(convert(input, mode), expected, mode + ': ' + input);
}
console.log('NexUz transliteration tests passed: ' + cases.length);
