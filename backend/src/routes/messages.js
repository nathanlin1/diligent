import pool from '../pool.js';

export const getMessages = async (req, res) => {
  const {channelId} = req.params;

  const result = await pool.query(
      `SELECT messages.id, messages.channel_id, messages.user_id, 
     jsonb_set(messages.data,
     '{owner_name}',
     to_jsonb(users.data->>'name')) AS data
     FROM messages
     JOIN users ON messages.user_id = users.id
     WHERE messages.channel_id = $1`,
      [channelId],
  );

  res.status(200).json(result.rows);
};

export const createMessage = async (req, res) => {
  const {channelId} = req.params;
  const {content} = req.body;
  const userId = req.user.id;

  const result = await pool.query(
      `INSERT INTO messages (channel_id, user_id, data) 
      VALUES ($1, $2, $3) 
      RETURNING *`,
      [
        channelId,
        userId,
        JSON.stringify({
          content,
          timestamp: new Date().toISOString(),
        })],
  );

  res.status(201).json(result.rows[0]);
};

export const deleteMessage = async (req, res) => {
  const {messageId} = req.params;
  const userId = req.user.id;

  await pool.query(
      'DELETE FROM messages WHERE id = $1 AND user_id = $2 RETURNING *',
      [messageId, userId],
  );

  res.status(204).send();
};
