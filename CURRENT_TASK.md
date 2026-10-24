# Текущая задача

Статус: выполняется (2026-10-25).
Цель: название Smart Lead в выдаче (WebSite JSON-LD/og:site_name), чёткий favicon, текущий статус Sitemap, запрос переиндексации после публикации.
Область: head index.html и privacy-policy/index.html, отдельный favicon при необходимости. Основной заголовок/тексты, PWA-иконки и старый домен не менять.
План: проверить production metadata/favicon → добавить WebSite и при необходимости простой favicon → build/production deployment → проверить Sitemap и запросить переиндексацию главной в GSC.
Известно: главная уже в индексе; диагностику индексации не повторять. Предыдущий Sitemap «Не получено», повторная отправка 25 октября и live XML успешны. Текущий favicon по коду /icons/icon-192.png, WebSite отсутствует, og:site_name Smart Lead.

## Контрольная точка
- Production до правки: favicon /icons/icon-192.png, PNG192×192, 6927 байт, совпадает с Git; Googlebot-Image получает200. Старый JPEG public/assets/f6e25cb158.jpg —32×32. Какой значок Google хранит в поисковом кэше, по текущему HTTP установить нельзя.
- WebSite отсутствовал, og:site_name уже Smart Lead, Cloudflare в head не найден. Причина выбора Google имени Cloudflare не раскрыта; отсутствие WebSite могло ослабить сигнал названия.
- Добавлены WebSite JSON-LD и /favicon.png96×96 (простая мишень), favicon ссылки обеих страниц обновлены; PWA-иконки не менялись.
- Build OK, JSON-LD распарсен и проверен, body обеих страниц не менялся. Дальше: публикация → production проверка → Sitemap и запрос переиндексации в GSC.
