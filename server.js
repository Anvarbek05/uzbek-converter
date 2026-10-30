const express = require('express');
const fileUpload = require('express-fileupload');
const AdmZip = require('adm-zip');
const pdfParse = require('pdf-parse');
const path = require('path');

const app = express();
app.use(express.static('public'));
app.use(fileUpload());
app.use(express.json());

// 1. ESKI LOTIN / KIRILL -> YANGI LOTIN
function convertToNewLatin(text) {
    if (!text) return '';
    let result = text.replace(/['‘`’]/g, "‘");

    result = result
        // So'z boshidagi va unlilardan keyingi Ye/ye qoidasi
        .replace(/(^|[\s\n\t,.\?!"'“«(])Е/g, '$1Ye').replace(/(^|[\s\n\t,.\?!"'“«(])е/g, '$1ye')
        .replace(/([АEИОУЎЭЮЯаеиоуўэюя‘])Е/g, '$1Ye').replace(/([АEИОУЎЭЮЯаеиоуўэюя‘])е/g, '$1ye')

    // Kirillchada maxsus Uzbek harflari (Ğ, Ö, Ş, Ç, Q)[cite: 9]
    .replace(/Ғ/g, 'Ğ').replace(/ғ/g, 'ğ')
        .replace(/Ў/g, 'Ö').replace(/ў/g, 'ö')
        .replace(/Ш/g, 'Ş').replace(/ш/g, 'ş')
        .replace(/Ч/g, 'Ç').replace(/ч/g, 'ç')
        .replace(/Қ/g, 'Q').replace(/қ/g, 'q') // <-- Қ / қ harfi qo'shildi!

    // Murakkab va qo'shaloq harflar
    .replace(/Ё/g, 'Yo').replace(/ё/g, 'yo')
        .replace(/Ю/g, 'Yu').replace(/ю/g, 'yu')
        .replace(/Я/g, 'Ya').replace(/я/g, 'ya')
        .replace(/Ц/g, 'Ts').replace(/ц/g, 'ts')
        .replace(/Щ/g, 'Şç').replace(/щ/g, 'şç')

    // Standart Kirill harflari
    .replace(/А/g, 'A').replace(/а/g, 'a')
        .replace(/Б/g, 'B').replace(/б/g, 'b')
        .replace(/В/g, 'V').replace(/в/g, 'v')
        .replace(/Г/g, 'G').replace(/г/g, 'g')
        .replace(/Д/g, 'D').replace(/д/g, 'd')
        .replace(/Е/g, 'E').replace(/е/g, 'e')
        .replace(/Ж/g, 'J').replace(/ж/g, 'j')
        .replace(/З/g, 'Z').replace(/з/g, 'z')
        .replace(/И/g, 'I').replace(/и/g, 'i')
        .replace(/Й/g, 'Y').replace(/й/g, 'y')
        .replace(/К/g, 'K').replace(/к/g, 'k')
        .replace(/Л/g, 'L').replace(/л/g, 'l')
        .replace(/М/g, 'M').replace(/м/g, 'm')
        .replace(/Н/g, 'N').replace(/н/g, 'n')
        .replace(/О/g, 'O').replace(/о/g, 'o')
        .replace(/П/g, 'P').replace(/п/g, 'p')
        .replace(/Р/g, 'R').replace(/р/g, 'r')
        .replace(/С/g, 'S').replace(/с/g, 's')
        .replace(/Т/g, 'T').replace(/т/g, 't')
        .replace(/У/g, 'U').replace(/у/g, 'u')
        .replace(/Ф/g, 'F').replace(/ф/g, 'f')
        .replace(/Х/g, 'X').replace(/х/g, 'x')
        .replace(/Ҳ/g, 'H').replace(/ҳ/g, 'h')
        .replace(/Э/g, 'E').replace(/э/g, 'e')
        .replace(/Ъ/g, '‘').replace(/ъ/g, '‘')
        .replace(/Ь/g, '').replace(/ь/g, '')

    // Eski lotin alifbosidan yangisiga o'girish qoidalari (Ğ, Ö, Ş, Ç)[cite: 9]
    .replace(/SH/g, 'Ş').replace(/Sh/g, 'Ş').replace(/sh/g, 'ş')
        .replace(/CH/g, 'Ç').replace(/Ch/g, 'Ç').replace(/ch/g, 'ç')
        .replace(/G‘/g, 'Ğ').replace(/g‘/g, 'ğ')
        .replace(/O‘/g, 'Ö').replace(/o‘/g, 'ö');

    return result;
}
// 2. YANGI LOTIN -> ESKI LOTIN (Katta harflar to'g'rilangan mantiq)
function convertToOldLatin(text) {
    if (!text) return '';
    let res = text;

    // To'liq katta harflar holatlarini to'g'rilash (masalan: ŞAXS -> SHAXS)
    res = res.replace(/Ş(?=[A-ZĞÖIİEOUÁÝÂÊÎÔÛDŽÇŞA-Z])/g, "SH");
    res = res.replace(/Ç(?=[A-ZĞÖIİEOUÁÝÂÊÎÔÛDŽÇŞA-Z])/g, "CH");
    res = res.replace(/Ğ(?=[A-ZĞÖIİEOUÁÝÂÊÎÔÛDŽÇŞA-Z])/g, "G‘");
    res = res.replace(/Ö(?=[A-ZĞÖIİEOUÁÝÂÊÎÔÛDŽÇŞA-Z])/g, "O‘");

    // Boshqa standart holatlar
    return res
        .replace(/Ğ/g, "G‘").replace(/ğ/g, "g‘")
        .replace(/Ö/g, "O‘").replace(/ö/g, "o‘")
        .replace(/Ş/g, "Sh").replace(/ş/g, "sh")
        .replace(/Ç/g, "Ch").replace(/ç/g, "ch");
}

// 3. YANGI LOTIN -> KIRILL
function convertToCyrillic(text) {
    if (!text) return '';
    let res = convertToOldLatin(text);

    const map = {
        'Ye': 'Е',
        'ye': 'е',
        'Yo': 'Ё',
        'yo': 'ё',
        'Yu': 'Ю',
        'yu': 'ю',
        'Ya': 'Я',
        'ya': 'я',
        'Ts': 'Ц',
        'ts': 'ц',
        'SH': 'Ш',
        'Sh': 'Ш',
        'sh': 'ш',
        'CH': 'Ч',
        'Ch': 'Ч',
        'ch': 'ч',
        'G‘': 'Ғ',
        'g‘': 'ғ',
        'O‘': 'Ў',
        'o‘': 'ў',
        'A': 'А',
        'a': 'а',
        'B': 'Б',
        'b': 'б',
        'V': 'В',
        'v': 'в',
        'G': 'Г',
        'g': 'г',
        'D': 'Д',
        'd': 'д',
        'E': 'Э',
        'e': 'э',
        'J': 'Ж',
        'j': 'ж',
        'Z': 'З',
        'z': 'з',
        'I': 'И',
        'i': 'и',
        'Y': 'Й',
        'y': 'й',
        'K': 'К',
        'k': 'к',
        'L': 'Л',
        'l': 'л',
        'M': 'М',
        'm': 'м',
        'N': 'Н',
        'n': 'н',
        'O': 'О',
        'o': 'о',
        'P': 'П',
        'p': 'п',
        'R': 'Р',
        'r': 'р',
        'S': 'С',
        's': 'с',
        'T': 'Т',
        't': 'т',
        'U': 'У',
        'u': 'у',
        'F': 'Ф',
        'f': 'ф',
        'X': 'Х',
        'x': 'х',
        'H': 'Ҳ',
        'h': 'ҳ',
        '‘': 'Ъ'
    };

    for (let k in map) {
        res = res.replace(new RegExp(k, 'g'), map[k]);
    }
    return res;
}

function processConversion(text, mode) {
    if (mode === 'new_to_old') return convertToOldLatin(text);
    if (mode === 'new_to_cyrillic') return convertToCyrillic(text);
    return convertToNewLatin(text);
}

app.post('/api/convert-text', (req, res) => {
    const { text, mode } = req.body;
    res.json({ result: processConversion(text, mode) });
});

app.post('/api/parse-file', async(req, res) => {
    if (!req.files || !req.files.file) return res.status(400).send('Fayl yuklanmadi');

    try {
        const file = req.files.file;
        const ext = path.extname(file.name).toLowerCase();
        let text = '';

        if (ext === '.txt') {
            text = file.data.toString('utf-8');
        } else if (ext === '.docx') {
            const zip = new AdmZip(file.data);
            let xml = zip.readAsText('word/document.xml');
            text = xml.replace(/<[^>]+>/g, ' ');
        } else if (ext === '.pdf') {
            try {
                const parsed = await pdfParse(file.data);
                text = parsed.text;
                if (!text.trim()) {
                    return res.status(422).json({ error: 'PDF skanerlangan rasm ko‘rinishida. Matn topilmadi.' });
                }
            } catch (e) {
                return res.status(422).json({ error: 'PDF fayl shifrlangan yoki o‘qib bo‘lmadi.' });
            }
        }

        res.json({ text: text });
    } catch (err) {
        res.status(500).json({ error: 'Faylni o‘qishda xatolik yuz berdi' });
    }
});

const { Document, Packer, Paragraph, TextRun } = require('docx');

// DOCX fayl yuklab olish API (100% ochiladigan standart Word hujjatini yaratish)
app.post('/api/download-file', async(req, res) => {
    const { text, format, filename } = req.body;
    const baseName = filename ? filename.split('.')[0] : 'o_girilgan';

    // 1. TXT formatida yuklash
    if (format === 'txt') {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${baseName}.txt"`);
        return res.send(Buffer.from(text, 'utf-8'));
    }

    // 2. DOCX formatida standart Word hujjatini yaratish
    if (format === 'docx') {
        try {
            // Matnni abzaslar bo'yicha bo'lib, Word Paragraph obyektiga o'tkazish
            const paragraphs = text.split('\n').map(line => {
                return new Paragraph({
                    children: [
                        new TextRun({
                            text: line,
                            size: 24, // 12pt shrift
                            font: 'Arial'
                        })
                    ]
                });
            });

            // Hujjatni shakllantirish
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: paragraphs
                }]
            });

            // Buffer holatiga o'tkazish
            const buffer = await Packer.toBuffer(doc);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename="${baseName}.docx"`);
            return res.send(buffer);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'DOCX faylini shakllantirishda xatolik yuz berdi' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda ishga tushdi`));