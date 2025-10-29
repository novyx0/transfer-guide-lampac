(function() {
  'use strict';

  window.lampac_version = { major: 0, minor: 0 };

  localStorage.setItem('cub_mirrors', '["mirror-kurwa.men"]');
  
  window.lampa_settings = {
    torrents_use: true,
    demo: false,
    read_only: false,
    socket_use: true,
    socket_url: undefined,
    socket_methods: true,
    account_use: true,
    account_sync: true,
    plugins_store: true,
    iptv: false,
    feed: true,
    white_use: true,
    push_state: true,
    lang_use: true,
    plugins_use: true,
    dcma: false
  };

  window.lampa_settings.disable_features = {
    dmca: true,
    reactions: false,
    discuss: false,
    ai: false,
    install_proxy: false,
    subscribe: false,
    blacklist: false,
    persons: false,
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
        Lampa.Storage.set('full_btn_priority', '1823738403');

      var unic_id = Lampa.Storage.get('lampac_unic_id', '');
      if (!unic_id) {
        unic_id = Lampa.Utils.uid(8).toLowerCase();
        Lampa.Storage.set('lampac_unic_id', unic_id);
      }

      Lampa.Utils.putScriptAsync(["{localhost}/cubproxy.js", "{localhost}/privateinit.js?account_email=" + encodeURIComponent(Lampa.Storage.get('account_email', '')) + "&uid=" + encodeURIComponent(Lampa.Storage.get('lampac_unic_id', ''))], function() {});

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
    Lampa.Storage.set('source', 'tmdb');
    Lampa.Storage.set('video_quality_default', '2160');
    Lampa.Storage.set('full_btn_priority', '1823738403');
    Lampa.Storage.set('proxy_tmdb', 'UA' == 'RU');
    Lampa.Storage.set('poster_size', 'w342');

    Lampa.Storage.set('parser_use', 'true');
    Lampa.Storage.set('jackett_url', 'localhost:9118');
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

  }
})();
