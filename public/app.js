const $ = (id) => document.getElementById(id);
const inputText = $('inputText');
const outputText = $('outputText');
const outputPreview = $('outputPreview');
const convertMode = $('convertMode');
const fileInput = $('fileInput');
const fileStatus = $('fileStatus');
let originalDocx = null;
let conversionTimer = null;
let lastSavedValue = '';

const SPECIAL = /[ĞğÖöŞşÇç]/;
const historyKey = 'nexuz-conversion-history-v1';
const themeKey = 'nexuz-theme';

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function highlightOutput(value) {
  if (!value) return '<span class="empty-state">Natija shu yerda ko‘rinadi...</span>';
  return Array.from(value).map(char => SPECIAL.test(char)
    ? '<span class="changed-letter">' + escapeHtml(char) + '</span>'
    : escapeHtml(char)).join('');
}
function updateCounters() {
  $('inputCount').textContent = inputText.value.length.toLocaleString('uz-UZ') + ' belgi';
  $('outputCount').textContent = outputText.value.length.toLocaleString('uz-UZ') + ' belgi';
}
function renderResult(value) {
  outputText.value = value || '';
  outputPreview.innerHTML = highlightOutput(outputText.value);
  updateCounters();
}
async function triggerConversion(save = true) {
  const source = inputText.value;
  updateCounters();
  if (!source.trim()) {
    renderResult('');
    return;
  }
  try {
    const response = await fetch('/api/convert-text', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({text:source, mode:convertMode.value})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Konvertatsiya amalga oshmadi.');
    renderResult(data.result);
    if (save) scheduleHistorySave();
  } catch (error) {
    fileStatus.textContent = '⚠ ' + error.message;
  }
}
function scheduleHistorySave() {
  clearTimeout(conversionTimer);
  conversionTimer = setTimeout(() => {
    if (inputText.value.trim() && outputText.value && inputText.value !== lastSavedValue) {
      saveHistory(inputText.value, outputText.value, convertMode.value);
      lastSavedValue = inputText.value;
    }
  }, 650);
}
function getHistory() {
  try { return JSON.parse(localStorage.getItem(historyKey) || '[]'); }
  catch { return []; }
}
function saveHistory(source, result, mode) {
  const items = getHistory();
  items.unshift({source, result, mode, date:new Date().toISOString()});
  const unique = items.filter((item, index) => index === 0 || item.source !== source || item.mode !== mode).slice(0, 12);
  localStorage.setItem(historyKey, JSON.stringify(unique));
  renderHistory();
}
function renderHistory() {
  let panel = $('historyPanel');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'historyPanel';
    panel.className = 'history-panel';
    panel.innerHTML = '<div class="history-head"><div><span class="panel-kicker">BRAUZER TARIXI</span><h3>Oxirgi konvertatsiyalar</h3></div><button id="clearHistoryBtn" class="text-button">Tarixni tozalash</button></div><div id="historyItems" class="history-items"></div>';
    $('converter').appendChild(panel);
    $('clearHistoryBtn').addEventListener('click', () => {
      localStorage.removeItem(historyKey);
      lastSavedValue = '';
      renderHistory();
    });
  }
  const target = $('historyItems');
  const items = getHistory();
  if (!items.length) {
    target.innerHTML = '<span class="history-empty">Hali saqlangan konvertatsiyalar yo‘q.</span>';
    return;
  }
  target.innerHTML = items.map((item, index) => {
    const preview = escapeHtml(item.source.replace(/\s+/g,' ').slice(0,95));
    const date = new Date(item.date).toLocaleString('uz-UZ',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
    return '<button class="history-item" data-history="' + index + '"><span>' + preview + (item.source.length > 95 ? '…' : '') + '</span><small>' + date + '</small></button>';
  }).join('');
  target.querySelectorAll('[data-history]').forEach(button => button.addEventListener('click', () => {
    const item = getHistory()[Number(button.dataset.history)];
    if (!item) return;
    inputText.value = item.source;
    convertMode.value = item.mode;
    renderResult(item.result);
    fileStatus.textContent = 'Tarixdan tiklandi';
    $('converter').scrollIntoView({behavior:'smooth',block:'start'});
  }));
}
async function copyText(value, label) {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    fileStatus.textContent = '✓ ' + label + ' nusxalandi';
  } catch {
    fileStatus.textContent = 'Nusxalash uchun brauzer ruxsati kerak.';
  }
}
function setTheme(theme) {
  document.body.classList.toggle('light-theme', theme === 'light');
  document.body.classList.toggle('dark-theme', theme !== 'light');
  $('themeIcon').textContent = theme === 'light' ? '☾' : '☼';
  localStorage.setItem(themeKey, theme);
}
$('themeToggleBtn').addEventListener('click', () => setTheme(document.body.classList.contains('light-theme') ? 'dark' : 'light'));
setTheme(localStorage.getItem(themeKey) || 'dark');

