import pool from '../../config/db';

export const createIssue = async (
  title: string,
  description: string,
  type: string,
  reporter_id: number
) => {
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporter_id]
  );
  return result.rows[0];
};

export const getAllIssues = async (
  sort: string,
  type?: string,
  status?: string
) => {
  let query = 'SELECT * FROM issues WHERE 1=1';
  const index: string[] = [];
  let count = 1;

  if (type) {
    query += ` AND type = $${count}`;
    index.push(type);
    count++;
  }

  if (status) {
    query += ` AND status = $${count}`;
    index.push(status);
    count++;
  }

  query += ` ORDER BY created_at ${sort === 'oldest' ? 'ASC' : 'DESC'}`;

  const result = await pool.query(query, index);
  return result.rows;
};

export const getIssueById = async (id: number) => {
  const result = await pool.query(
    'SELECT * FROM issues WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const getReporterById = async (id: number) => {
  const result = await pool.query(
    'SELECT id, name, role FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const updateIssue = async (
  id: number,
  title: string,
  description: string,
  type: string
) => {
  const result = await pool.query(
    `UPDATE issues SET title = $1, description = $2, type = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [title, description, type, id]
  );
  return result.rows[0];
};

export const deleteIssue = async (id: number) => {
  await pool.query('DELETE FROM issues WHERE id = $1', [id]);
};