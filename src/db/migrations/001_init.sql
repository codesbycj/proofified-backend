CREATE TABLE IF NOT EXISTS ideas (
  id           TEXT PRIMARY KEY,
  secret_key   TEXT NOT NULL,
  title        TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
  description  TEXT NOT NULL CHECK (length(description) BETWEEN 1 AND 2000),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reactions (
  id          BIGSERIAL PRIMARY KEY,
  idea_id     TEXT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('interested','not_interested')),
  visitor_id  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (idea_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS reactions_idea_id_idx ON reactions(idea_id);

CREATE TABLE IF NOT EXISTS feedback (
  id          BIGSERIAL PRIMARY KEY,
  idea_id     TEXT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  message     TEXT NOT NULL CHECK (length(message) BETWEEN 5 AND 1000),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feedback_idea_id_idx ON feedback(idea_id);
