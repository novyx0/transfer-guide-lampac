// //////////////
// Переименуйте файл lampainit-invc.js в lampainit-invc.my.js
// //////////////

var lampainit_invc = {};

// Лампа готова для использования
lampainit_invc.appload = function appload() {
  // Пустая функция - devices.js загружается позже
};

// Лампа полностью загружена, можно работать с интерфейсом
lampainit_invc.appready = function appready() {
  // Загружается после авторизации при каждом запуске
  Lampa.Utils.putScriptAsync(["{localhost}/devices.js"], function() {});
};

// Выполняется один раз, когда пользователь впервые открывает лампу
lampainit_invc.first_initiale = function firstinitiale() {
  // Первоначальные настройки
  Lampa.Storage.set('source', 'tmdb');
};

// Код выполняется до загрузки лампы
localStorage.setItem('cub_mirrors', '["mirror-kurwa.men"]');
