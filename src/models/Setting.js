import db from '../config/db.js';

class Setting {
  static async create(settingData) {
    const { key, value, type = 'string' } = settingData;
    
    const query = `
      INSERT INTO settings (key, value, type)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [key, value, type];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM settings ORDER BY key ASC';
    const result = await db.query(query);
    
    // Convert values based on type
    return result.rows.map(setting => ({
      ...setting,
      value: this.parseValue(setting.value, setting.type)
    }));
  }

  static async findById(id) {
    const query = 'SELECT * FROM settings WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows[0]) {
      const setting = result.rows[0];
      setting.value = this.parseValue(setting.value, setting.type);
      return setting;
    }
    
    return null;
  }

  static async findByKey(key) {
    const query = 'SELECT * FROM settings WHERE key = $1';
    const result = await db.query(query, [key]);
    
    if (result.rows[0]) {
      const setting = result.rows[0];
      setting.value = this.parseValue(setting.value, setting.type);
      return setting;
    }
    
    return null;
  }

  static async update(id, settingData) {
    const { key, value, type } = settingData;
    
    const query = `
      UPDATE settings 
      SET key = $1, value = $2, type = $3
      WHERE id = $4
      RETURNING *
    `;
    
    const values = [key, this.stringifyValue(value, type), type, id];
    const result = await db.query(query, values);
    
    if (result.rows[0]) {
      const setting = result.rows[0];
      setting.value = this.parseValue(setting.value, setting.type);
      return setting;
    }
    
    return null;
  }

  static async updateByKey(key, value, type = null) {
    // If type is not provided, get existing type
    if (!type) {
      const existing = await this.findByKey(key);
      type = existing ? existing.type : 'string';
    }
    
    const query = `
      UPDATE settings 
      SET value = $1, type = $2
      WHERE key = $3
      RETURNING *
    `;
    
    const values = [this.stringifyValue(value, type), type, key];
    const result = await db.query(query, values);
    
    if (result.rows[0]) {
      const setting = result.rows[0];
      setting.value = this.parseValue(setting.value, setting.type);
      return setting;
    }
    
    return null;
  }

  static async upsertByKey(key, value, type = 'string') {
    const query = `
      INSERT INTO settings (key, value, type)
      VALUES ($1, $2, $3)
      ON CONFLICT (key) 
      DO UPDATE SET value = $2, type = $3
      RETURNING *
    `;
    
    const values = [key, this.stringifyValue(value, type), type];
    const result = await db.query(query, values);
    
    if (result.rows[0]) {
      const setting = result.rows[0];
      setting.value = this.parseValue(setting.value, setting.type);
      return setting;
    }
    
    return null;
  }

  static async delete(id) {
    const query = 'DELETE FROM settings WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async deleteByKey(key) {
    const query = 'DELETE FROM settings WHERE key = $1 RETURNING *';
    const result = await db.query(query, [key]);
    return result.rows[0];
  }

  static async checkKeyExists(key, excludeId = null) {
    let query = 'SELECT id FROM settings WHERE key = $1';
    let values = [key];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await db.query(query, values);
    return result.rows.length > 0;
  }

  static async getMultipleByKeys(keys) {
    if (!keys || keys.length === 0) return [];
    
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(',');
    const query = `SELECT * FROM settings WHERE key IN (${placeholders})`;
    
    const result = await db.query(query, keys);
    
    // Convert values and create key-value object
    const settings = {};
    result.rows.forEach(setting => {
      settings[setting.key] = this.parseValue(setting.value, setting.type);
    });
    
    return settings;
  }

  // Helper methods for type conversion
  static parseValue(value, type) {
    switch (type) {
      case 'number':
        return parseFloat(value);
      case 'boolean':
        return value === 'true';
      case 'json':
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      default:
        return value;
    }
  }

  static stringifyValue(value, type) {
    switch (type) {
      case 'json':
        return typeof value === 'string' ? value : JSON.stringify(value);
      case 'boolean':
        return String(Boolean(value));
      case 'number':
        return String(Number(value));
      default:
        return String(value);
    }
  }

  // Predefined settings methods
  static async getSiteName() {
    const setting = await this.findByKey('site_name');
    return setting ? setting.value : 'Cảnh Quan Kiến Trúc Xanh';
  }

  static async setSiteName(name) {
    return this.upsertByKey('site_name', name, 'string');
  }

  static async getContactInfo() {
    const keys = ['contact_phone', 'contact_email', 'contact_address'];
    return this.getMultipleByKeys(keys);
  }

  static async getSocialLinks() {
    const setting = await this.findByKey('social_links');
    return setting ? setting.value : {};
  }

  static async setSocialLinks(links) {
    return this.upsertByKey('social_links', links, 'json');
  }
}

export default Setting;