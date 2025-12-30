import db from '../config/db.js';

class Testimonial {
  static async create(testimonialData) {
    const { 
      quote, author, location, rating = 5, 
      image_url, image_hint, is_active = true 
    } = testimonialData;
    
    const query = `
      INSERT INTO testimonials (quote, author, location, rating, image_url, image_hint, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [quote, author, location, rating, image_url, image_hint, is_active];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(page = 1, limit = 10, activeOnly = true) {
    const offset = (page - 1) * limit;
    
    let countQuery = 'SELECT COUNT(*) FROM testimonials';
    let query = 'SELECT * FROM testimonials';
    let countValues = [];
    let values = [];
    
    if (activeOnly) {
      countQuery += ' WHERE is_active = true';
      query += ' WHERE is_active = true';
    }
    
    query += ' ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    values = [limit, offset];
    
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
    const query = 'SELECT * FROM testimonials WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, testimonialData) {
    const { 
      quote, author, location, rating, 
      image_url, image_hint, is_active 
    } = testimonialData;
    
    const query = `
      UPDATE testimonials 
      SET quote = $1, author = $2, location = $3, rating = $4, 
          image_url = $5, image_hint = $6, is_active = $7
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [quote, author, location, rating, image_url, image_hint, is_active, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM testimonials WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async toggleActive(id) {
    const query = `
      UPDATE testimonials 
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getRandomTestimonials(limit = 5) {
    const query = `
      SELECT * FROM testimonials 
      WHERE is_active = true 
      ORDER BY RANDOM() 
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
  }

  static async getRatingStats() {
    const query = `
      SELECT 
        rating,
        COUNT(*) as count,
        ROUND(AVG(rating), 2) as average_rating,
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
      FROM testimonials 
      WHERE is_active = true 
      GROUP BY rating 
      ORDER BY rating DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

export default Testimonial;