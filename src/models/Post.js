import db from '../config/db.js';

class Post {
  static async create(postData) {
    const { 
      slug, title, excerpt, content, author, image_url, image_hint, 
      category, tags, is_published = false 
    } = postData;
    
    const published_at = is_published ? new Date() : null;
    
    const query = `
      INSERT INTO posts (slug, title, excerpt, content, author, image_url, image_hint, category, tags, is_published, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [slug, title, excerpt, content, author, image_url, image_hint, category, tags, is_published, published_at];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(page = 1, limit = 10, category = null, publishedOnly = true) {
    const offset = (page - 1) * limit;
    
    let countQuery = 'SELECT COUNT(*) FROM posts';
    let query = 'SELECT * FROM posts';
    let countValues = [];
    let values = [];
    let whereConditions = [];
    
    if (publishedOnly) {
      whereConditions.push('is_published = true');
    }
    
    if (category) {
      whereConditions.push(`category = $${whereConditions.length + 1}`);
      countValues.push(category);
      values.push(category);
    }
    
    if (whereConditions.length > 0) {
      const whereClause = ' WHERE ' + whereConditions.join(' AND ');
      countQuery += whereClause;
      query += whereClause;
    }
    
    query += ` ORDER BY published_at DESC, created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);
    
    const countResult = await db.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].count);
    
    const result = await db.query(query, values);
    
    return {
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id) {
    const query = 'SELECT * FROM posts WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findBySlug(slug, publishedOnly = true) {
    let query = 'SELECT * FROM posts WHERE slug = $1';
    if (publishedOnly) {
      query += ' AND is_published = true';
    }
    const result = await db.query(query, [slug]);
    return result.rows[0];
  }

  static async update(id, postData) {
    const { 
      slug, title, excerpt, content, author, image_url, image_hint, 
      category, tags, is_published 
    } = postData;
    
    // Update published_at if changing from unpublished to published
    const currentPost = await this.findById(id);
    const published_at = (!currentPost.is_published && is_published) ? new Date() : currentPost.published_at;
    
    const query = `
      UPDATE posts 
      SET slug = $1, title = $2, excerpt = $3, content = $4, author = $5, 
          image_url = $6, image_hint = $7, category = $8, tags = $9, 
          is_published = $10, published_at = $11
      WHERE id = $12
      RETURNING *
    `;
    
    const values = [slug, title, excerpt, content, author, image_url, image_hint, category, tags, is_published, published_at, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async togglePublished(id) {
    const currentPost = await this.findById(id);
    const published_at = !currentPost.is_published ? new Date() : currentPost.published_at;
    
    const query = `
      UPDATE posts 
      SET is_published = NOT is_published, published_at = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [published_at, id]);
    return result.rows[0];
  }

  static async getCategories() {
    const query = `
      SELECT category, COUNT(*) as count 
      FROM posts 
      WHERE is_published = true 
      GROUP BY category 
      ORDER BY category
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getTags() {
    const query = `
      SELECT DISTINCT unnest(tags) as tag, COUNT(*) as count
      FROM posts 
      WHERE is_published = true AND tags IS NOT NULL
      GROUP BY tag
      ORDER BY count DESC, tag
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async searchPosts(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const countQuery = `
      SELECT COUNT(*) FROM posts 
      WHERE is_published = true 
      AND (title ILIKE $1 OR excerpt ILIKE $1 OR content ILIKE $1)
    `;
    
    const query = `
      SELECT * FROM posts 
      WHERE is_published = true 
      AND (title ILIKE $1 OR excerpt ILIKE $1 OR content ILIKE $1)
      ORDER BY published_at DESC 
      LIMIT $2 OFFSET $3
    `;
    
    const searchPattern = `%${searchTerm}%`;
    
    const countResult = await db.query(countQuery, [searchPattern]);
    const total = parseInt(countResult.rows[0].count);
    
    const result = await db.query(query, [searchPattern, limit, offset]);
    
    return {
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async checkSlugExists(slug, excludeId = null) {
    let query = 'SELECT id FROM posts WHERE slug = $1';
    let values = [slug];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await db.query(query, values);
    return result.rows.length > 0;
  }
}

export default Post;