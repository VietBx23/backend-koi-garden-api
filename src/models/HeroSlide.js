import db from '../config/db.js';

class HeroSlide {
  static async create(slideData) {
    const { 
      title, description, button_text, button_link, 
      image_url, image_hint, order = 0, is_active = true 
    } = slideData;
    
    const query = `
      INSERT INTO hero_slides (title, description, button_text, button_link, image_url, image_hint, "order", is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [title, description, button_text, button_link, image_url, image_hint, order, is_active];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(page = 1, limit = 10, activeOnly = true) {
    const offset = (page - 1) * limit;
    
    let countQuery = 'SELECT COUNT(*) FROM hero_slides';
    let query = 'SELECT * FROM hero_slides';
    let countValues = [];
    let values = [];
    
    if (activeOnly) {
      countQuery += ' WHERE is_active = true';
      query += ' WHERE is_active = true';
    }
    
    query += ' ORDER BY "order" ASC, created_at DESC LIMIT $1 OFFSET $2';
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
    const query = 'SELECT * FROM hero_slides WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, slideData) {
    const { 
      title, description, button_text, button_link, 
      image_url, image_hint, order, is_active 
    } = slideData;
    
    const query = `
      UPDATE hero_slides 
      SET title = $1, description = $2, button_text = $3, button_link = $4, 
          image_url = $5, image_hint = $6, "order" = $7, is_active = $8
      WHERE id = $9
      RETURNING *
    `;
    
    const values = [title, description, button_text, button_link, image_url, image_hint, order, is_active, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM hero_slides WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async toggleActive(id) {
    const query = `
      UPDATE hero_slides 
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async updateOrder(id, newOrder) {
    const query = `
      UPDATE hero_slides 
      SET "order" = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [newOrder, id]);
    return result.rows[0];
  }

  static async reorderSlides(slideOrders) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const results = [];
      for (const { id, order } of slideOrders) {
        const query = 'UPDATE hero_slides SET "order" = $1 WHERE id = $2 RETURNING *';
        const result = await client.query(query, [order, id]);
        results.push(result.rows[0]);
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default HeroSlide;