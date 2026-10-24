# Текущая задача

Статус: завершена — выравнивание cookie-ссылки (2026-10-24).
Причина: display:block и text-align:left у .cookie-settings; отсутствовало центрирование самой кнопки.
Решение: .footer-contacts>.cookie-settings{margin-inline:auto;text-align:center} в styles.css.
Проверка: production build OK; Chrome 390px и desktop — центр кнопки совпадает с центром контактов (погрешность <0.01px). Логика consent и страница политики не менялись.
Активных задач нет; перед следующей существенной работой заменить этот файл актуальной целью и контрольными точками.
