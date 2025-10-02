-- Назначаем первого пользователя администратором
UPDATE users SET is_admin = TRUE WHERE id = 1;