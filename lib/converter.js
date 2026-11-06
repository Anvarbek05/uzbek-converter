// NexUz shared transliteration rules.
// This module is used by the website API and Telegram webhook.
'use strict';

const EXCEPTIONS = new Map([
  // Keep familiar Uzbek words intact when a digraph could be misread.
  ['yoqut', 'Yoqut'],
  ['yoquti', 'Yoquti'],
  ['yoqutlar', 'Yoqutlar']
]);

const CYRILLIC = {
  'А':'A','а':'a','Б':'B','б':'b','В':'V','в':'v','Г':'G','г':'g',
  'Д':'D','д':'d','Е':'E','е':'e','Ж':'J','ж':'j','З':'Z','з':'z',
  'И':'I','и':'i','Й':'Y','й':'y','К':'K','к':'k','Л':'L','л':'l',
  'М':'M','м':'m','Н':'N','н':'n','О':'O','о':'o','П':'P','п':'p',
  'Р':'R','р':'r','С':'S','с':'s','Т':'T','т':'t','У':'U','у':'u',
  'Ф':'F','ф':'f','Х':'X','х':'x','Ҳ':'H','ҳ':'h','Э':'E','э':'e',
  'Қ':'Q','қ':'q','Ғ':'Ğ','ғ':'ğ','Ў':'Ö','ў':'ö','Ш':'Ş','ш':'ş',
  'Ч':'Ç','ч':'ç','Ъ':'‘','ъ':'‘','Ь':'','ь':'',
  'Ё':'Yo','ё':'yo','Ю':'Yu','ю':'yu','Я':'Ya','я':'ya',
  'Ц':'Ts','ц':'ts','Щ':'Şç','щ':'şç'
};

const LATIN_TO_CYRILLIC = {
  'Ye':'Е','ye':'е','Yo':'Ё','yo':'ё','Yu':'Ю','yu':'ю','Ya':'Я','ya':'я',
  'Ts':'Ц','ts':'ц','SH':'Ш','Sh':'Ш','sh':'ш','CH':'Ч','Ch':'Ч','ch':'ч',
  'G‘':'Ғ','g‘':'ғ','O‘':'Ў','o‘':'ў',
  'A':'А','a':'а','B':'Б','b':'б','V':'В','v':'в','G':'Г','g':'г',
  'D':'Д','d':'д','E':'Е','e':'е','J':'Ж','j':'ж','Z':'З','z':'з',
  'I':'И','i':'и','Y':'Й','y':'й','K':'К','k':'к','L':'Л','l':'л',
  'M':'М','m':'м','N':'Н','n':'н','O':'О','o':'о','P':'П','p':'п',
  'R':'Р','r':'р','S':'С','s':'с','T':'Т','t':'т','U':'У','u':'у',
  'F':'Ф','f':'ф','X':'Х','x':'х','H':'Ҳ','h':'ҳ','Q':'Қ','q':'қ','‘':'Ъ'
};

function normalizeApostrophes(value) {
  return String(value || '').replace(/[’'\x60ʻʼ]/g, '‘');
}

function applyExceptions(value) {
  return value.replace(/\b[\p{L}]+\b/gu, word => EXCEPTIONS.get(word.toLowerCase()) || word);
}

function convertToNewLatin(input) {
  if (!input) return '';
  let text = normalizeApostrophes(input);

  // Context-sensitive Е/е: word start and after vowels are commonly Ye/ye.
  text = text.replace(/(^|[\s\n\t([{“«.,!?;:])Е/g, '$1Ye')
    .replace(/(^|[\s\n\t([{“«.,!?;:])е/g, '$1ye')
    .replace(/([АаЕеИиОоУуЎўЭэЮюЯя‘])Е/g, '$1Ye')
    .replace(/([АаЕеИиОоУуЎўЭэЮюЯя‘])е/g, '$1ye');

  text = Array.from(text, ch => CYRILLIC[ch] ?? ch).join('');

  // Old Latin to new Latin. Longest patterns first; preserve capitalization.
  text = text
    .replace(/SH/g, 'Ş').replace(/Sh/g, 'Ş').replace(/sh/g, 'ş')
    .replace(/CH/g, 'Ç').replace(/Ch/g, 'Ç').replace(/ch/g, 'ç')
    .replace(/G‘/g, 'Ğ').replace(/g‘/g, 'ğ')
    .replace(/O‘/g, 'Ö').replace(/o‘/g, 'ö');

  return applyExceptions(text);
}

function convertToOldLatin(input) {
  if (!input) return '';
  let text = String(input);
  const uppercaseNext = /[A-ZĞÖIİEOUÁÝÂÊÎÔÛDŽÇŞ]/;
  text = text.replace(/Ş(?=[A-ZĞÖIİEOUÁÝÂÊÎÔÛDŽÇŞ])/g, 'SH')
    .replace(/Ç(?=[A-ZĞÖIİEOUÁÝÂÊÎÔÛDŽÇŞ])/g, 'CH')
    .replace(/Ğ(?=[A-ZĞÖIİEOUÁÝÂÊÎÔÛDŽÇŞ])/g, 'G‘')
    .replace(/Ö(?=[A-ZĞÖIİEOUÁÝÂÊÎÔÛDŽÇŞ])/g, 'O‘');
  return text
    .replace(/Ğ/g, 'G‘').replace(/ğ/g, 'g‘')
    .replace(/Ö/g, 'O‘').replace(/ö/g, 'o‘')
    .replace(/Ş/g, 'Sh').replace(/ş/g, 'sh')
    .replace(/Ç/g, 'Ch').replace(/ç/g, 'ch');
}

function convertToCyrillic(input) {
  if (!input) return '';
  let text = convertToOldLatin(input);
  text = text.replace(/(^|[\s([{“«.,!?;:])E/g, '$1Э').replace(/(^|[\s([{“«.,!?;:])e/g, '$1э');
  const keys = Object.keys(LATIN_TO_CYRILLIC).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    text = text.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), LATIN_TO_CYRILLIC[key]);
  }
  return text;
}

function convert(text, mode = 'old_to_new') {
  if (mode === 'new_to_old') return convertToOldLatin(text);
  if (mode === 'new_to_cyrillic') return convertToCyrillic(text);
  return convertToNewLatin(text);
}

module.exports = { convert, convertToNewLatin, convertToOldLatin, convertToCyrillic, EXCEPTIONS };
