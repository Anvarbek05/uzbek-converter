const express = require('express');
const fileUpload = require('express-fileupload');
const AdmZip = require('adm-zip');
const path = require('path');
const { convert } = require('./lib/converter');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '12mb' }));
app.use(fileUpload({ limits: { fileSize: 15 * 1024 * 1024 }, abortOnLimit: true }));

app.post('/api/convert-text', (req, res) => {
  const { text = '', mode = 'old_to_new' } = req.body || {};
  if (typeof text !== 'string') return res.status(400).json({ error: 'Matn formati noto‘g‘ri.' });
  res.json({ result: convert(text, mode) });
});

function decodeXml(value) {
  return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}
function encodeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function extractDocxText(buffer) {
  const zip = new AdmZip(buffer);
  const xml = zip.readAsText('word/document.xml');
  if (!xml) throw new Error('DOCX document.xml topilmadi.');
  const blocks = [];
  const paragraphs = xml.match(/<w:p\b[\s\S]*?<\/w:p>/g) || [];
  for (const paragraph of paragraphs) {
    const runs = [...paragraph.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)];
    const line = runs.map(match => decodeXml(match[1])).join('');
    if (line) blocks.push(line);
  }
  return blocks.join('\n');
}
function convertDocxBuffer(buffer, mode) {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries().filter(entry =>
    /^word\/(document|header\d*|footer\d*|footnotes|endnotes)\.xml$/.test(entry.entryName)
  );
  if (!entries.some(entry => entry.entryName === 'word/document.xml')) {
    throw new Error('DOCX hujjat tarkibi topilmadi.');
  }
  for (const entry of entries) {
    const xml = entry.getData().toString('utf8');
    // Text nodes are changed in-place: paragraphs, tables, styles, images and layout remain in the ZIP.
    const updated = xml.replace(/(<w:t\b[^>]*>)([\s\S]*?)(<\/w:t>)/g, (_all, open, text, close) =>
      open + encodeXml(convert(decodeXml(text), mode)) + close
    );
    zip.updateFile(entry.entryName, Buffer.from(updated, 'utf8'));
  }
  return zip.toBuffer();
}

app.post('/api/parse-file', async (req, res) => {
  if (!req.files || !req.files.file) return res.status(400).json({ error: 'Fayl yuklanmadi.' });
  try {
    const file = req.files.file;
    const ext = path.extname(file.name).toLowerCase();
    let text = '';
    if (ext === '.txt') text = file.data.toString('utf8');
    else if (ext === '.docx') text = extractDocxText(file.data);
    else return res.status(415).json({ error: 'Faqat DOCX va TXT fayllar qabul qilinadi.' });
    res.json({ text, filename: file.name, format: ext.slice(1) });
  } catch (error) {
    console.error('parse-file:', error);
    res.status(422).json({ error: 'Faylni o‘qib bo‘lmadi. DOCX/PDF fayl buzilmaganini tekshiring.' });
  }
});

// Convert original DOCX package in-place so its Word structure, tables, pictures and formatting survive.
app.post('/api/convert-docx', async (req, res) => {
  if (!req.files || !req.files.file) return res.status(400).json({ error: 'DOCX fayl yuklanmadi.' });
  try {
    const file = req.files.file;
    if (path.extname(file.name).toLowerCase() !== '.docx') return res.status(415).json({ error: 'Bu funksiya faqat DOCX uchun.' });
    const mode = req.body.mode || 'old_to_new';
    const output = convertDocxBuffer(file.data, mode);
    const base = path.basename(file.name, path.extname(file.name)).replace(/[^\p{L}\p{N}_-]/gu, '_');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(base + '_nexuz.docx')}`);
    res.send(output);
  } catch (error) {
    console.error('convert-docx:', error);
    res.status(422).json({ error: 'DOCX hujjatini konvertatsiya qilib bo‘lmadi.' });
  }
});

app.post('/api/download-file', async (req, res) => {
  const { text = '', format, filename = 'matn' } = req.body || {};
  if (typeof text !== 'string') return res.status(400).json({ error: 'Matn noto‘g‘ri.' });
  const base = path.basename(filename, path.extname(filename)).replace(/[^\p{L}\p{N}_-]/gu, '_') || 'matn';
  if (format === 'txt') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(base + '_nexuz.txt')}`);
    return res.send(Buffer.from(text, 'utf8'));
  }
  if (format === 'docx') {
    try {
      const { Document, Packer, Paragraph, TextRun } = require('docx');
      const paragraphs = text.split(/\r?\n/).map(line => new Paragraph({
        children: [new TextRun({ text: line, font: 'Arial', size: 24 })]
      }));
      const buffer = await Packer.toBuffer(new Document({ sections: [{ children: paragraphs }] }));
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(base + '_nexuz.docx')}`);
      return res.send(buffer);
    } catch (error) {
      console.error('download docx:', error);
      return res.status(500).json({ error: 'DOCX yaratishda xatolik.' });
    }
  }
  return res.status(400).json({ error: 'Noma’lum format.' });
});

// Telegram bot webhook. Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET in deployment settings.
app.post('/api/telegram/webhook', async (req, res) => {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.get('x-telegram-bot-api-secret-token') !== secret) return res.sendStatus(401);
  res.sendStatus(200);
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const message = req.body && req.body.message;
  if (!token || !message || !message.text || !message.chat) return;
  const input = message.text.replace(/^\/start(?:@\w+)?\s*/, '').trim();
  if (!input) return;
  const output = convert(input, 'old_to_new');
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: message.chat.id, text: output })
    });
  } catch (error) {
    console.error('Telegram send error:', error);
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'NexUz' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NexUz server ${PORT}-portda ishga tushdi`));
