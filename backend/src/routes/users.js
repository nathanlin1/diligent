import pool from '../pool.js';

export const getUserByEmail = async (req, res) => {
  const {email} = req.params;

  const result = await pool.query(
      'SELECT id FROM users WHERE data->>\'email\' = $1',
      [email],
  );

  res.status(200).json({id: result.rows[0].id});
};