inputText.addEventListener('input', () => triggerConversion());
convertMode.addEventListener('change', () => triggerConversion());
$('uploadBtn').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  fileStatus.textContent = 'Hujjat o‘qilmoqda: ' + file.name;
  originalDocx = file.name.toLowerCase().endsWith('.docx') ? file : null;
  try {
    const form = new FormData();
    form.append('file', file);
    const response = await fetch('/api/parse-file', {method:'POST',body:form});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Faylni o‘qib bo‘lmadi.');
    inputText.value = data.text || '';
    fileStatus.textContent = '✓ Yuklandi: ' + file.name + (originalDocx ? ' · Word tuzilmasi saqlanadi' : '');
    await triggerConversion();
  } catch (error) {
    fileStatus.textContent = '⚠ ' + error.message;
  }
});

$('clearBtn').addEventListener('click', () => {
  inputText.value = '';
  renderResult('');
  fileInput.value = '';
  originalDocx = null;
  fileStatus.textContent = '';
  lastSavedValue = '';
});
$('copyInputBtn').addEventListener('click', () => copyText(inputText.value, 'Kirish matni'));
$('copyBtn').addEventListener('click', () => copyText(outputText.value, 'Natija'));

$('swapBtn').addEventListener('click', () => {
  const map = {old_to_new:'new_to_old',cyrillic_to_new:'new_to_cyrillic',new_to_old:'old_to_new',new_to_cyrillic:'cyrillic_to_new'};
  convertMode.value = map[convertMode.value] || 'old_to_new';
  const source = inputText.value;
  inputText.value = outputText.value;
  renderResult(source);
  triggerConversion();
});

