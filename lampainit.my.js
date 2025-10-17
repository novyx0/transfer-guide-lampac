(function() {
  'use strict';


  // Первоначальная сортировка меню
  if (!localStorage.getItem('menu_sort'))
    localStorage.setItem('menu_sort', '["Головна","Фільми","Серіали","Релізи","Аніме","Вибране","IPTV","Історія","Каталог","Фільтр","Розклад","Торренти","Полуничка"]');

  window.lampa_settings = {
    torrents_use: true,    // торренты включены
    demo: false,
    read_only: false,
    socket_use: false,     // CUB socket отключен
    socket_url: undefined,
    socket_methods: false, // CUB методы отключены
    account_use: true,     // локальные закладки
    account_sync: false,   // CUB синхронизация отключена
    plugins_store: false,  // CUB магазин отключен
    iptv: false,
    feed: false,           // CUB лента отключена
    white_use: false,      // CUB отключен
    push_state: false,
    lang_use: true,
    plugins_use: true,
    fixdcma: true
  };

  window.lampa_settings.disable_features = {
    dmca: true,
    reactions: true,       // CUB реакции отключены
    discuss: true,         // CUB комментарии отключены
    ai: true,              // CUB AI отключен
    install_proxy: true,   // CUB TMDB proxy отключен
    subscribe: true,       // CUB подписки отключены
    blacklist: true,
    persons: true,
    ads: true,
    trailers: false
  };


  {lampainit-invc}

  var timer = setInterval(function() {
    if (typeof Lampa !== 'undefined') {
      clearInterval(timer);

      if (lampainit_invc)
        lampainit_invc.appload();

      if ({btn_priority_forced})
        Lampa.Storage.set('full_btn_priority', '{full_btn_priority_hash}');

      var unic_id = Lampa.Storage.get('lampac_unic_id', '');
      if (!unic_id) {
        unic_id = Lampa.Utils.uid(8).toLowerCase();
        Lampa.Storage.set('lampac_unic_id', unic_id);
      }

      // Убрали cubproxy.js, оставили только privateinit.js
      Lampa.Utils.putScriptAsync(["{localhost}/privateinit.js?account_email=" + encodeURIComponent(Lampa.Storage.get('account_email', '')) + "&uid=" + encodeURIComponent(Lampa.Storage.get('lampac_unic_id', ''))], function() {});

      if (window.appready) {
        start();
      }
      else {
        Lampa.Listener.follow('app', function(e) {
          if (e.type == 'ready') {
            start();
          }
        });
      }

	  {pirate_store}
    }
  }, 200);

  function start() {
    {deny}

    if (lampainit_invc) lampainit_invc.appready();
    if (Lampa.Storage.get('lampac_initiale', 'false')) return;

    Lampa.Storage.set('lampac_initiale', 'true');
    Lampa.Storage.set('source', 'tmdb');                    // Источник TMDB вместо CUB
    Lampa.Storage.set('video_quality_default', '2160');
    Lampa.Storage.set('full_btn_priority', '{full_btn_priority_hash}');
    Lampa.Storage.set('proxy_tmdb', 'true');                // TMDB proxy всегда включен
    Lampa.Storage.set('poster_size', 'w300');
    Lampa.Storage.set('protocol', 'https');                 // TMDB использует https

    Lampa.Storage.set('parser_use', 'true');
    Lampa.Storage.set('jackett_url', '{jachost}');
    Lampa.Storage.set('jackett_key', '1');
    Lampa.Storage.set('parser_torrent_type', 'jackett');

    var plugins = Lampa.Plugins.get();

    var plugins_add = [{initiale}];

    var plugins_push = [];

    plugins_add.forEach(function(plugin) {
      if (!plugins.find(function(a) {
          return a.url == plugin.url;
        })) {
        Lampa.Plugins.add(plugin);
        Lampa.Plugins.save();

        plugins_push.push(plugin.url);
      }
    });

    if (plugins_push.length) Lampa.Utils.putScript(plugins_push, function() {}, function() {}, function() {}, true);

    if (lampainit_invc)
      lampainit_invc.first_initiale();

    // Скрыть CUB-зависимые элементы интерфейса
    Lampa.Settings.listener.follow('open', function(e) {
      // Скрыть меню: Синхронизация, IPTV
      $(['account', 'iptv'].map(function(c) {
        return '[data-component="' + c + '"]';
      }).join(','), e.body).remove();
    });

    Lampa.Listener.follow('full', function(e) {
      if (e.type == 'complite') {
        e.object.activity.render().find('.button--subscribe').remove(); // подписка на озвучку
        $('.open--broadcast').remove(); // открыть на другом устройстве
      }
    });

    // Скрыть CUB разделы в главном меню
    Lampa.Listener.follow('app', function(e) {
      if (e.type === 'ready') {
        $("[data-action=feed]").hide();        // лента
        $("[data-action=myperson]").hide();    // подписки на актеров
        $("[data-action=subscribes]").hide();  // подписки
        $("[data-action=mytorrents]").hide();
        $("[data-action=about]").hide();
        $("[data-action=console]").hide();
        $('.head .notice--icon').remove();     // колокольчик уведомлений
      }
    });
  }
})();
