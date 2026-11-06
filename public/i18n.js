(function () {
  'use strict';
  var dictionaries = {
    uz: {
      nav_try:'Sinab ko‘ring',nav_alphabet:'Alifbo',nav_features:'Imkoniyatlar',nav_learn:'O‘rganish',open_converter:'Konverterni ochish',
      hero_title:'Eski yozuvni yangi alifboga o‘giring',hero_sub:'Kirill yoki eski lotin matnini yozing yoki hujjatni yuklang. NexUz uni yangi lotin alifbosiga — Ğ, Ö, Ş, Ç harflari bilan — o‘girib beradi.',
      view_alphabet:'Alifboni ko‘rish',demo_title:'Yozing — o‘zi o‘giriladi',demo_sub:'Yo‘nalishni tanlang va matnni kiriting. Natija siz yozayotgan paytda chiqadi.',
      mode_old_new:'Eski lotin → yangi lotin',mode_cyr_new:'Kirill → yangi lotin',mode_new_old:'Yangi lotin → eski lotin',mode_new_cyr:'Yangi lotin → kirill',
      input_text:'Kiruvchi matn',copy:'Nusxalash',clear:'Tozalash',input_placeholder:'Matnni shu yerga yozing…',new_latin:'Yangi lotin',output_placeholder:'Natija shu yerda ko‘rinadi',
      alphabet_title:'Alifbo kitobi',cyrillic:'Кирилл',old_latin:'Eski lotin',features_title:'Matn ham, hujjat ham',features_sub:'Qisqa jumla yoki butun hujjat — hammasi bir joyda o‘giriladi.',
      feature_letters:'To‘rtta yangi harf',feature_letters_desc:'G‘ → Ğ, O‘ → Ö, Sh → Ş va Ch → Ç. Alifbo kitobida uchala yozuv yonma-yon taqqoslanadi.',
      feature_modes:'To‘rt konvertatsiya yo‘nalishi',feature_modes_desc:'Eski lotin → yangi lotin, kirill → yangi lotin, yangi lotin → eski lotin va yangi lotin → kirill.',
      feature_docx:'Word formatini saqlash',feature_docx_desc:'DOCX ichidagi matn almashtiriladi; jadvallar, rasmlar va hujjatning asosiy tuzilmasi saqlanadi.',
      feature_highlight:'O‘zgargan harflar ajralib turadi',feature_highlight_desc:'Natijada yangi alifboga o‘tgan Ğ, Ö, Ş va Ç harflari rang bilan belgilanadi.',
      feature_exceptions:'So‘z istisnolari',feature_exceptions_desc:'“Yoqut” kabi so‘zlar uchun maxsus lug‘at qoidalari qo‘llanadi.',
      feature_history:'Tarix va ulashish',feature_history_desc:'Oxirgi konvertatsiyalar brauzerda saqlanadi. Matnni havola orqali ulashish mumkin.',
      feature_learning:'Alifboni o‘rganish',feature_learning_desc:'Kun harfi va mini-test yordamida yangi harflarni mashq qiling.',
      feature_telegram:'Telegram bilan ishlash',feature_telegram_desc:'Telegram uchun tayyor matn nusxalanadi. Botni ham umumiy konvertatsiya qoidalariga ulash mumkin.',
      final_title:'Birinchi matningizni o‘giring',final_sub:'Ro‘yxatdan o‘tish shart emas. Konverterni oching, matn yozing yoki hujjat yuklang.',github_link:'Kodni GitHub’da ko‘rish',
      nav_home:'Bosh sahifa',nav_converter:'Konvertor',nav_about:'Loyiha haqida',try_now:'Sinab ko‘rish <span>↗</span>',hero_eyebrow:'O‘zbek yozuvi uchun yangi tajriba',
      hero_lead:'O‘zbek matnlarini yangi lotin yozuviga o‘giring, to‘rtta yangi harfni kashf qiling va alifboni interaktiv tarzda o‘rganing.',
      hero_proof:'4 ta o‘ziga xos harf · Bitta qulay platforma',direction:'YO‘NALISH',upload:'＋ Hujjat yuklash',source:'MANBA',auto_process:'Matn avtomatik qayta ishlanadi',
      result:'NATIJA',output_text:'Yangi matn',copy_result:'Natijani nusxalash ↗',changed_letters:'O‘zgargan harflar',download:'YUKLAB OLISH',
      telegram_copy:'Telegram uchun nusxalash',share_link:'Ulashish havolasini yaratish <span>↗</span>',privacy_note:'Matningiz brauzeringiz tarixida saqlanadi. Maxfiy hujjatlarni ulashishdan oldin havolada matn bo‘lishini yodda tuting.',
      converter_hero_title:'Yozuvni <span class="gradient-text">yangicha</span><br>his qiling.',
      converter_title:'Matningizga yangi <span class="gradient-text">shakl bering.</span>',converter_sub:'Matn kiriting yoki hujjat yuklang. Natija avtomatik tayyor bo‘ladi.',
      alphabet_heading:'Uch yozuv. <span class="gradient-text">Bitta alifbo tarixi.</span>',alphabet_sub:'Kirill, eski lotin va yangi lotin yozuvlaridagi harf shakllarini solishtiring.',
      learn_heading:'O‘rganing. <span class="gradient-text">Sinab ko‘ring.</span>',learn_sub:'Har kuni bitta harf va qisqa savol bilan yangi alifboni o‘zlashtiring.',
      interactive_alphabet:'INTERAKTIV ALIFBO',quick_convert:'01 / TEZKOR KONVERTATSIYA',alphabet_book:'02 / ALIFBO KITOBI',learning_area:'03 / O‘RGANISH MAYDONI',about_nexuz:'NEXUZ HAQIDA'
    },
    ru: {
      nav_try:'Попробовать',nav_alphabet:'Алфавит',nav_features:'Возможности',nav_learn:'Обучение',open_converter:'Открыть конвертер',
      hero_title:'Переводите старое письмо в новый алфавит',hero_sub:'Введите текст на кириллице или старой латинице либо загрузите документ. NexUz преобразует его в новую латиницу с буквами Ğ, Ö, Ş, Ç.',
      view_alphabet:'Посмотреть алфавит',demo_title:'Пишите — текст преобразуется автоматически',demo_sub:'Выберите направление и введите текст. Результат появится сразу.',
      mode_old_new:'Старая латиница → новая латиница',mode_cyr_new:'Кириллица → новая латиница',mode_new_old:'Новая латиница → старая латиница',mode_new_cyr:'Новая латиница → кириллица',
      input_text:'Исходный текст',copy:'Копировать',clear:'Очистить',input_placeholder:'Введите текст здесь…',new_latin:'Новая латиница',output_placeholder:'Здесь появится результат',
      alphabet_title:'Книга алфавита',cyrillic:'Кириллица',old_latin:'Старая латиница',features_title:'Текст и документы',features_sub:'Преобразуйте короткую фразу или целый документ в одном месте.',
      feature_letters:'Четыре новые буквы',feature_letters_desc:'G‘ → Ğ, O‘ → Ö, Sh → Ş и Ch → Ç. В книге алфавита сравниваются все три системы письма.',
      feature_modes:'Четыре направления преобразования',feature_modes_desc:'Старая латиница → новая, кириллица → новая латиница, новая латиница → старая и новая латиница → кириллица.',
      feature_docx:'Сохранение формата Word',feature_docx_desc:'Текст в DOCX заменяется, а таблицы, изображения и основная структура документа сохраняются.',
      feature_highlight:'Изменённые буквы выделяются',feature_highlight_desc:'Буквы Ğ, Ö, Ş и Ç в результате выделяются цветом.',
      feature_exceptions:'Особые правила для слов',feature_exceptions_desc:'Для слов вроде «Yoqut» применяются специальные словарные правила.',
      feature_history:'История и обмен',feature_history_desc:'Последние преобразования сохраняются в браузере. Текстом можно поделиться по ссылке.',
      feature_learning:'Изучение алфавита',feature_learning_desc:'Практикуйте новые буквы с помощью ежедневной буквы и мини-теста.',
      feature_telegram:'Интеграция с Telegram',feature_telegram_desc:'Подготовленный текст можно скопировать для Telegram. Бота также можно подключить к общим правилам преобразования.',
      final_title:'Преобразуйте свой первый текст',final_sub:'Регистрация не нужна. Откройте конвертер, введите текст или загрузите документ.',github_link:'Посмотреть код на GitHub',
      nav_home:'Главная',nav_converter:'Конвертер',nav_about:'О проекте',try_now:'Попробовать <span>↗</span>',hero_eyebrow:'Новый подход к узбекской письменности',
      hero_lead:'Преобразуйте узбекский текст в новую латиницу, откройте четыре новые буквы и изучайте алфавит интерактивно.',
      hero_proof:'4 особые буквы · Одна удобная платформа',direction:'НАПРАВЛЕНИЕ',upload:'＋ Загрузить документ',source:'ИСТОЧНИК',auto_process:'Текст обрабатывается автоматически',
      result:'РЕЗУЛЬТАТ',output_text:'Новый текст',copy_result:'Скопировать результат ↗',changed_letters:'Изменённые буквы',download:'СКАЧАТЬ',
      telegram_copy:'Скопировать для Telegram',share_link:'Создать ссылку для обмена <span>↗</span>',privacy_note:'Текст сохраняется в истории браузера. Помните, что ссылка для обмена содержит ваш текст.',
      converter_hero_title:'Почувствуйте <span class="gradient-text">новое</span><br>написание.',converter_title:'Придайте тексту <span class="gradient-text">новую форму.</span>',
      converter_sub:'Введите текст или загрузите документ. Результат появится автоматически.',alphabet_heading:'Три системы письма. <span class="gradient-text">Одна история алфавита.</span>',
      alphabet_sub:'Сравните буквы в кириллице, старой и новой латинице.',learn_heading:'Изучайте. <span class="gradient-text">Практикуйтесь.</span>',
      learn_sub:'Осваивайте новый алфавит с ежедневной буквой и коротким вопросом.',interactive_alphabet:'ИНТЕРАКТИВНЫЙ АЛФАВИТ',
      quick_convert:'01 / БЫСТРОЕ ПРЕОБРАЗОВАНИЕ',alphabet_book:'02 / КНИГА АЛФАВИТА',learning_area:'03 / ОБУЧЕНИЕ',about_nexuz:'О ПРОЕКТЕ NEXUZ'
    },
    en: {
      nav_try:'Try it',nav_alphabet:'Alphabet',nav_features:'Features',nav_learn:'Learn',open_converter:'Open converter',
      hero_title:'Convert traditional writing into the new alphabet',hero_sub:'Type Cyrillic or traditional Latin text, or upload a document. NexUz converts it to the new Latin alphabet with Ğ, Ö, Ş and Ç.',
      view_alphabet:'Explore the alphabet',demo_title:'Type — it converts instantly',demo_sub:'Choose a direction and enter your text. The result appears as you type.',
      mode_old_new:'Old Latin → New Latin',mode_cyr_new:'Cyrillic → New Latin',mode_new_old:'New Latin → Old Latin',mode_new_cyr:'New Latin → Cyrillic',
      input_text:'Input text',copy:'Copy',clear:'Clear',input_placeholder:'Type your text here…',new_latin:'New Latin',output_placeholder:'Your result will appear here',
      alphabet_title:'Alphabet book',cyrillic:'Cyrillic',old_latin:'Old Latin',features_title:'Text and documents',features_sub:'Convert a short sentence or an entire document in one place.',
      feature_letters:'Four new letters',feature_letters_desc:'G‘ → Ğ, O‘ → Ö, Sh → Ş and Ch → Ç. Compare all three writing systems in the alphabet book.',
      feature_modes:'Four conversion directions',feature_modes_desc:'Old Latin → New Latin, Cyrillic → New Latin, New Latin → Old Latin, and New Latin → Cyrillic.',
      feature_docx:'Preserve Word formatting',feature_docx_desc:'Text in DOCX files is converted while tables, images and the document structure are preserved.',
      feature_highlight:'Changed letters are highlighted',feature_highlight_desc:'The converted letters Ğ, Ö, Ş and Ç are highlighted in the result.',
      feature_exceptions:'Word-specific exceptions',feature_exceptions_desc:'Special dictionary rules are applied to words such as “Yoqut”.',
      feature_history:'History and sharing',feature_history_desc:'Recent conversions are saved in your browser. You can share text using a link.',
      feature_learning:'Learn the alphabet',feature_learning_desc:'Practise the new letters with a letter of the day and a mini quiz.',
      feature_telegram:'Telegram support',feature_telegram_desc:'Copy prepared text for Telegram. The bot can also use the shared conversion rules.',
      final_title:'Convert your first text',final_sub:'No registration required. Open the converter, type text or upload a document.',github_link:'View the code on GitHub',
      nav_home:'Home',nav_converter:'Converter',nav_about:'About',try_now:'Try it <span>↗</span>',hero_eyebrow:'A new experience for Uzbek writing',
      hero_lead:'Convert Uzbek text to the new Latin script, discover four new letters and explore the alphabet interactively.',
      hero_proof:'4 distinctive letters · One simple platform',direction:'DIRECTION',upload:'＋ Upload document',source:'SOURCE',auto_process:'Text is processed automatically',
      result:'RESULT',output_text:'Converted text',copy_result:'Copy result ↗',changed_letters:'Changed letters',download:'DOWNLOAD',
      telegram_copy:'Copy for Telegram',share_link:'Create a share link <span>↗</span>',privacy_note:'Your text is saved in your browser history. Remember that shared links contain your text.',
      converter_hero_title:'Experience a <span class="gradient-text">new</span><br>way to write.',converter_title:'Give your text a <span class="gradient-text">new form.</span>',
      converter_sub:'Enter text or upload a document. Your result is generated automatically.',alphabet_heading:'Three scripts. <span class="gradient-text">One alphabet story.</span>',
      alphabet_sub:'Compare the Cyrillic, old Latin and new Latin letter forms.',learn_heading:'Learn. <span class="gradient-text">Practise.</span>',
      learn_sub:'Build your knowledge with a daily letter and a short question.',interactive_alphabet:'INTERACTIVE ALPHABET',
      quick_convert:'01 / QUICK CONVERSION',alphabet_book:'02 / ALPHABET BOOK',learning_area:'03 / LEARNING SPACE',about_nexuz:'ABOUT NEXUZ'
    }
  };
  var language = 'uz';
  try { language = localStorage.getItem('nexuz-language') || 'uz'; } catch (e) {}
  if (!dictionaries[language]) language = 'uz';
  function t(key) { return (dictionaries[language] && dictionaries[language][key]) || dictionaries.uz[key] || key; }
  function apply() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t(key)) el.innerHTML = t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (t(key)) el.innerHTML = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    var selector = document.getElementById('languageSelect');
    if (selector) selector.value = language;
    document.title = language === 'ru' ? 'NexUz — конвертер узбекской письменности' :
      language === 'en' ? 'NexUz — Uzbek writing converter' : 'NexUz — yangi o‘zbek alifbosiga o‘giring';
  }
  function setLanguage(next) {
    if (!dictionaries[next]) return;
    language = next;
    try { localStorage.setItem('nexuz-language', next); } catch (e) {}
    apply();
    window.dispatchEvent(new CustomEvent('nexuz:languagechange', { detail: { language: language } }));
  }
  window.NexUzI18n = { t: t, getLanguage: function () { return language; }, setLanguage: setLanguage };
  document.addEventListener('DOMContentLoaded', function () {
    var selector = document.getElementById('languageSelect');
    if (selector) selector.addEventListener('change', function () { setLanguage(selector.value); });
    apply();
  });
  if (document.readyState !== 'loading') {
    var selector = document.getElementById('languageSelect');
    if (selector) selector.addEventListener('change', function () { setLanguage(selector.value); });
    apply();
  }
})();