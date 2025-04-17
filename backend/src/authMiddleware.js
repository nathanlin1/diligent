import jwt from 'jsonwebtoken';
import pool from './pool.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader.split(' ')[1];

  const decoded = jwt.verify(token, process.env.SECRET);

  const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [decoded.userId],
  );

  req.user = userResult.rows[0];
  next();
};
