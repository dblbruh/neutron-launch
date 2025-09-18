-- Добавляем поля для Steam авторизации
ALTER TABLE users ADD COLUMN IF NOT EXISTS steam_id VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'local';
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS real_name VARCHAR(255);

-- Создаем индекс для быстрого поиска по Steam ID
CREATE INDEX IF NOT EXISTS idx_users_steam_id ON users(steam_id);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);