async function downloadBlob(response, filename) {
  if (!response.ok) {
    let message = 'Fayl tayyorlanmadi.';
    try { message = (await response.json()).error || message; } catch {}
    throw new Error(message);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
async function downloadTextFile(format) {
  if (!outputText.value.trim()) return fileStatus.textContent = 'Avval matn kiriting.';
  fileStatus.textContent = format.toUpperCase() + ' tayyorlanmoqda...';
  try {
    if (format === 'docx' && originalDocx) {
      const form = new FormData();
      form.append('file', originalDocx);
      form.append('mode', convertMode.value === 'cyrillic_to_new' ? 'old_to_new' : convertMode.value);
      const response = await fetch('/api/convert-docx',{method:'POST',body:form});
      await downloadBlob(response, originalDocx.name.replace(/\.docx$/i,'') + '_nexuz.docx');
    } else {
      const response = await fetch('/api/download-file',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({text:outputText.value,format,filename:originalDocx ? originalDocx.name : 'matn'})
      });
      await downloadBlob(response, 'nexuz_natija.' + format);
    }
    fileStatus.textContent = '✓ Fayl yuklab olindi';
  } catch (error) { fileStatus.textContent = '⚠ ' + error.message; }
}
$('dlDocx').addEventListener('click', () => downloadTextFile('docx'));
$('dlTxt').addEventListener('click', () => downloadTextFile('txt'));
$('dlPdf').addEventListener('click', () => downloadTextFile('pdf'));
$('dlTelegram').addEventListener('click', () => {
  if (!outputText.value.trim()) return fileStatus.textContent = 'Avval matn kiriting.';
  copyText('*NexUz orqali o‘girilgan matn*\n\n' + outputText.value, 'Telegram matni');
});

$('shareBtn').addEventListener('click', async () => {
  if (!outputText.value.trim()) return $('shareStatus').textContent = 'Ulashish uchun avval matn kiriting.';
  const payload = JSON.stringify({text:inputText.value,mode:convertMode.value});
  const encoded = btoa(unescape(encodeURIComponent(payload)));
  const url = location.origin + location.pathname + '#share=' + encoded;
  try {
    await navigator.clipboard.writeText(url);
    $('shareStatus').textContent = 'Havola nusxalandi. Uni yuborgan odam matnni NexUz’da ochishi mumkin.';
  } catch {
    $('shareStatus').textContent = url;
  }
});
function loadSharedText() {
  const match = location.hash.match(/(?:^#|&)share=([^&]+)/);
  if (!match) return;
  try {
    const payload = JSON.parse(decodeURIComponent(escape(atob(match[1]))));
    if (payload.text) {
      inputText.value = payload.text;
      convertMode.value = payload.mode || 'old_to_new';
      triggerConversion(false);
      $('shareStatus').textContent = 'Ulashilgan matn ochildi.';
    }
  } catch { $('shareStatus').textContent = 'Ulashish havolasi yaroqsiz.'; }
}
loadSharedText();

// Daily letter card
const letters = [
  {letter:'Ğ',title:'G‘ → Ğ',description:'“G‘alaba” so‘zidagi G‘ harfi yangi yozuvda Ğ shaklida yoziladi.'},
  {letter:'Ö',title:'O‘ → Ö',description:'“O‘zbekiston” so‘zidagi O‘ harfi yangi yozuvda Ö shaklida yoziladi.'},
  {letter:'Ş',title:'Sh → Ş',description:'“Shahar” so‘zidagi Sh harfi yangi yozuvda Ş shaklida yoziladi.'},
  {letter:'Ç',title:'Ch → Ç',description:'“Chiroy” so‘zidagi Ch harfi yangi yozuvda Ç shaklida yoziladi.'}
];
let dailyIndex = (Math.floor(Date.now()/86400000) % letters.length);
function renderDaily() {
  const item = letters[dailyIndex];
  $('dailyLetter').textContent = item.letter;
  $('dailyTitle').textContent = item.title;
  $('dailyDescription').textContent = item.description;
}
$('nextLetterBtn').addEventListener('click', () => { dailyIndex = (dailyIndex + 1) % letters.length; renderDaily(); });
renderDaily();

// Mini quiz
const questions = [
  {q:'“Sh” harfining yangi shakli qaysi?',options:['Ş','Ç','Ğ','Ö'],answer:'Ş'},
  {q:'“G‘” harfi yangi alifboda qanday yoziladi?',options:['Ö','Ğ','Ş','Ç'],answer:'Ğ'},
  {q:'“O‘” harfining yangi shaklini toping.',options:['Ç','Ş','Ğ','Ö'],answer:'Ö'},
  {q:'“Ch” harfi yangi alifboda qaysi belgi bilan yoziladi?',options:['Ğ','Ö','Ç','Ş'],answer:'Ç'}
];
let questionIndex = 0;
let answered = false;
function renderQuestion() {
  const q = questions[questionIndex];
  $('quizProgress').textContent = (questionIndex+1) + ' / ' + questions.length;
  $('quizQuestion').textContent = q.q;
  $('quizFeedback').textContent = '';
  $('nextQuestionBtn').disabled = true;
  $('nextQuestionBtn').textContent = questionIndex === questions.length-1 ? 'Qayta boshlash ↻' : 'Keyingi savol →';
  answered = false;
  $('quizOptions').innerHTML = q.options.map(option => '<button class="quiz-option" type="button" data-answer="' + option + '">' + option + '</button>').join('');
  $('quizOptions').querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
    if (answered) return;
    answered = true;
    const correct = button.dataset.answer === q.answer;
    button.classList.add(correct ? 'correct' : 'wrong');
    $('quizOptions').querySelectorAll('[data-answer]').forEach(option => {
      option.disabled = true;
      if (option.dataset.answer === q.answer) option.classList.add('correct');
    });
    $('quizFeedback').textContent = correct ? 'To‘g‘ri! Barakalla.' : 'To‘g‘ri javob: ' + q.answer;
    $('nextQuestionBtn').disabled = false;
  }));
}
$('nextQuestionBtn').addEventListener('click', () => { questionIndex = (questionIndex + 1) % questions.length; renderQuestion(); });
renderQuestion();
renderHistory();
updateCounters();
