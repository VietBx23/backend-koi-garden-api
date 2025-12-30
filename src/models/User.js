import db from '../config/db.js';
import bcrypt from 'bcrypt';

class User {
  static async create(userData) {
    const { email, password, name, role = 'admin', is_active = true } = userData;
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (email, password, name, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, name, role, is_active, created_at, updated_at
    `;
    
    const values = [email, hashedPassword, name, role, is_active];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(page = 1, limit = 10, activeOnly = false) {
    const offset = (page - 1) * limit;
    
    let countQuery = 'SELECT COUNT(*) FROM users';
    let query = 'SELECT id, email, name, role, is_active, created_at, updated_at FROM users';
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
    const query = 'SELECT id, email, name, role, is_active, created_at, updated_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findByEmailForAuth(email) {
    const query = 'SELECT id, email, password, name, role, is_active FROM users WHERE email = $1 AND is_active = true';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { email, name, role, is_active } = userData;
    
    const query = `
      UPDATE users 
      SET email = $1, name = $2, role = $3, is_active = $4
      WHERE id = $5
      RETURNING id, email, name, role, is_active, created_at, updated_at
    `;
    
    const values = [email, name, role, is_active, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updatePassword(id, newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const query = `
      UPDATE users 
      SET password = $1
      WHERE id = $2
      RETURNING id, email, name, role, is_active, created_at, updated_at
    `;
    
    const result = await db.query(query, [hashedPassword, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id, email, name, role';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async toggleActive(id) {
    const query = `
      UPDATE users 
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING id, email, name, role, is_active, created_at, updated_at
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async checkEmailExists(email, excludeId = null) {
    let query = 'SELECT id FROM users WHERE email = $1';
    let values = [email];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await db.query(query, values);
    return result.rows.length > 0;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async changePassword(id, currentPassword, newPassword) {
    // Get current user with password
    const user = await db.query('SELECT password FROM users WHERE id = $1', [id]);
    if (!user.rows[0]) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await this.verifyPassword(currentPassword, user.rows[0].password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Update to new password
    return await this.updatePassword(id, newPassword);
  }
}

export default User;