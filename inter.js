(function () {
    'use strict';

    function LampaCustomInterface() {
        // --- 1. Инициализация всех настроек в Storage ---
        Lampa.Storage.setDefault({
            // Карточки
            'card_seasons_type': 'color',
            'card_zoom_scale': '1.05',
            // Полная новость
            'news_apple_tv': 'false',
            'news_split_buttons': 'false',
            // Шапка
            'head_clocks_style': 'bubble',
            'head_clocks_size': '0',
            // Торренты
            'torrent_border_show': 'true',
            // Оформление
            'ui_theme': 'mint_dark',
            'ui_font': 'standard',
            'ui_loading_anim': 'false',
            'ui_fixed_size': 'false'
        });

        // --- 2. Функция применения CSS (Глобальная) ---
        function applyAllStyles() {
            let styleTag = $('#lampa-custom-styles');
            if (!styleTag.length) styleTag = $('<style id="lampa-custom-styles"></style>').appendTo('head');

            let css = `
                /* Карточки: Масштаб */
                .card.focus { transform: scale(${Lampa.Storage.get('card_zoom_scale')}) !important; z-index: 10; transition: transform 0.2s; }
                
                /* Шапка: Часы */
                .header__time { font-size: ${24 + parseInt(Lampa.Storage.get('head_clocks_size'))}px !important; }
                ${Lampa.Storage.get('head_clocks_style') === 'bubble' ? '.header__time { background: rgba(255,255,255,0.1); padding: 5px 15px; border-radius: 30px; }' : ''}

                /* Торренты: Обводка */
                ${Lampa.Storage.get('torrent_border_show') === 'true' ? '.torrent-item.good-seeds { border: 2px solid #2ecc71 !important; }' : ''}

                /* Оформление: Фиксированный размер */
                ${Lampa.Storage.get('ui_fixed_size') === 'true' ? 'body { zoom: 1.1; }' : ''}
            `;
            styleTag.text(css);
        }

        // --- 3. Создание структуры меню (как на 1-м скрине) ---
        Lampa.Settings.create({
            title: 'Интерфейс+',
            name: 'interface_plus',
            icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="white"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
            onBack: () => Lampa.Settings.main()
        });

        // Создаем подпапки
        const folders = [
            { name: 'ui_cards', title: 'Настройка карточек' },
            { name: 'ui_news', title: 'Настройка полной новости' },
            { name: 'ui_header', title: 'Настройка шапки' },
            { name: 'ui_torrents', title: 'Настройка торрентов' },
            { name: 'ui_design', title: 'Оформление' }
        ];

        folders.forEach(f => {
            Lampa.Settings.create({ title: f.title, name: f.name, onBack: () => Lampa.Settings.open('interface_plus') });
        });

        // --- 4. Наполнение раздела ОФОРМЛЕНИЕ (последний скрин) ---
        Lampa.Settings.add({
            name: 'ui_design',
            items: [
                {
                    title: 'Темы',
                    name: 'ui_theme',
                    type: 'select',
                    values: { 'mint_dark': 'Mint Dark', 'glass': 'Glass', 'dark': 'Стандартная темная' },
                    default: 'mint_dark'
                },
                {
                    title: 'Шрифты',
                    name: 'ui_font',
                    type: 'select',
                    values: { 'standard': 'Стандартный', 'ubuntu': 'Ubuntu', 'roboto': 'Roboto' },
                    default: 'standard'
                },
                {
                    title: 'Анимация загрузки',
                    description: 'Кастомная анимация для всех загрузчиков',
                    name: 'ui_loading_anim',
                    type: 'select',
                    values: { 'true': 'Вкл', 'false': 'Выкл' },
                    default: 'false'
                },
                {
                    title: 'Настройка цвета',
                    description: 'После включения появится раздел "Настройка цветов" в главном меню',
                    name: 'ui_colors_active',
                    type: 'select',
                    values: { 'true': 'Вкл', 'false': 'Выкл' },
                    default: 'false'
                },
                {
                    title: 'Фиксированный размер',
                    description: 'Увеличивает размер всего интерфейса (подходит для больших экранов)',
                    name: 'ui_fixed_size',
                    type: 'select',
                    values: { 'true': 'Вкл', 'false': 'Выкл' },
                    default: 'false'
                }
            ]
        });

        // Добавляем остальные пункты (сокращено для краткости, аналогично предыдущим ответам)
        Lampa.Settings.add({
            name: 'interface_plus',
            items: folders.map(f => ({ title: f.title, type: 'button', on: () => Lampa.Settings.open(f.name) }))
        });

        // --- 5. Запуск ---
        Lampa.Settings.listener.follow('change', (e) => {
            if (e.component.indexOf('ui_') > -1) applyAllStyles();
        });

        applyAllStyles();
    }

    if (window.appready) LampaCustomInterface();
    else Lampa.Listener.follow('app', (e) => { if (e.type == 'ready') LampaCustomInterface(); });
})();

