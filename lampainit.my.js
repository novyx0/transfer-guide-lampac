(function() {
  'use strict';

  window.lampac_version = { major: 0, minor: 0 };

  window.lampa_settings = window.lampa_settings || {};
  window.lampa_settings.torrents_use = true;
  window.lampa_settings.demo = false;
  window.lampa_settings.read_only = false;
  window.lampa_settings.socket_use = true;
  window.lampa_settings.socket_url = undefined;
  window.lampa_settings.socket_methods = true;
  window.lampa_settings.account_use = true;
  window.lampa_settings.account_sync = true;
  window.lampa_settings.plugins_store = true;
  window.lampa_settings.iptv = false;
  window.lampa_settings.feed = true;
  window.lampa_settings.white_use = true;
  window.lampa_settings.push_state = true;
  window.lampa_settings.lang_use = true;
  window.lampa_settings.plugins_use = true;
  window.lampa_settings.dcma = false;

  window.lampa_settings.disable_features = window.lampa_settings.disable_features || {};
  window.lampa_settings.disable_features.dmca = true;
  window.lampa_settings.disable_features.reactions = false;
  window.lampa_settings.disable_features.discuss = false;
  window.lampa_settings.disable_features.ai = false;
  window.lampa_settings.disable_features.install_proxy = false;
  window.lampa_settings.disable_features.subscribe = false;
  window.lampa_settings.disable_features.blacklist = false;
  window.lampa_settings.disable_features.persons = false;
  window.lampa_settings.disable_features.ads = true;
  window.lampa_settings.disable_features.trailers = false;

  window.lampa_settings.developer = window.lampa_settings.developer || {};

  {lampainit-invc}

  var timer = setInterval(function() {
    if (typeof Lampa !== 'undefined') {
      clearInterval(timer);

      if (lampainit_invc)
        lampainit_invc.appload();

      if (true)
        Lampa.Storage.set('full_btn_priority', '1823738403');

      var unic_id = Lampa.Storage.get('lampac_unic_id', '');
      if (!unic_id) {
        unic_id = Lampa.Utils.uid(8).toLowerCase();
        Lampa.Storage.set('lampac_unic_id', unic_id);
      }

      Lampa.Utils.putScriptAsync([
        "{localhost}/cubproxy.js",
        "{localhost}/privateinit.js?account_email=" +
        encodeURIComponent(Lampa.Storage.get('account_email', '')) +
        "&uid=" + encodeURIComponent(unic_id)
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
    }
  }, 150);

  function start() {
    var network = new Lampa.Reguest();
    var api = Lampa.Utils.protocol() + Lampa.Manifest.cub_domain + '/api/';

    function addDevice(message) {
      var enter_cub = false;

      var displayModal = function displayModal() {
        var html = Lampa.Template.get('account_add_device');

        if (!enter_cub) {
          if (message) {
            html.find('.about').html(message + '<br><br>Ваш пароль: ' + Lampa.Storage.get('lampac_unic_id', ''));
          } else {
            html.find('.about').html('Войдите в аккаунт - настройка, синхронизация');
          }

          html.find('.simple-button').remove();
          html.find('.account-add-device__qr').remove();

          var foot = $('<div class="modal__footer"></div>');
          var button_cub = $();
          var button_cod = $('<div class="simple-button selector" style="margin: 0.5em;">Введите пароль</div>');

          foot.append(button_cub);
          foot.append(button_cod);
          html.append(foot);

          button_cub.on('hover:enter', function() {
            enter_cub = true;
            Lampa.Modal.close();
            displayModal();
          });

          button_cod.on('hover:enter', function() {
            Lampa.Modal.close();
            Lampa.Input.edit({
              free: true,
              title: Lampa.Lang.translate('Введите пароль'),
              nosave: true,
              value: '',
              nomic: true
            }, function(new_value) {
              displayModal();

              var code = new_value;

              if (new_value) {
                Lampa.Loading.start(function() {
                  network.clear();
                  Lampa.Loading.stop();
                });
                network.clear();

                var u = '{localhost}/testaccsdb';
                u = Lampa.Utils.addUrlComponent(u, 'account_email=' + encodeURIComponent(code));

                network.silent(u, function(result) {
                  Lampa.Loading.stop();
                  if (!result.accsdb) {
                    window.sync_disable = true;
                    Lampa.Storage.set('lampac_unic_id', code);
                    window.location.reload();
                  } else {
                    Lampa.Noty.show(Lampa.Lang.translate('Неправильный пароль'));
                  }
                }, function() {
                  Lampa.Loading.stop();
                  Lampa.Noty.show(Lampa.Lang.translate('account_code_error'));
                }, {
                  code: code
                });
              } else {
                Lampa.Noty.show(Lampa.Lang.translate('account_code_wrong'));
              }
            });
          });
        } else {
          html.find('.simple-button').on('hover:enter', function() {
            Lampa.Modal.close();
            Lampa.Input.edit({
              free: true,
              title: Lampa.Lang.translate('account_code_enter'),
              nosave: true,
              value: '',
              layout: 'nums',
              nomic: true
            }, function(new_value) {
              displayModal();

              var code = parseInt(new_value);

              if (new_value && new_value.length == 6 && !isNaN(code)) {
                Lampa.Loading.start(function() {
                  network.clear();
                  Lampa.Loading.stop();
                });
                network.clear();
                network.silent(api + 'device/add', function(result) {
                  Lampa.Loading.stop();
                  Lampa.Storage.set('account', result, true);
                  Lampa.Storage.set('account_email', result.email, true);
                  window.location.reload();
                }, function() {
                  Lampa.Loading.stop();
                  Lampa.Noty.show(Lampa.Lang.translate('account_code_error'));
                }, {
                  code: code
                });
              } else {
                Lampa.Noty.show(Lampa.Lang.translate('account_code_wrong'));
              }
            });
          });
        }

        Lampa.Modal.open({
          title: '',
          html: html,
          size: 'full',
          onBack: function onBack() {
            Lampa.Modal.close();
            displayModal();
          }
        });
      };
      displayModal();
    }

    function checkAutch() {
      var url = '{localhost}/testaccsdb';

      var email = Lampa.Storage.get('account_email');
      if (email) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(email));

      var uid = Lampa.Storage.get('lampac_unic_id', '');
      if (uid) url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(uid));

      network.silent(url, function(res) {
        if (res.accsdb) {
          document.getElementById("app").style.display = "none";
          var pwait = document.createElement("div");
          pwait.style.fontSize = "xxx-large";
          pwait.style.textAlign = "center";
          pwait.style.marginTop = "2em";
          pwait.textContent = "Идет загрузка...";
          document.body.appendChild(pwait);

          setTimeout(function() {
            addDevice(res.msg);
          }, 3000);
        } else {
          network.clear();
          network = null;
        }
      }, function() {});
    }

    checkAutch();

    if (lampainit_invc) lampainit_invc.appready();
    if (Lampa.Storage.get('lampac_initiale') === 'true') return;

    Lampa.Storage.set('lampac_initiale', 'true');
    Lampa.Storage.set('video_quality_default', '2160');
    Lampa.Storage.set('proxy_tmdb', '{country}' == 'RU');
    Lampa.Storage.set('poster_size', 'w342');

    Lampa.Storage.set('parser_use', 'true');
    Lampa.Storage.set('jackett_url', '{jachost}');
    Lampa.Storage.set('jackett_key', '1');
    Lampa.Storage.set('parser_torrent_type', 'jackett');

    var plugins = Lampa.Plugins.get();

    var plugins_add = [
      {url: '{localhost}/online.js', status: 1, name: 'Онлайн', author: 'lampac'},
      {url: '{localhost}/sync.js', status: 1, name: 'Синхронизация', author: 'lampac'},
      {url: '{localhost}/timecode.js', status: 1, name: 'Синхронизация тайм-кодов', author: 'lampac'},
      {url: '{localhost}/startpage.js', status: 1, name: 'Стартовая страница', author: 'lampac'},
      {url: '{localhost}/tracks.js', status: 1, name: 'Tracks.js', author: 'lampac'},
      {url: '{localhost}/ts.js', status: 1, name: 'TorrServer', author: 'lampac'},
      {url: '{localhost}/tmdbproxy.js', status: 1, name: 'TMDB Proxy', author: 'lampac'}
    ];

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
