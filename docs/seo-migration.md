# SEO migration: smart-lead.org.ua → smart-lead.pages.dev

Настроено и проверено25.10.2026. Регистратор adm.tools, домен до10.12.2026. Старый хостинг не продлевать. Новый сайт и canonical остаются на pages.dev.

## Источники и карта
Старый Search Console https://www.smart-lead.org.ua/ (обновление16.10.2026): одна индексированная главная, последний обход17.10.2026. Остальные примеры: wp-admin/*, wp-content/plugins/*, ?s={search_term_string}, /search/{search_term_string}/feed/rss2/. Это технические адреса без подходящего нового контента. Старый sitemap в GSC не отправлялся; старый origin HTTP503, HTTPS неверный сертификат. Архивный CDX не ответил, поиск дополнительных полезных страниц не подтвердил. README проекта подтверждает перенос главной и политики. Список ниже не утверждается исчерпывающим перечнем всех исторических URL.

| Старый путь (apex/www, HTTP/HTTPS) | Конечный адрес | Код |
| --- | --- | --- |
| / и /index.php без WP content/search query | https://smart-lead.pages.dev/ |301 |
| /privacy-policy и /privacy-policy/ | https://smart-lead.pages.dev/privacy-policy/ |301 |
| /robots.txt | https://smart-lead.pages.dev/robots.txt |301 |
| /sitemap.xml, /sitemap_index.xml, /wp-sitemap.xml | https://smart-lead.pages.dev/sitemap.xml |301 |

Главная и политика сохраняют query string. В главном правиле исключены имена параметров s,p,page_id,attachment_id,preview,rest_route,feed. Неизвестные URL не перенаправляются на главную. robots и sitemap перенаправляются отдельно для доступности Googlebot без старого хостинга.

## Настройки Cloudflare
Аккаунт c973e9345a5867c93b191c1b968161d0; зона69f29810018e07a1f539ac3bfec3b086; Free, ACTIVE.
NS dylan.ns.cloudflare.com / elly.ns.cloudflare.com сохранены у регистратора и подтверждены у авторитетного сервера реестра org.ua (cz.ns.ua, DNS TCP), в публичном DNS и Cloudflare UI.
Четыре Single Redirects включены; выражения ограничены host smart-lead.org.ua и www.smart-lead.org.ua. Источник и цель не образуют цепочек; промежуточный HTTP→HTTPS старого хоста не создавался.
Bot Preference Sync off. Исходные A/AAAA сохранены: auto-review отклонил замену на служебныеIP. Релевантные Redirect Rules исполняются на Cloudflare до запроса к origin; старый хостинг для них не нужен. Неизвестные/технические URL не входят в redirect rules и могут получать ошибку origin; проверенные wp-admin и ?s=test отдали503 без Location.
Почтовые MX0 mx.services, SPF и hosting._domainkey DKIM сохранены. DKIM старых/новыхNS совпал, MX/SPF сверены до переключения.

## Проверки и Google
- docs/seo-migration-checks.json:10 положительных случаев через свежие публичные DNS-ответы Google DoH, полный HTTPS certificate validation, прямой301 и конечный200. Проверены4 варианта главной, политика с/без слеша, index.php, UTM, robots и sitemap. Два отрицательных WP-случая не редиректят на главную.
- Системный DNS локальной сети ещё держал старый origin после активации; это отдельно зафиксировано, сетевые настройки не меняли. Google и свежий DoH уже подтверждают работающие редиректы. Не путать старый кэш с отсутствием правил на edge.
- sc-domain:smart-lead.org.ua подтверждён через DNS TXT в аккаунте нового сайта после отдельного разрешения пользователя. Идентичная запись сохранена на Cloudflare и прежнем DNS для переходного периода; не удалять. www URL-prefix автоматически подтверждён через DNS-владение доменом.
- Change of Address принят25.10.2026 для sc-domain:smart-lead.org.ua и отдельно https://www.smart-lead.org.ua/ → https://smart-lead.pages.dev/. Обязательные проверки301 и владения обоими ресурсами успешны. UI обоих ресурсов: «Выполняется перенос этого сайта».
- Новый сайт200, canonical pages.dev, sitemap200 с двумя актуальными URL. GSC Sitemap на момент проверки всё ещё «Не получено» после сегодняшней повторной отправки; технических изменений и лишней повторной отправки не делали. Запуск Change of Address не означает немедленного завершения обработки Google или гарантии прежних позиций.

## Сроки
Действий пользователя сейчас нет. Домен нужно продлить до10.12.2026. Редиректы сохранять минимум до25.10.2027, предпочтительно дольше. Хостинг не продлевать.
Google: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
Смена адреса/варианты www: https://support.google.com/webmasters/answer/9370220
