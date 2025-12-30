import db from '../config/db.js';

class Project {
  static async create(projectData) {
    const { 
      title, category, style, location, cost, date, 
      image_url, image_hint, is_active = true 
    } = projectData;
    
    const query = `
      INSERT INTO projects (title, category, style, location, cost, date, image_url, image_hint, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [title, category, style, location, cost, date, image_url, image_hint, is_active];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(page = 1, limit = 10, category = null, activeOnly = true) {
    const offset = (page - 1) * limit;
    
    let countQuery = 'SELECT COUNT(*) FROM projects';
    let query = 'SELECT * FROM projects';
    let countValues = [];
    let values = [];
    let whereConditions = [];
    
    if (activeOnly) {
      whereConditions.push('is_active = true');
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
    
    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
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
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, projectData) {
    const { 
      title, category, style, location, cost, date, 
      image_url, image_hint, is_active 
    } = projectData;
    
    const query = `
      UPDATE projects 
      SET title = $1, category = $2, style = $3, location = $4, cost = $5, 
          date = $6, image_url = $7, image_hint = $8, is_active = $9
      WHERE id = $10
      RETURNING *
    `;
    
    const values = [title, category, style, location, cost, date, image_url, image_hint, is_active, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async toggleActive(id) {
    const query = `
      UPDATE projects 
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getCategories() {
    const query = `
      SELECT category, COUNT(*) as count 
      FROM projects 
      WHERE is_active = true 
      GROUP BY category 
      ORDER BY category
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getStyles() {
    const query = `
      SELECT style, COUNT(*) as count 
      FROM projects 
      WHERE is_active = true AND style IS NOT NULL 
      GROUP BY style 
      ORDER BY style
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

export default Project;