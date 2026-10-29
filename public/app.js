const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const convertMode = document.getElementById('convertMode');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const fileInput = document.getElementById('fileInput');
const fileStatus = document.getElementById('fileStatus');
const dlDocx = document.getElementById('dlDocx');
const dlTxt = document.getElementById('dlTxt');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

// PDF.js worker sozlamasi
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Fayl yuklanganda o'qish va transliteratsiya qilish
fileInput.addEventListener('change', async(e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileStatus.textContent = '⏳ Fayl o‘qilmoqda: ' + file.name;
    const ext = file.name.split('.').pop().toLowerCase();

    // 1. PDF FAYLLAR UCHUN (Brauzerda xatosiz o'qish)
    if (ext === 'pdf') {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            if (!fullText.trim()) {
                alert("PDF fayl skanerlangan rasm ko'rinishida yoki matn topilmadi.");
                fileStatus.textContent = '❌ Matn topilmadi';
                return;
            }

            inputText.value = fullText;
            fileStatus.textContent = '✅ ' + file.name + ' (PDF o‘qildi)';
            triggerConversion();
        } catch (error) {
            console.error(error);
            alert("PDF faylini o‘qishda xatolik yuz berdi.");
            fileStatus.textContent = '❌ Xatolik';
        }
    }
    // 2. DOCX VA TXT FAYLLAR UCHUN (Server orqali)
    else {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/parse-file', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            inputText.value = data.text;
            fileStatus.textContent = '✅ ' + file.name;
            triggerConversion();
        } else {
            alert(data.error || "Faylni o‘qishda xatolik yuz berdi!");
            fileStatus.textContent = '';
        }
    }
});
// 1. Dark / Light Mode Switcher
themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '🌙';
    }
});

// 2. Auto-Resize Textarea
function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.max(380, el.scrollHeight) + 'px';
}

// 3. Real time conversion
async function triggerConversion() {
    autoResize(inputText);

    if (!inputText.value.trim()) {
        outputText.value = '';
        autoResize(outputText);
        return;
    }

    const res = await fetch('/api/convert-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text: inputText.value,
            mode: convertMode.value
        })
    });

    const data = await res.json();
    outputText.value = data.result;
    autoResize(outputText);
}

inputText.addEventListener('input', triggerConversion);
convertMode.addEventListener('change', triggerConversion);

// Swap yo'nalish
swapBtn.addEventListener('click', () => {
    if (convertMode.value === 'old_to_new') {
        convertMode.value = 'new_to_old';
    } else {
        convertMode.value = 'old_to_new';
    }
    triggerConversion();
});

// Fayl yuklash
fileInput.addEventListener('change', async(e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileStatus.textContent = '⏳ Fayl o‘qilmoqda: ' + file.name;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/parse-file', {
        method: 'POST',
        body: formData
    });

    const data = await res.json();

    if (res.ok) {
        inputText.value = data.text;
        fileStatus.textContent = '✅ Fayl muvaffaqiyatli yuklandi: ' + file.name;
        triggerConversion();
    } else {
        alert(data.error || "Faylni o‘qishda xatolik yuz berdi!");
        fileStatus.textContent = '';
    }
});

// Tozalash
clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    fileInput.value = '';
    fileStatus.textContent = '';
    autoResize(inputText);
    autoResize(outputText);
});

// Nusxalash
copyBtn.addEventListener('click', () => {
    if (outputText.value) {
        navigator.clipboard.writeText(outputText.value);
        alert('Nusxalandi!');
    }
});

// Yuklab olish
async function downloadFile(format) {
    if (!outputText.value) {
        alert("Yuklab olish uchun matn mavjud emas!");
        return;
    }

    const res = await fetch('/api/download-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text: outputText.value,
            format: format,
            filename: fileInput.files[0] ? fileInput.files[0].name : 'matn'
        })
    });

    if (res.ok) {
        const blob = await res.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `o_girilgan.${format}`;
        link.click();
    }
}

dlDocx.addEventListener('click', (e) => {
    e.preventDefault();
    downloadFile('docx');
});
dlTxt.addEventListener('click', (e) => {
    e.preventDefault();
    downloadFile('txt');
});