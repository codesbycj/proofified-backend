import { query } from '../db/pool.js';

export async function requireSecretKey(req, res, next) {
  const { id } = req.params;
  const key = req.query.key;

  if (typeof key !== 'string' || key.length === 0) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { rows } = await query(
    'SELECT secret_key FROM ideas WHERE id = $1',
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: 'idea not found' });
  }

  if (rows[0].secret_key !== key) {
    return res.status(403).json({ error: 'forbidden' });
  }

  next();
}
