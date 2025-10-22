(function() {
  'use strict';

  window.lampac_version = { major: 0, minor: 0 };

  // Настройки Lampa
  window.lampa_settings = {
    torrents_use: true,
    demo: false,
    read_only: false,
    socket_use: false,      // cub отключен
    socket_url: undefined,
    socket_methods: false,  // cub отключен
    account_use: true,      // аккаунт включен
    account_sync: true,     // синхронизация включена
    plugins_store: false,   // cub магазин отключен
    iptv: false,
    feed: false,            // cub лента отключена
    white_use: false,       // cub отключен
    push_state: true,
    lang_use: true,         // выбор языка разрешен
    plugins_use: true,
    dcma: false
  };

  window.lampa_settings.disable_features = {
    dmca: true,
    reactions: true,        // cub реакции отключены
    discuss: true,          // cub комментарии отключены
    ai: true,
    install_proxy: true,    // установка proxy отключена
    subscribe: true,        // cub подписки отключены
    blacklist: false,
    persons: false,
    ads: true,
    trailers: false
  };

  var timer = setInterval(function() {
    if (typeof Lampa !== 'undefined') {
      clearInterval(timer);

      // Приоритет кнопок
      if ({btn_priority_forced})
        Lampa.Storage.set('full_btn_priority', '{full_btn_priority_hash}');

      // Уникальный ID для синхронизации
      var unic_id = Lampa.Storage.get('lampac_unic_id', '');
      if (!unic_id) {
        unic_id = Lampa.Utils.uid(8).toLowerCase();
        Lampa.Storage.set('lampac_unic_id', unic_id);
      }

      // Загрузка только privateinit (без tmdbproxy и cubproxy)
      Lampa.Utils.putScriptAsync([
        "{localhost}/privateinit.js?account_email=" + encodeURIComponent(Lampa.Storage.get('account_email', '')) + "&uid=" + encodeURIComponent(Lampa.Storage.get('lampac_unic_id', ''))
      ], function() {});

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
    
    if (Lampa.Storage.get('lampac_initiale', 'false')) return;

    Lampa.Storage.set('lampac_initiale', 'true');
    
    // TMDB как основной источник для Украины (без проксирования)
    Lampa.Storage.set('source', 'tmdb');
    Lampa.Storage.set('video_quality_default', '2160');
    Lampa.Storage.set('full_btn_priority', '{full_btn_priority_hash}');
    
    // Регион и язык для TMDB: UA (код страны), uk (код языка)
    if ('{country}' == 'UA') {
      Lampa.Storage.set('tmdb_lang', 'uk');
    }
    
    Lampa.Storage.set('poster_size', 'w300');

    // Настройки парсера
    Lampa.Storage.set('parser_use', 'true');
    Lampa.Storage.set('jackett_url', '{jachost}');
    Lampa.Storage.set('jackett_key', '1');
    Lampa.Storage.set('parser_torrent_type', 'jackett');

    // Установка плагинов
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

    if (plugins_push.length) 
      Lampa.Utils.putScript(plugins_push, function() {}, function() {}, function() {}, true);
      
    // Скрыть cub элементы интерфейса
    hideCubElements();
  }
  
  function hideCubElements() {
    // Скрыть cub меню в настройках
    Lampa.Settings.listener.follow('open', function(e) {
      // Убираем синхронизацию cub, но оставляем основные настройки аккаунта
      if (e.name == 'account') {
        e.body.find('[data-name="account_sync"]').remove();
        e.body.find('[data-name="account_token"]').remove();
      }
      
      $(['parser', 'iptv', 'plugins'].map(function(c) {
        return '[data-component="' + c + '"]';
      }).join(','), e.body).remove();
    });

    // Скрыть cub элементы в карточках
    Lampa.Listener.follow('full', function(e) {
      if (e.type == 'complite') {
        e.object.activity.render().find('.button--subscribe').remove();
        $('.open--broadcast').remove();
      }
    });

    // Скрыть cub разделы в главном меню
    Lampa.Listener.follow('app', function(e) {
      if (e.type === 'ready') {
        $("[data-action=feed]").hide();
        $("[data-action=myperson]").hide();
        $("[data-action=subscribes]").hide();
        $("[data-action=console]").hide();
      }
    });
  }
})();
