import pool from '../pool.js';

export const getWorkspaces = async (req, res) => {
  const userId = req.user.id;

  const workspaceIds = await pool.query(
      'SELECT workspace_id FROM user_workspaces WHERE $1 = user_id',
      [userId],
  );

  const workspaceResults = await pool.query(
      'SELECT id, owner_id, data FROM workspaces WHERE id = ANY($1::UUID[])',
      [workspaceIds.rows.map((row) => row.workspace_id)],
  );

  const workspaces = workspaceResults.rows.map((ws) => ({
    id: ws.id,
    owner_id: ws.owner_id,
    ...ws.data,
  }));
  res.status(200).json(workspaces);
};

export const createWorkspace = async (req, res) => {
  const {name, description} = req.body;
  const userId = req.user.id;

  const result = await pool.query(
      `INSERT INTO workspaces (owner_id, data)
         VALUES ($1, $2)
         RETURNING *`,
      [userId, JSON.stringify({name, description})],
  );

  await pool.query(
      `INSERT INTO user_workspaces (user_id, workspace_id)
        VALUES ($1, $2)`,
      [userId, result.rows[0].id],
  );

  res.status(201).json(result.rows[0]);
};
