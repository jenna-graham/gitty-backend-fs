const pool = require('../utils/pool');

module.exports = class Post {
  id;
  title;
  post;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.post = row.post;
  }

  static async getPosts() {
    const { rows } = await pool.query(
      `
        SELECT * from new_post;
        `
    );
    return rows.map((row) => new Post(row));
  }

  static async createNewPost(post) {
    const { rows } = await pool.query(
      `
        INSERT INTO new_post (title, post)
        VALUES ($1, $2)
        RETURNING *
        `,
      [post.title, post.post]
    );
    return new Post(rows[0]);
  }
};
