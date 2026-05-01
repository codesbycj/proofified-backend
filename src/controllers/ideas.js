import { query } from '../db/pool.js';
import { newIdeaId, newSecretKey } from '../lib/ids.js';
import { requireString } from '../middleware/validate.js';

export async function createIdea(req, res) {
  const { title, description } = req.body ?? {};

  const titleErr = requireString(title, { field: 'title', min: 1, max: 120 });
  if (titleErr) return res.status(400).json({ error: titleErr });

  const descErr = requireString(description, { field: 'description', min: 1, max: 2000 });
  if (descErr) return res.status(400).json({ error: descErr });

  const id = newIdeaId();
  const secretKey = newSecretKey();

  const { rows } = await query(
    `INSERT INTO ideas (id, secret_key, title, description)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, created_at`,
    [id, secretKey, title.trim(), description.trim()]
  );

  const idea = rows[0];
  res.status(201).json({
    id: idea.id,
    secretKey,
    title: idea.title,
    description: idea.description,
    createdAt: idea.created_at,
  });
}

export async function getStats(req, res) {
  const { id } = req.params;
  const { rows } = await query(
    `SELECT
       COUNT(*) FILTER (WHERE type = 'interested')      AS interested,
       COUNT(*) FILTER (WHERE type = 'not_interested')  AS not_interested,
       COUNT(*)                                         AS total
     FROM reactions
     WHERE idea_id = $1`,
    [id]
  );

  const fb = await query(
    'SELECT COUNT(*)::int AS count FROM feedback WHERE idea_id = $1',
    [id]
  );

  const r = rows[0];
  res.json({
    interested: Number(r.interested),
    notInterested: Number(r.not_interested),
    total: Number(r.total),
    feedbackCount: fb.rows[0].count,
  });
}

export async function getIdea(req, res) {
  const { id } = req.params;
  const { rows } = await query(
    `SELECT id, title, description, created_at FROM ideas WHERE id = $1`,
    [id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'idea not found' });
  }
  const idea = rows[0];
  res.json({
    id: idea.id,
    title: idea.title,
    description: idea.description,
    createdAt: idea.created_at,
  });
}
