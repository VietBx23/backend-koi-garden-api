import db from '../config/db.js';

class Service {
  static async create(serviceData) {
    const { 
      slug, title, description, icon, image_url, image_hint, 
      details, benefits, process, pricing, is_active = true 
    } = serviceData;
    
    // Use title for both name and title columns
    const name = title;
    
    const query = `
      INSERT INTO services (name, slug, title, description, icon, image_url, image_hint, details, benefits, process, pricing, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const values = [name, slug, title, description, icon, image_url, image_hint, details, benefits, process, pricing, is_active];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(page = 1, limit = 10, activeOnly = false, search = '') {
    const offset = (page - 1) * limit;
    
    let countQuery = 'SELECT COUNT(*) FROM services';
    let query = 'SELECT * FROM services';
    let countValues = [];
    let values = [];
    let whereConditions = [];
    let paramIndex = 1;
    
    if (activeOnly) {
      whereConditions.push(`is_active = $${paramIndex}`);
      countValues.push(true);
      values.push(true);
      paramIndex++;
    }
    
    if (search && search.trim()) {
      whereConditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      const searchPattern = `%${search.trim()}%`;
      countValues.push(searchPattern);
      values.push(searchPattern);
      paramIndex++;
    }
    
    if (whereConditions.length > 0) {
      const whereClause = ' WHERE ' + whereConditions.join(' AND ');
      countQuery += whereClause;
      query += whereClause;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
    const query = 'SELECT * FROM services WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const query = 'SELECT * FROM services WHERE slug = $1 AND is_active = true';
    const result = await db.query(query, [slug]);
    return result.rows[0];
  }

  static async update(id, serviceData) {
    const { 
      slug, title, description, icon, image_url, image_hint, 
      details, benefits, process, pricing, is_active 
    } = serviceData;
    
    // Use title for both name and title columns
    const name = title;
    
    const query = `
      UPDATE services 
      SET name = $1, slug = $2, title = $3, description = $4, icon = $5, image_url = $6, 
          image_hint = $7, details = $8, benefits = $9, process = $10, pricing = $11, is_active = $12
      WHERE id = $13
      RETURNING *
    `;
    
    const values = [name, slug, title, description, icon, image_url, image_hint, details, benefits, process, pricing, is_active, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM services WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async toggleActive(id) {
    const query = `
      UPDATE services 
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async checkSlugExists(slug, excludeId = null) {
    let query = 'SELECT id FROM services WHERE slug = $1';
    let values = [slug];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await db.query(query, values);
    return result.rows.length > 0;
  }
}

export default Service;