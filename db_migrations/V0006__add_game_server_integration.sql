-- Добавление полей для интеграции с игровыми серверами

ALTER TABLE t_p6171346_neutron_launch.challenges 
ADD COLUMN IF NOT EXISTS server_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS server_host VARCHAR(255),
ADD COLUMN IF NOT EXISTS match_started_at TIMESTAMP;

ALTER TABLE t_p6171346_neutron_launch.matches
ADD COLUMN IF NOT EXISTS server_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS server_host VARCHAR(255),
ADD COLUMN IF NOT EXISTS match_stats TEXT;

CREATE INDEX IF NOT EXISTS idx_challenges_server ON t_p6171346_neutron_launch.challenges(server_id);
CREATE INDEX IF NOT EXISTS idx_matches_server ON t_p6171346_neutron_launch.matches(server_id);
