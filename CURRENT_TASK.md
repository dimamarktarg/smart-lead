# Текущая задача

Статус: завершена — установка через меню браузера (2026-10-24).

## Результат
- Smart Lead получил manifest (standalone, start_url и scope /), иконки PNG 192/512 и Apple 180, SVG-оригинал мишени по логотипу.
- Head главной и политики содержит manifest, Apple metadata и новую favicon. Никаких кнопок, баннеров, диалогов установки или service worker на сайте нет — прямое уточнение пользователя.
- Публикация кода: main, commit 5ba3f547b550973e104cab6216d048e0a34ee53a, Cloudflare Pages success.

## Проверка
- Vite production build OK; размеры PNG и ссылки собранных страниц проверены.
- Body обеих страниц, app.js и styles.css совпадают с версией до задачи.
- Chrome local и production: Page.getAppManifest errors=[], Page.getInstallabilityErrors installabilityErrors=[]. Production видит пять контактных форм и ноль новых элементов UI установки.
- Само приложение на устройстве пользователя не устанавливали. Для работы нужен интернет.

## Передача
Активных задач нет. При новой существенной задаче заменить этот файл её целью, ограничениями и контрольными точками до основного анализа. Источник кода — GitHub main → Cloudflare Pages; не использовать архивный build-worker.mjs для публикации.
