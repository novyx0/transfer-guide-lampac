(function () {
    "use strict";

    // Полифил для Object.assign (для совместимости с WebOS/Tizen)
    if (typeof Object.assign !== 'function') {
        Object.assign = function(target) {
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }

    // Полифил для Array.prototype.includes (для совместимости с WebOS/Tizen)
    if (!Array.prototype.includes) {
        Array.prototype.includes = function(searchElement, fromIndex) {
            return this.indexOf(searchElement, fromIndex) !== -1;
        };
    }

    var BASE_URL = (window.location.origin && window.location.origin !== "null" && !window.location.origin.startsWith('file://'))
        ? window.location.origin
        : 'http://193.169.241.242:11357';
    var MAX_DEVICES = 1;
    var REGISTRATION_COOLDOWN_PERIOD = 10 * 24 * 60 * 60 * 1000;
    var SUPPORT_TELEGRAM = '';

    Lampa.Lang.add({
        devices_cooldown_message: {
            ru: "Привет, это устройство уже было зарегистрировано. Для того чтобы зарегистрировать его снова, необходимо подождать до <b class='highlight'>{0}</b>.<br><br>Установлен период охлаждения 10 дней, чтобы устройства не перебирали по кругу с целью обойти ограничения. Мы ценим твое терпение и стараемся обеспечить стабильную работу сервиса. Если возникли вопросы, это произошло случайно или из любопытства, не стесняйся обращаться в поддержку: <br>Telegram — <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' style='width:16px;height:16px;vertical-align:middle;margin-left:6px;margin-right:6px;'><path d='M100.5 161.7l-4.2 39.4c6-0.1 8.6-2.6 11.9-5.6l28.6-26.4 59.3 43.3c10.8 6 18.5 2.9 21.5-10.4L223 60.3c3.5-14.2-5.3-20.8-16.1-17.2L27.4 108.8c-13.7 5.4-13.6 13.1-2.4 16.5l47.7 14.9L181.7 74.7c5.6-3.6 10.7-1.6 6.5 2.3z' fill='#ffffff'/></svg><a href='https://t.me/" + SUPPORT_TELEGRAM + "' style='color:#ffffff; font-size:16px; text-decoration:none;'>@" + SUPPORT_TELEGRAM + "</a>",
            en: "Hello, this device has already been registered. To register it again, you need to wait until <b class='highlight'>{0}</b>.<br><br>A 10-day cooldown period is set to prevent devices from being cycled to bypass restrictions. We appreciate your patience and strive to ensure the service runs smoothly. If you have any questions, or this happened by accident or out of curiosity, feel free to contact support: <br>Telegram — <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' style='width:16px;height:16px;vertical-align:middle;margin-left:6px;margin-right:6px;'><path d='M100.5 161.7l-4.2 39.4c6-0.1 8.6-2.6 11.9-5.6l28.6-26.4 59.3 43.3c10.8 6 18.5 2.9 21.5-10.4L223 60.3c3.5-14.2-5.3-20.8-16.1-17.2L27.4 108.8c-13.7 5.4-13.6 13.1-2.4 16.5l47.7 14.9L181.7 74.7c5.6-3.6 10.7-1.6 6.5 2.3z' fill='#ffffff'/></svg><a href='https://t.me/" + SUPPORT_TELEGRAM + "' style='color:#ffffff; font-size:16px; text-decoration:none;'>@" + SUPPORT_TELEGRAM + "</a>",
            uk: "Привіт, цей пристрій уже був зареєстрований. Щоб зареєструвати його знову, потрібно зачекати до <b class='highlight'>{0}</b>.<br><br>Встановлено період охолодження 10 днів, щоб пристрої не змінювалися по колу з метою обходу обмежень. Ми цінуємо ваше терпіння і прагнемо забезпечити стабільну роботу сервісу. Якщо виникли питання, це сталося випадково або з цікавості, не соромтеся звертатися до підтримки: <br>Telegram — <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' style='width:16px;height:16px;vertical-align:middle;margin-left:6px;margin-right:6px;'><path d='M100.5 161.7l-4.2 39.4c6-0.1 8.6-2.6 11.9-5.6l28.6-26.4 59.3 43.3c10.8 6 18.5 2.9 21.5-10.4L223 60.3c3.5-14.2-5.3-20.8-16.1-17.2L27.4 108.8c-13.7 5.4-13.6 13.1-2.4 16.5l47.7 14.9L181.7 74.7c5.6-3.6 10.7-1.6 6.5 2.3z' fill='#ffffff'/></svg><a href='https://t.me/" + SUPPORT_TELEGRAM + "' style='color:#ffffff; font-size:16px; text-decoration:none;'>@" + SUPPORT_TELEGRAM + "</a>"
        },
        devices_limit_exceeded: {
            ru: "Привет, ты превысил лимит зарегистрированных устройств. <br>Перейди в <span class='highlight'>&quot;Настройки&quot;</span> - <span class='highlight'>&quot;Аккаунт и устройства&quot;</span> и удали одно из ненужных устройств, чтобы зарегистрировать это.<br><span class='highlight'>Функционал воспроизведения ограничен.</span><br><br>Если необходимо увеличить количество устройств или возникли вопросы, свяжись с поддержкой: <br>Telegram — <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' style='width:16px;height:16px;vertical-align:middle;margin-left:6px;margin-right:6px;'><path d='M100.5 161.7l-4.2 39.4c6-0.1 8.6-2.6 11.9-5.6l28.6-26.4 59.3 43.3c10.8 6 18.5 2.9 21.5-10.4L223 60.3c3.5-14.2-5.3-20.8-16.1-17.2L27.4 108.8c-13.7 5.4-13.6 13.1-2.4 16.5l47.7 14.9L181.7 74.7c5.6-3.6 10.7-1.6 6.5 2.3z' fill='#ffffff'/></svg><a href='https://t.me/" + SUPPORT_TELEGRAM + "' style='color:#ffffff; font-size:16px; text-decoration:none;'>@" + SUPPORT_TELEGRAM + "</a>",
            en: "Hello, you have exceeded the limit of registered devices. <br>Go to <span class='highlight'>&quot;Settings&quot;</span> - <span class='highlight'>&quot;Account and Devices&quot;</span> and remove one of the unused devices to register this one.<br><span class='highlight'>Playback functionality is limited.</span><br><br>If you need to increase the number of devices or have any questions, contact support: <br>Telegram — <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' style='width:16px;height:16px;vertical-align:middle;margin-left:6px;margin-right:6px;'><path d='M100.5 161.7l-4.2 39.4c6-0.1 8.6-2.6 11.9-5.6l28.6-26.4 59.3 43.3c10.8 6 18.5 2.9 21.5-10.4L223 60.3c3.5-14.2-5.3-20.8-16.1-17.2L27.4 108.8c-13.7 5.4-13.6 13.1-2.4 16.5l47.7 14.9L181.7 74.7c5.6-3.6 10.7-1.6 6.5 2.3z' fill='#ffffff'/></svg><a href='https://t.me/" + SUPPORT_TELEGRAM + "' style='color:#ffffff; font-size:16px; text-decoration:none;'>@" + SUPPORT_TELEGRAM + "</a>",
            uk: "Привіт, ви перевищили ліміт зареєстрованих пристроїв. <br>Перейдіть до <span class='highlight'>&quot;Налаштування&quot;</span> - <span class='highlight'>&quot;Обліковий запис і пристрої&quot;</span> і видаліть один із непотрібних пристроїв, щоб зареєструвати цей.<br><span class='highlight'>Функціонал відтворення обмежено.</span><br><br>Якщо потрібно збільшити кількість пристроїв або виникли питання, зв’яжіться з підтримкою: <br>Telegram — <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' style='width:16px;height:16px;vertical-align:middle;margin-left:6px;margin-right:6px;'><path d='M100.5 161.7l-4.2 39.4c6-0.1 8.6-2.6 11.9-5.6l28.6-26.4 59.3 43.3c10.8 6 18.5 2.9 21.5-10.4L223 60.3c3.5-14.2-5.3-20.8-16.1-17.2L27.4 108.8c-13.7 5.4-13.6 13.1-2.4 16.5l47.7 14.9L181.7 74.7c5.6-3.6 10.7-1.6 6.5 2.3z' fill='#ffffff'/></svg><a href='https://t.me/" + SUPPORT_TELEGRAM + "' style='color:#ffffff; font-size:16px; text-decoration:none;'>@" + SUPPORT_TELEGRAM + "</a>"
        },
        devices_registration_title: {
            ru: "Регистрация устройства",
            en: "Device Registration",
            uk: "Реєстрація пристрою"
        },
        devices_limit_exceeded_title: {
            ru: "Превышен лимит устройств",
            en: "Device Limit Exceeded",
            uk: "Перевищено ліміт пристроїв"
        },
        devices_delete_device: {
            ru: "Удалить",
            en: "Delete",
            uk: "Видалити"
        },
        devices_click_to_delete: {
            ru: "Нажмите чтобы удалить",
            en: "Click to delete",
            uk: "Натисніть, щоб видалити"
        },
        devices_cancel: {
            ru: "Отмена",
            en: "Cancel",
            uk: "Скасувати"
        },
        devices_current_device_deleted: {
            ru: "Устройство удалено. Перезагрузка через 5 секунд...",
            en: "Device has been deleted. Reloading in 5 seconds...",
            uk: "Пристрій видалено. Перезавантаження через 5 секунд..."
        },
        devices_device_deleted: {
            ru: "Устройство удалено",
            en: "Device Deleted",
            uk: "Пристрій видалено"
        },
        devices_deletion_canceled: {
            ru: "Удаление отменено",
            en: "Deletion Canceled",
            uk: "Видалення скасовано"
        },
        devices_re_registration_notice: {
            ru: "Повторная регистрация удаленного устройства возможна только через 10 дней.",
            en: "Re-registration of a deleted device is possible only after 10 days.",
            uk: "Повторна реєстрація видаленого пристрою можлива лише через 10 днів."
        },
        devices_devices_menu: {
            ru: "Зарегистрированные устройства",
            en: "Registered Devices",
            uk: "Зареєстровані пристрої"
        },
        devices_devices_description: {
            ru: "Список устройств",
            en: "All devices",
            uk: "Ваші зареєстровані пристрої"
        },
        devices_registered_devices: {
            ru: "Зарегистрированные устройства",
            en: "Registered Devices",
            uk: "Зареєстровані пристрої"
        },
        devices_no_devices: {
            ru: "Нет зарегистрированных устройств",
            en: "No Registered Devices",
            uk: "Немає зареєстрованих пристроїв"
        },
        devices_no_devices_description: {
            ru: "Зарегистрируйте устройство для отображения в списке.",
            en: "Register a device to display it in the list.",
            uk: "Зареєструйте пристрій, щоб він відображався у списку."
        },
        devices_unknown_device: {
            ru: "Неизвестное устройство",
            en: "Unknown Device",
            uk: "Невідомий пристрій"
        },
        devices_last_activity: {
            ru: "Последняя активность: {0}",
            en: "Last Activity: {0}",
            uk: "Остання активність: {0}"
        },
        devices_last_activity_unknown: {
            ru: "Последняя активность: Неизвестно",
            en: "Last Activity: Unknown",
            uk: "Остання активність: Невідомо"
        },
        devices_user_info: {
            ru: "Информация пользователя",
            en: "User Information",
            uk: "Інформація про користувача"
        },
        devices_user_id: {
            ru: "User ID: {0}",
            en: "User ID: {0}",
            uk: "ID користувача: {0}"
        },
        devices_coffee_expires: {
            ru: "Запас кофе до: {0}",
            en: "Coffee Supply Until: {0}",
            uk: "Запас кави до: {0}"
        },
        devices_max_devices: {
            ru: "Максимальное количество устройств: {0}",
            en: "Maximum Number of Devices: {0}",
            uk: "Максимальна кількість пристроїв: {0}"
        },
        devices_unknown: {
            ru: "Неизвестно",
            en: "Unknown",
            uk: "Невідомо"
        },
        devices_coffee_remaining: {
            ru: "Киноман, твой запас кофе на {0} {1}.",
            en: "Movie buff, your coffee supply lasts for {0} {1}.",
            uk: "Кіноман, твій запас кави на {0} {1}."
        },
        devices_coffee_expired: {
            ru: "Кофе закончился! Пора пополнить запасы.",
            en: "Coffee ran out! Time to replenish your supply.",
            uk: "Кава закінчилася! Час поповнити запаси."
        },
        devices_coffee_expires_missing: {
            ru: "Дата окончания запаса кофе не указана. Проверьте настройки.",
            en: "Coffee supply expiration date is not specified. Check the settings.",
            uk: "Дата закінчення запасу кави не вказана. Перевірте налаштування."
        },
        devices_account_and_devices: {
            ru: "Аккаунт и устройства",
            en: "Account and Devices",
            uk: "Обліковий запис і пристрої"
        },
        devices_day: {
            ru: "день",
            en: "day",
            uk: "день"
        },
        devices_days_2_4: {
            ru: "дня",
            en: "days",
            uk: "дні"
        },
        devices_days: {
            ru: "дней",
            en: "days",
            uk: "днів"
        }
    });

    var userInfo = {
        ip: null,
        userAgent: null,
        country: null,
        userId: null,
        userIds: [],
        userExpires: null,
        suid: "",
        max_devices: null
    };

    function logExecution(functionName, startTime, additionalInfo) {
        var logMessage = functionName + ' execution time: ' + (new Date().getTime() - startTime) + 'ms';
        if (additionalInfo) logMessage += ' | Info: ' + additionalInfo;
        console.log(logMessage);
    }

    function account(url) {
        var startTime = new Date().getTime();
        url = url + '';
        if (url.indexOf('account_email=') === -1) {
            var email = Lampa.Storage.get('account_email');
            if (email) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(email));
        }
        if (url.indexOf('uid=') === -1) {
            var uid = Lampa.Storage.get('lampac_unic_id', '');
            if (uid) url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(uid));
        }
        logExecution('account', startTime, 'URL prepared: ' + url);
        return url.replace('{localhost}', BASE_URL);
    }

    function reqUserInfo(callback) {
        var startTime = new Date().getTime();
        var network = new Lampa.Reguest();
        logExecution('reqUserInfo', startTime, 'Starting request to /reqinfo');
        network.silent(account('{localhost}/reqinfo'), function (response) {
            logExecution('reqUserInfo', startTime, 'Received response: ' + JSON.stringify(response));
            userInfo.ip = response.ip || null;
            userInfo.userAgent = response.userAgent || null;
            userInfo.country = response.country || null;
            // Замена опциональной цепочки на традиционные проверки для совместимости
            userInfo.max_devices = (response.user && response.user.params && response.user.params.max_devices)
                ? response.user.params.max_devices
                : (response.params && response.params.max_devices
                    ? response.params.max_devices
                    : MAX_DEVICES);
            var user = response.user || {};
            userInfo.userId = user.id || null;
            userInfo.userIds = user.ids || [];
            userInfo.userExpires = user.expires || null;
            userInfo.suid = response.user_uid || '';
            if (typeof callback === 'function') {
                callback();
                logExecution('reqUserInfo', startTime, 'Callback executed');
            }
        }, function (error) {
            logExecution('reqUserInfo', startTime, 'Request failed: ' + error);
            if (typeof callback === 'function') callback();
        });
    }

    function generateUUID() {
        var startTime = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
        logExecution('generateUUID', startTime, 'Generated UUID: ' + uuid);
        return uuid;
    }

    function extractDeviceInfo(userAgent) {
        var startTime = new Date().getTime();
        if (!userAgent || typeof userAgent !== "string") {
            logExecution("extractDeviceInfo_error", startTime, 'Invalid userAgent');
            return Lampa.Lang.translate("devices_unknown_device") + " - (Unknown Details)";
        }
        var deviceMatch = userAgent.match(/\((.*?)\)/);
        var deviceDetails = deviceMatch ? deviceMatch[1] : "Unknown Details";
        var DEVICE_TYPES = {
            "Amazon Fire TV": { check: function (ua) { return ua.match(/Fire TV|Amazon/i); }, name: "Amazon Fire TV" },
            "NVIDIA Shield TV": { check: function (ua) { return ua.match(/SHIELD|NVIDIA/i); }, name: "NVIDIA Shield TV" },
            "Roku": { check: function (ua) { return ua.match(/Roku/i) && !ua.match(/TCL/i); }, name: "Roku" },
            "Xiaomi TV": { check: function (ua) { return ua.match(/MiBox|Xiaomi|MiTV/i) && Lampa.Platform.screen("tv"); }, name: "Xiaomi Mi" },
            "Apple TV": { check: function (ua) { return Lampa.Platform.screen("tv") && ua.match(/Apple/) && ua.match(/iPad/) && !Lampa.Platform.screen("mobile"); }, name: "Apple TV" },
            "LG WebOS TV": { check: function (ua) { return Lampa.Platform.screen("tv") && ua.match(/WebOS|LG/i); }, name: "LG WebOS TV" },
            "Samsung Tizen TV": { check: function (ua) { return Lampa.Platform.screen("tv") && ua.match(/Samsung|Tizen/i); }, name: "Samsung Tizen TV" },
            "Sony Bravia TV": { check: function (ua) { return Lampa.Platform.screen("tv") && ua.match(/Sony|Bravia/i); }, name: "Sony Bravia TV" },
            "TCL Roku TV": { check: function (ua) { return Lampa.Platform.screen("tv") && ua.match(/Roku|TCL/i); }, name: "TCL Roku TV" },
            "Hisense VIDAA TV": { check: function (ua) { return Lampa.Platform.screen("tv") && ua.match(/VIDAA|Hisense/i); }, name: "Hisense VIDAA TV" },
            "Haier Smart TV": { check: function (ua) { return Lampa.Platform.screen("tv") && ua.match(/Haier/i); }, name: "Haier Smart TV" },
            "Yandex Smart TV": { check: function (ua) { return Lampa.Platform.screen("tv") && ua.match(/YNDX|Yandex/i); }, name: "Yandex Smart TV" },
            "Samsung Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Samsung/i) && !Lampa.Platform.screen("tv"); }, name: "Samsung Smartphone" },
            "Xiaomi Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Xiaomi|Redmi|POCO/i) && !Lampa.Platform.screen("tv"); }, name: "Xiaomi Smartphone" },
            "Huawei Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Huawei|Honor/i) && !Lampa.Platform.screen("tv"); }, name: "Huawei Smartphone" },
            "Oppo Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Oppo/i) && !Lampa.Platform.screen("tv"); }, name: "Oppo Smartphone" },
            "Vivo Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Vivo/i) && !Lampa.Platform.screen("tv"); }, name: "Vivo Smartphone" },
            "Realme Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Realme/i) && !Lampa.Platform.screen("tv"); }, name: "Realme Smartphone" },
            "OnePlus Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/OnePlus/i) && !Lampa.Platform.screen("tv"); }, name: "OnePlus Smartphone" },
            "Google Pixel Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Pixel/i) && !Lampa.Platform.screen("tv"); }, name: "Google Pixel Smartphone" },
            "Motorola Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Moto|Motorola/i) && !Lampa.Platform.screen("tv"); }, name: "Motorola Smartphone" },
            "Nokia Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Nokia/i) && !Lampa.Platform.screen("tv"); }, name: "Nokia Smartphone" },
            "Sony Xperia Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Sony|Xperia/i) && !Lampa.Platform.screen("tv"); }, name: "Sony Xperia Smartphone" },
            "Asus Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Asus/i) && !Lampa.Platform.screen("tv"); }, name: "Asus Smartphone" },
            "Lenovo Smartphone": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Lenovo/i) && !Lampa.Platform.screen("tv"); }, name: "Lenovo Smartphone" },
            "Nexus Device": { check: function (ua) { return ua.match(/Android/i) && ua.match(/Nexus/i) && !Lampa.Platform.screen("tv"); }, name: "Nexus Device" },
            "Android Device": { check: function (ua) { return ua.match(/Android/i) && !Lampa.Platform.screen("tv"); }, name: "Android Device" },
            "Smart TV": { check: function (ua) { return Lampa.Platform.screen("tv") && ua.match(/Smart-TV|Smart TV|TV/i); }, name: "Smart TV" },
            "Android TV": { check: function (ua) { return Lampa.Platform.screen("tv") && ua.match(/Android/i) && !ua.match(/MiBox|SHIELD|Yandex/i); }, name: "Android TV" },
            "iPhone": { check: function (ua) { return ua.match(/iPhone/i); }, name: "iPhone" },
            "iPad": { check: function (ua) { return ua.match(/iPad|Macintosh/i) && Lampa.Platform.screen("mobile"); }, name: "iPad" },
            "Mac Device": { check: function (ua) { return ua.match(/Macintosh|iPad/i) && !Lampa.Platform.screen("mobile"); }, name: "Mac Device" },
            "Windows PC": { check: function (ua) { return ua.match(/Windows/i); }, name: "Windows PC" }
        };
        for (var key in DEVICE_TYPES) {
            if (DEVICE_TYPES.hasOwnProperty(key) && DEVICE_TYPES[key].check(userAgent)) {
                logExecution("extractDeviceInfo", startTime, 'Device detected: ' + DEVICE_TYPES[key].name);
                return DEVICE_TYPES[key].name + " - (" + deviceDetails + ")";
            }
        }
        logExecution("extractDeviceInfo", startTime, 'No matching device found');
        return Lampa.Lang.translate("devices_unknown_device") + " - (" + deviceDetails + ")";
    }

    function getDeviceId() {
        var startTime = new Date().getTime();
        var userAgent = navigator.userAgent || '';
        var deviceInfo = extractDeviceInfo(userAgent);
        var uuid = Lampa.Storage.get('device_uuid') || generateUUID();
        Lampa.Storage.set('device_uuid', uuid);
        logExecution('getDeviceId', startTime, 'Device ID: ' + uuid + ', Info: ' + deviceInfo);
        return { uuid: uuid, info: deviceInfo, userAgent: userAgent, lastActivity: new Date().getTime() };
    }

    function showCooldownModal(cooldownDate) {
        var startTime = new Date().getTime();
        Lampa.Loading.start();
        setTimeout(function () {
            Lampa.Loading.stop();
            var html = $('<div class="modal-content"></div>');
            html.append('<style>.modal-content { padding: 30px; font-family: sans-serif; border-radius: 8px; color: #555; } .modal-content div { font-size: 14px; line-height: 1.5; color: #aaa; margin-top: 10px; } .modal-content b { font-weight: bold; color: #777; } .modal-content .highlight { color: #fff; }</style>');
            var message = Lampa.Lang.translate('devices_cooldown_message').replace('{0}', cooldownDate.toLocaleDateString() + ' ' + cooldownDate.toLocaleTimeString());
            html.append('<div>' + message + '</div>');
            Lampa.Modal.open({
                title: Lampa.Lang.translate('devices_registration_title'),
                html: html,
                size: 'medium',
                onBack: function () {
                    showCooldownModal(cooldownDate);
                    logExecution('showCooldownModal', startTime, 'Back button pressed');
                }
            });
            logExecution('showCooldownModal', startTime, 'Modal opened');
        }, 6000);
    }

    function showLimitExceededModal() {
        var startTime = new Date().getTime();
        Lampa.Loading.start();
        setTimeout(function () {
            Lampa.Loading.stop();
            $('head').append('<style>.modal-content { padding: 20px; font-family: sans-serif; border-radius: 8px; color: #333; } .modal-content div { font-size: 14px; line-height: 1.5; color: #888; margin-top: 10px; } .modal-content b { font-weight: bold; color: #777; } .modal-content .highlight { color: #fff; font-style: italic; }</style>');
            var htmlLimit = $('<div class="modal-content"></div>');
            htmlLimit.append('<div style="font-size: 1.3em;">' + Lampa.Lang.translate('devices_limit_exceeded') + '</div>');
            Lampa.Modal.open({
                title: Lampa.Lang.translate('devices_limit_exceeded_title'),
                html: htmlLimit,
                size: 'medium',
                onBack: function () {
                    Lampa.Modal.close();
                    showDevicesMenu();
                    logExecution('showLimitExceededModal', startTime, 'Back button pressed');
                }
            });
            logExecution('showLimitExceededModal', startTime, 'Modal opened');
        }, 6000);
    }

    function registerDevice() {
        var startTime = new Date().getTime();
        var max_devices = userInfo.max_devices || MAX_DEVICES;
        var device = getDeviceId();
        var userDevices = Lampa.Storage.get('user_devices') || [];

        if (typeof userDevices === 'string') {
            userDevices = JSON.parse(userDevices || '[]');
        }

        var lastActivity = Lampa.Storage.get('last_activity');
        var isDeviceRegistered = false;
        var i;

        for (i = 0; i < userDevices.length; i++) {
            if (userDevices[i].uuid === device.uuid) {
                isDeviceRegistered = true;
                userDevices[i].lastActivity = new Date().getTime();
                break;
            }
        }

        if (isDeviceRegistered) {
            Lampa.Storage.set('user_devices', userDevices);
            Lampa.Storage.set('last_activity', new Date().getTime());
            goExport('sync_user_devices');
            logExecution('registerDevice', startTime, 'Device already registered, lastActivity updated: ' + device.uuid);
            return;
        }

        if (lastActivity && (new Date().getTime() - lastActivity) < REGISTRATION_COOLDOWN_PERIOD) {
            var remainingTime = REGISTRATION_COOLDOWN_PERIOD - (new Date().getTime() - lastActivity);
            var cooldownDate = new Date(new Date().getTime() + remainingTime);
            showCooldownModal(cooldownDate);
            logExecution('registerDevice', startTime, 'Cooldown period active until: ' + cooldownDate);
            return;
        }

        if (userDevices.length >= max_devices) {
            showLimitExceededModal();
            removeElements();
            logExecution('registerDevice', startTime, 'Device limit exceeded: ' + userDevices.length + '/' + max_devices);
            return;
        }

        userDevices.push(device);
        Lampa.Storage.set('user_devices', userDevices);
        Lampa.Storage.set('last_activity', new Date().getTime());
        goExport('sync_user_devices');
        logExecution('registerDevice', startTime, 'Device registered: ' + device.uuid);
    }

    function startPeriodicSync() {
        setInterval(function () {
            goImport('sync_user_devices', function () {
                registerDevice();
                logExecution('syncAndRegister', new Date().getTime(), 'Sync and registration completed');
            });
        }, 60000);
    }

    function goImport(path, callback) {
        var startTime = new Date().getTime();
        var network = new Lampa.Reguest();
        network.silent(account('{localhost}/storage/get?path=' + path), function (j) {
            if (j.success && j.fileInfo && j.data) {
                if (j.fileInfo.changeTime != Lampa.Storage.get('lampac_' + path, '0')) {
                    var data = typeof j.data === 'string' ? JSON.parse(j.data) : j.data;
                    if (data.user_devices) {
                        Lampa.Storage.set('user_devices', data.user_devices, true);
                    }
                    Lampa.Storage.set('lampac_' + path, j.fileInfo.changeTime);
                    logExecution('goImport', startTime, 'Import successful: ' + JSON.stringify(data));
                }
            } else if (j.msg && j.msg == 'outFile') {
                goExport(path);
                logExecution('goImport', startTime, 'No file found, exporting: ' + path);
            }
            if (typeof callback === 'function') callback();
        }, function (error) {
            logExecution('goImport', startTime, 'Import failed: ' + error);
            if (typeof callback === 'function') callback();
        });
    }

    function goExport(path) {
        var startTime = new Date().getTime();
        var value = {};
        if (path == 'sync_user_devices') {
            var userDevices = Lampa.Storage.get('user_devices') || [];
            value.user_devices = Array.isArray(userDevices) ? userDevices : JSON.parse(userDevices || '[]');
        }
        $.ajax({
            url: account('{localhost}/storage/set?path=' + path),
            type: 'POST',
            data: JSON.stringify(value),
            async: true,
            cache: false,
            contentType: 'application/json',
            processData: false,
            success: function (j) {
                if (j.success && j.fileInfo) {
                    Lampa.Storage.set('lampac_' + path, j.fileInfo.changeTime);
                    logExecution('goExport', startTime, 'Export successful: ' + JSON.stringify(j));
                }
            },
            error: function (error) {
                logExecution('goExport', startTime, 'Export failed: ' + error);
            }
        });
    }

    function renderUserInfo() {
        var startTime = new Date().getTime();
        Lampa.SettingsApi.addParam({
            component: "account_menu",
            param: { name: "UserInfo", type: "title" },
            field: {
                name: Lampa.Lang.translate("devices_user_info"),
                description:
                    "<p><strong>" +
                    Lampa.Lang.translate("devices_user_id").replace("{0}", userInfo.userId || Lampa.Lang.translate("devices_unknown")) +
                    "</p>" +
                    "<p><strong>" +
                    Lampa.Lang.translate("devices_coffee_expires").replace("{0}", userInfo.userExpires || "") +
                    "</p>" +
                    "<p><strong>" +
                    Lampa.Lang.translate("devices_max_devices").replace("{0}", userInfo.max_devices || MAX_DEVICES) +
                    "</p>"
            }
        });
        Lampa.SettingsApi.addParam({
            component: "account_menu",
            param: { name: "DevicesList", type: "button" },
            field: {
                name: Lampa.Lang.translate("devices_devices_menu"),
                description: Lampa.Lang.translate("devices_devices_description")
            },
            onChange: function () {
                showDevicesMenu();
                logExecution('renderUserInfo', startTime, 'Devices menu button clicked');
            }
        });
        logExecution("renderUserInfo", startTime, 'User info rendered');
    }

    function showDevicesMenu() {
        var startTime = new Date().getTime();
        var devices = Lampa.Storage.get("user_devices") || [];
        var items = [];
        if (devices.length === 0) {
            items.push({
                title: Lampa.Lang.translate("devices_no_devices"),
                subtitle: Lampa.Lang.translate("devices_no_devices_description"),
                disabled: true
            });
        } else {
            for (var i = 0; i < devices.length; i++) {
                var lastActivityText = devices[i].lastActivity
                    ? Lampa.Lang.translate("devices_last_activity").replace("{0}", new Date(devices[i].lastActivity).toLocaleDateString())
                    : Lampa.Lang.translate("devices_last_activity_unknown");
                items.push({
                    title: devices[i].info || Lampa.Lang.translate("devices_unknown_device"),
                    subtitle: lastActivityText,
                    uuid: devices[i].uuid
                });
            }
        }
        Lampa.Select.show({
            title: Lampa.Lang.translate("devices_registered_devices"),
            items: items,
            onSelect: function (item) {
                if (item.uuid) {
                    deleteDevice(item.uuid);
                    logExecution("showDevicesMenu_select", startTime, 'Selected device: ' + item.uuid);
                } else {
                    Lampa.Controller.toggle("settings_component");
                    logExecution("showDevicesMenu_select", startTime, 'No device selected');
                }
            },
            onBack: function () {
                Lampa.Controller.toggle("settings_component");
                logExecution("showDevicesMenu_back", startTime, 'Back to settings');
            }
        });
        logExecution("showDevicesMenu", startTime, 'Devices menu displayed');
    }

    function deleteDevice(uuid) {
        var startTime = new Date().getTime();
        var currentDevice = getDeviceId();
        var devices = Lampa.Storage.get("user_devices") || [];

        if (typeof devices === 'string') {
            devices = JSON.parse(devices || '[]');
        }

        var max_devices = userInfo.max_devices || MAX_DEVICES;
        var wasLimitReached = devices.length >= max_devices;

        Lampa.Select.show({
            title: Lampa.Lang.translate("devices_re_registration_notice"),
            nomark: true,
            items: [
                { title: Lampa.Lang.translate("devices_delete_device"), action: "delete", selected: true },
                { title: Lampa.Lang.translate("devices_cancel"), action: "cancel" }
            ],
            onSelect: function (item) {
                if (item.action === "delete") {
                    var newDevices = [];
                    for (var i = 0; i < devices.length; i++) {
                        if (devices[i].uuid !== uuid) {
                            newDevices.push(devices[i]);
                        }
                    }
                    Lampa.Storage.set("user_devices", newDevices);
                    Lampa.Noty.show(Lampa.Lang.translate("devices_device_deleted"));
                    goExport('sync_user_devices');

                    if (wasLimitReached || uuid === currentDevice.uuid) {
                        Lampa.Noty.show(Lampa.Lang.translate("devices_current_device_deleted"));
                        setTimeout(function () {
                            window.location.reload();
                            logExecution("deleteDevice", startTime, 'Device deleted, limit was reached or current device, reloading: ' + uuid);
                        }, 5000);
                    } else {
                        showDevicesMenu();
                        logExecution("deleteDevice", startTime, 'Device deleted: ' + uuid);
                    }
                } else {
                    Lampa.Noty.show(Lampa.Lang.translate("devices_deletion_canceled"));
                    showDevicesMenu();
                    logExecution("deleteDevice", startTime, 'Deletion canceled');
                }
            },
            onBack: function () {
                showDevicesMenu();
                logExecution("deleteDevice_back", startTime, 'Back to devices menu');
            }
        });
        logExecution("deleteDevice", startTime, 'Delete device initiated for: ' + uuid);
    }

    function showSubscriptionDays() {
        var startTime = new Date().getTime();
        if (userInfo.userExpires) {
            var expirationDate = new Date(userInfo.userExpires);
            var currentDate = new Date();
            var timeDifference = expirationDate - currentDate;
            var remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            if (remainingDays > 0) {
                var dayWord = getDayWord(remainingDays);
                Lampa.Noty.show(Lampa.Lang.translate('devices_coffee_remaining').replace('{0}', remainingDays).replace('{1}', dayWord));
                logExecution('showSubscriptionDays', startTime, 'Remaining days: ' + remainingDays);
            } else {
                Lampa.Noty.show(Lampa.Lang.translate('devices_coffee_expired'));
                logExecution('showSubscriptionDays', startTime, 'Subscription expired');
            }
        } else {
            Lampa.Noty.show(Lampa.Lang.translate('devices_coffee_expires_missing'));
            logExecution('showSubscriptionDays', startTime, 'No expiration date');
        }
    }

    function getDayWord(days) {
        var startTime = new Date().getTime();
        var word;
        if (days % 10 === 1 && days % 100 !== 11) {
            word = Lampa.Lang.translate('devices_day');
        } else if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) {
            word = Lampa.Lang.translate('devices_days_2_4');
        } else {
            word = Lampa.Lang.translate('devices_days');
        }
        logExecution('getDayWord', startTime, 'Days: ' + days + ', Word: ' + word);
        return word;
    }

    function moveAccountMenuBeforeInterface() {
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name === 'main') {
                setTimeout(function() {
                    $('div[data-component="interface"]').before($('div[data-component="account_menu"]'));
                }, 10);
            }
        });
    }

    function initApp() {
        var startTime = new Date().getTime();
        if (window.appready) {
            startApp();
            logExecution('initApp', startTime, 'App already ready');
        } else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') {
                    startApp();
                    logExecution('initApp', startTime, 'App ready event triggered');
                }
            });
        }
    }

    function startApp() {
        var startTime = new Date().getTime();
        reqUserInfo(function () {
            goImport('sync_user_devices', function () {
                Lampa.SettingsApi.addComponent({
                    component: 'account_menu',
                    name: Lampa.Lang.translate('devices_account_and_devices'),
                    icon: '<svg width="253px" height="253px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.86002 19L11.54 17.58C11.79 17.37 12.21 17.37 12.47 17.58L14.14 19C14.53 19.2 15.01 19 15.15 18.58L15.47 17.62C15.55 17.39 15.47 17.05 15.3 16.88L13.66 15.23C13.54 15.11 13.45 14.88 13.45 14.72V12.87C13.45 12.45 13.76 12.25 14.15 12.41L17.5 13.85C18.05 14.09 18.51 13.79 18.51 13.19V12.26C18.51 11.78 18.15 11.22 17.7 11.03L13.76 9.32999C13.59 9.25999 13.46 9.04999 13.46 8.86999V6.79999C13.46 6.11999 12.96 5.31999 12.36 5.00999C12.14 4.89999 11.89 4.89999 11.67 5.00999C11.06 5.30999 10.57 6.11999 10.57 6.79999V8.86999C10.57 9.04999 10.43 9.25999 10.27 9.32999L6.33002 11.03C5.89002 11.22 5.52002 11.78 5.52002 12.26V13.19C5.52002 13.79 5.97002 14.09 6.53002 13.85L9.88002 12.41C10.26 12.24 10.58 12.45 10.58 12.87V14.72C10.58 14.89 10.48 15.12 10.37 15.23L8.70002 16.87C8.53002 17.04 8.45002 17.38 8.53002 17.61L8.85002 18.57C8.99002 19 9.46002 19.2 9.86002 19Z" stroke="#ffffff" stroke-width="1.584" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#ffffff" stroke-width="1.584" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>'
                });
                renderUserInfo();
                moveAccountMenuBeforeInterface();
                registerDevice();
                showSubscriptionDays();
                startPeriodicSync();
                logExecution('startApp', startTime, 'App fully initialized');
            });
        });
    }

    function removeElements() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                $('.view--torrent, .view--online, .view--trailer').each(function () {
                    $(this).remove();
                });
                logExecution('removeElementsOnComplete', new Date().getTime(), 'Elements removed');
            }
        });
    }

    // Запуск приложения
    initApp();
})();
