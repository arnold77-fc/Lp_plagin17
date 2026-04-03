(function () {
    'use strict';

    function initMyPlugin() {
        // 1. Регистрация значений в хранилище (чтобы не были пустыми)
        Lampa.Storage.setDefault({
            'card_zoom_scale': '1.05',
            'head_clocks_style': 'bubble',
            'torrent_border_show': 'true'
        });

        // 2. Создаем основные разделы настроек (подменю)
        const menus = [
            { name: 'ms_cards', title: 'Настройка карточек' },
            { name: 'ms_news', title: 'Настройка полной новости' },
            { name: 'ms_header', title: 'Настройка шапки' },
            { name: 'ms_torrents', title: 'Настройка торрентов' },
            { name: 'ms_design', title: 'Оформление' }
        ];

        menus.forEach(m => {
            Lampa.Settings.create({
                title: m.title,
                name: m.name,
                onBack: () => Lampa.Settings.main()
            });
        });

        // 3. Вставляем кнопку в ГЛАВНОЕ меню настроек
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'main') {
                // Создаем элемент кнопки
                var folder = $('<div class="settings-folder selector" data-component="my_custom_interface">' +
                    '<div class="settings-folder__icon">' +
                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>' +
                    '</div>' +
                    '<div class="settings-folder__name">Мой Интерфейс</div>' +
                    '</div>');

                // При нажатии на эту кнопку открываем список подменю
                folder.on('hover:enter', function () {
                    Lampa.Settings.create({
                        title: 'Настройки мода',
                        name: 'my_mod_list',
                        onBack: () => Lampa.Settings.main()
                    });

                    Lampa.Settings.add({
                        name: 'my_mod_list',
                        items: menus.map(m => ({
                            title: m.title,
                            type: 'button',
                            on: () => Lampa.Settings.open(m.name)
                        }))
                    });

                    Lampa.Settings.open('my_mod_list');
                });

                // Вставляем перед разделом "Плагины"
                e.body.find('[data-component="plugins"]').before(folder);
            }
        });
        
        console.log('Plugin: Interface Mod - Loaded');
    }

    // Запуск только после полной готовности Lampa
    if (window.appready) initMyPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') initMyPlugin();
        });
    }
})();
