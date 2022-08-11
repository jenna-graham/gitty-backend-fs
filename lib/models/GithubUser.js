const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  email;
  avatar;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
  }

  static async addUser({ username, email, avatar }) {
    if (!username) throw new Error('Username is required');

    const { rows } = await pool.query(
      `
        INSERT INTO github_user (username, email, avatar)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [username, email, avatar]
    );
    return new GithubUser(rows[0]);
  }

  static async findByUsername({ username }) {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM github_user
        WHERE username = $1
        `,
      [username]
    );

    if (!rows[0]) return null;
    return new GithubUser(rows[0]);
  }

  toJSON() {
    return { ...this };
  }
};
