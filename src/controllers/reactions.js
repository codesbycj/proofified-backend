import { query } from '../db/pool.js';
import { requireString } from '../middleware/validate.js';

const VALID_TYPES = new Set(['interested', 'not_interested']);

export async function react(req, res) {
  const { id } = req.params;
  const { type, visitorId } = req.body ?? {};

  if (!VALID_TYPES.has(type)) {
    return res.status(400).json({ error: "type must be 'interested' or 'not_interested'" });
  }

  const visitorErr = requireString(visitorId, { field: 'visitorId', min: 8, max: 64 });
  if (visitorErr) return res.status(400).json({ error: visitorErr });

  const ideaCheck = await query('SELECT 1 FROM ideas WHERE id = $1', [id]);
  if (ideaCheck.rows.length === 0) {
    return res.status(404).json({ error: 'idea not found' });
  }

  await query(
    `INSERT INTO reactions (idea_id, type, visitor_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (idea_id, visitor_id) DO UPDATE SET type = EXCLUDED.type, created_at = now()`,
    [id, type, visitorId.trim()]
  );

  res.json({ ok: true, type });
}
