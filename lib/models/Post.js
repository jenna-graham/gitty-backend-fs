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
};
