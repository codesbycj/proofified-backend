import { query } from '../db/pool.js';
import { requireString } from '../middleware/validate.js';

export async function submitFeedback(req, res) {
  const { id } = req.params;
  const { message } = req.body ?? {};

  const msgErr = requireString(message, { field: 'message', min: 5, max: 1000 });
  if (msgErr) return res.status(400).json({ error: msgErr });

  const ideaCheck = await query('SELECT 1 FROM ideas WHERE id = $1', [id]);
  if (ideaCheck.rows.length === 0) {
    return res.status(404).json({ error: 'idea not found' });
  }

  const { rows } = await query(
    `INSERT INTO feedback (idea_id, message)
     VALUES ($1, $2)
     RETURNING id, created_at`,
    [id, message.trim()]
  );

  res.status(201).json({ id: rows[0].id, createdAt: rows[0].created_at });
}

export async function listFeedback(req, res) {
  const { id } = req.params;
  const { rows } = await query(
    `SELECT id, message, created_at
       FROM feedback
      WHERE idea_id = $1
      ORDER BY created_at DESC`,
    [id]
  );
  res.json({
    items: rows.map((r) => ({ id: r.id, message: r.message, createdAt: r.created_at })),
  });
}
