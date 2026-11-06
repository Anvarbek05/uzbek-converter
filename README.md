# NexUz

O‘zbek yozuvini eski lotin va kirill shakllaridan yangi lotin ko‘rinishiga o‘girish, yangi harflarni o‘rganish va matnlarni eksport qilish uchun platforma.

## Ishga tushirish

```bash
npm install
npm start
``

Brauzerda `http://localhost:3000` manzilini oching. Asosiy sahifa — `public/index.html`; barcha konvertatsiya va o‘rganish vositalari — `public/converter.html` sahifasida.

## Test

```bash
npm test
``

## Telegram botni ulash

Telegram bot webhook ishlashi uchun deployment muhitida quyidagi environment variable'larni belgilang:

- `TELEGRAM_BOT_TOKEN` — BotFather bergan bot tokeni.
- `TELEGRAM_WEBHOOK_SECRET` — webhook so‘rovini tekshirish uchun maxfiy qiymat.

Webhook URL: `https://SIZNING-DOMENINGIZ/api/telegram/webhook`

Webhookni Telegram Bot API orqali sozlaganingizdan so‘ng bot yuborilgan matnni NexUz'ning umumiy konvertatsiya modulidan o‘tkazadi. Tokenni hech qachon frontend kodiga yoki GitHub repozitoriyga yozmang.

## Hujjatlar

- TXT va PDF matni o‘qiladi.
- DOCX faylini matn sifatida ko‘rish mumkin.
- DOCX eksportida original Word paketi ichidagi matn tugunlari almashtiriladi; jadval, rasm, sahifa tuzilmasi va ko‘p formatlash elementlari saqlanadi.
- Oddiy matndan DOCX/TXT/PDF eksport qilish mavjud.

## Ulashish va tarix

Konvertatsiya tarixi shu brauzerning `localStorage` xotirasida saqlanadi. Ulashish havolasi matn va tanlangan yo‘nalishni URL fragmentida kodlaydi; havolani yuborishdan oldin matnda maxfiy ma’lumot yo‘qligiga ishonch hosil qiling.

## Eslatma

NexUz yangi lotin yozuvi uchun tajriba va o‘rganish loyihasidir. Harf va transliteratsiya qoidalarini rasmiy standart sifatida qabul qilishdan oldin mustaqil tekshirish lozim.
