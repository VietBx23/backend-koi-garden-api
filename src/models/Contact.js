import db from '../config/db.js';

class Contact {
  static async create(contactData) {
    const { name, email, phone, subject, message, status = 'new' } = contactData;
    
    const query = `
      INSERT INTO contacts (name, email, phone, subject, message, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [name, email, phone, subject, message, status];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(page = 1, limit = 10, status = null) {
    const offset = (page - 1) * limit;
    
    let countQuery = 'SELECT COUNT(*) FROM contacts';
    let query = 'SELECT * FROM contacts';
    let countValues = [];
    let values = [];
    
    if (status) {
      countQuery += ' WHERE status = $1';
      query += ' WHERE status = $1';
      countValues = [status];
      values = [status, limit, offset];
    } else {
      values = [limit, offset];
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (values.length - 1) + ' OFFSET $' + values.length;
    
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
    const query = 'SELECT * FROM contacts WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, contactData) {
    const { name, email, phone, subject, message, status } = contactData;
    
    const query = `
      UPDATE contacts 
      SET name = $1, email = $2, phone = $3, subject = $4, message = $5, status = $6
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [name, email, phone, subject, message, status, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE contacts 
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM contacts WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getStatusCounts() {
    const query = `
      SELECT status, COUNT(*) as count 
      FROM contacts 
      GROUP BY status
      ORDER BY status
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async checkEmailExists(email, excludeId = null) {
    let query = 'SELECT id FROM contacts WHERE email = $1';
    let values = [email];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await db.query(query, values);
    return result.rows.length > 0;
  }
}

export default Contact;