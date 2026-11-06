# NexUz

NexUz — o‘zbek yozuvining kirill, eski lotin va yangi lotin ko‘rinishlari bilan ishlash, matnlarni konvertatsiya qilish va alifboni o‘rganish uchun veb-ilova.

## Ishga tushirish

Talablar: Node.js 20 yoki undan yangi versiya.

```bash
npm ci
npm start
```

Brauzerda `http://localhost:3000` manzilini oching.

- Asosiy sahifa: `public/index.html`
- Konvertor: `public/converter.html`
- Testlar: `npm test`

## Qo‘llab-quvvatlanadigan fayllar

- TXT — matnni o‘qish va eksport qilish.
- DOCX — matnni o‘qish, konvertatsiya qilish va DOCX sifatida eksport qilish.

PDF funksiyasi hozircha o‘chirib qo‘yilgan. PDF yuklash yoki PDF eksport qilish interfeysda mavjud emas.

## Maxfiy sozlamalar va environment variables

Maxfiy qiymatlarni faqat server muhitida saqlang. Lokal ishlab chiqishda root papkada `.env` faylidan, Render kabi hostingda esa xizmatning Environment/Environment Variables sozlamalaridan foydalaning.

1. `.env.example` faylini namuna sifatida ishlating.
2. Lokal maxfiy qiymatlarni `.env` fayliga yozing.
3. Haqiqiy `.env` faylini hech qachon GitHub’ga yuklamang.
4. `.env.example` ichiga faqat bo‘sh qiymatlar yoki maxfiy bo‘lmagan namuna nomlarini yozing.
5. `TELEGRAM_BOT_TOKEN` va `TELEGRAM_WEBHOOK_SECRET` qiymatlarini faqat server muhitida belgilang.
6. Hech qanday token, parol yoki API kalitini `public/` ichiga, HTML/JS fayllariga yoki README’ga joylamang.

Namuna:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=
PORT=3000
```

Telegram webhook maxfiy kaliti belgilanmagan bo‘lsa, endpoint so‘rovlarni rad etadi. Token yoki webhook kaliti oshkor bo‘lib qolsa, eski qiymatni darhol bekor qiling/almashtiring. Faylni repodan o‘chirishning o‘zi avvalgi Git tarixidan sirni yo‘q qilmaydi.

## Fayllar va maxfiylik

Yuklangan DOCX/TXT fayllar serverda xotirada qayta ishlanadi; ilova ularni doimiy fayl sifatida saqlash uchun diskka yozmaydi. Fayllar hajmi serverda cheklangan. Shunga qaramay, juda maxfiy hujjatlarni internetdagi xizmatga yuklashdan oldin tashkilotingiz yoki hujjat egasining ruxsatini oling.

Ulashish havolasi matnni URL fragmentida kodlaydi. Havolani olgan odam matnni ko‘ra oladi — maxfiy ma’lumotlarni ulashish havolasiga joylamang.

## Xavfsizlik tekshiruvlari

- `.gitignore` maxfiy muhit fayllari, dependency papkalari, loglar va lokal yuklamalarni Git’dan chetda qoldiradi.
- GitHub Actions’dagi Gitleaks tekshiruvi push va pull requestlarda tasodifan qo‘shilgan secretlarni qidiradi.
- GitHub repository Settings → Secrets and variables → Actions bo‘limida deploy uchun maxfiy qiymatlarni saqlang.
- Repository Settings → Security and analysis bo‘limida Secret scanning va Push protection mavjud bo‘lsa, yoqing.
- Dependabot orqali npm va GitHub Actions dependency yangilanishlarini kuzating.

## Telegram bot

Telegram webhook URL:

`https://SIZNING-DOMENINGIZ/api/telegram/webhook`

Webhookni sozlashda `TELEGRAM_WEBHOOK_SECRET` qiymatini Telegram webhook konfiguratsiyasiga ham bir xil qilib kiriting. `TELEGRAM_BOT_TOKEN` ni hech qachon frontendga yoki Git repozitoriyga yozmang.

## Xavfsizlik muammosini xabar qilish

Xavfsizlikka oid muammoni ommaviy issue yoki pull requestda maxfiy tafsilotlari bilan e’lon qilmang. GitHub repository sahifasidagi Security bo‘limida Private vulnerability reporting mavjud bo‘lsa, shu yo‘l orqali xabar bering.

## Loyiha haqida

NexUz yangi lotin yozuvi uchun tajriba va o‘rganish loyihasidir. Harf va transliteratsiya qoidalarini rasmiy standart sifatida qabul qilishdan oldin mustaqil tekshirish lozim.
