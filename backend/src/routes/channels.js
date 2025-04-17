import pool from '../pool.js';

export const getChannels = async (req, res) => {
  const {workspaceId} = req.params;
  const result = await pool.query(
      `SELECT * 
      FROM channels 
      WHERE workspace_id = $1`,
      [workspaceId],
  );

  res.status(200).json(result.rows);
};

export const createChannel = async (req, res) => {
  const {workspaceId} = req.params;
  const {name, description} = req.body;

  const data = {name, description};
  const result = await pool.query(
      `INSERT INTO channels (workspace_id, data) 
        VALUES ($1, $2) 
        RETURNING *`,
      [workspaceId, data],
  );

  res.status(201).json(result.rows[0]);
};
