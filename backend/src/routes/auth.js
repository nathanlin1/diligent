import jwt from 'jsonwebtoken';
import pool from '../pool.js';

export const login = async (req, res) => {
  const {email, password} = req.body;

  const userResult = await pool.query(
      'SELECT * FROM users WHERE data->>\'email\' = $1',
      [email],
  );

  if (userResult.rows.length === 0) {
    return res.status(401).json({error: 'Invalid email or password'});
  }

  const user = userResult.rows[0];

  const passwordCheckResult = await pool.query(
      `SELECT (data->>'password_hash') = crypt($1, data->>'password_hash')
        AS password_match FROM users 
        WHERE id = $2`,
      [password, user.id],
  );

  const passwordMatch = passwordCheckResult.rows[0].password_match;

  if (!passwordMatch) {
    return res.status(401).json({error: 'Invalid email or password'});
  }

  const token = jwt.sign({userId: user.id}, process.env.SECRET, {
    expiresIn: '1h',
  });

  res.json({token});
};
