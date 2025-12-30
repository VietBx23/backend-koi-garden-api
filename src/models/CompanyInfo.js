import db from '../config/db.js';

class CompanyInfo {
  static async create(infoData) {
    const { key, data } = infoData;
    
    const query = `
      INSERT INTO company_info (key, data)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const values = [key, JSON.stringify(data)];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM company_info ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM company_info WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByKey(key) {
    const query = 'SELECT * FROM company_info WHERE key = $1';
    const result = await db.query(query, [key]);
    return result.rows[0];
  }

  static async update(id, infoData) {
    const { key, data } = infoData;
    
    const query = `
      UPDATE company_info 
      SET key = $1, data = $2
      WHERE id = $3
      RETURNING *
    `;
    
    const values = [key, JSON.stringify(data), id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateByKey(key, data) {
    const query = `
      UPDATE company_info 
      SET data = $1
      WHERE key = $2
      RETURNING *
    `;
    
    const values = [JSON.stringify(data), key];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async upsertByKey(key, data) {
    const query = `
      INSERT INTO company_info (key, data)
      VALUES ($1, $2)
      ON CONFLICT (key) 
      DO UPDATE SET data = $2
      RETURNING *
    `;
    
    const values = [key, JSON.stringify(data)];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM company_info WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async deleteByKey(key) {
    const query = 'DELETE FROM company_info WHERE key = $1 RETURNING *';
    const result = await db.query(query, [key]);
    return result.rows[0];
  }

  static async checkKeyExists(key, excludeId = null) {
    let query = 'SELECT id FROM company_info WHERE key = $1';
    let values = [key];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await db.query(query, values);
    return result.rows.length > 0;
  }

  // Predefined methods for common company info types
  static async getStats() {
    return this.findByKey('stats');
  }

  static async getCoreValues() {
    return this.findByKey('coreValues');
  }

  static async getWorkingProcess() {
    return this.findByKey('workingProcess');
  }

  static async getAboutStory() {
    return this.findByKey('aboutStory');
  }

  static async getMissionVision() {
    return this.findByKey('missionVision');
  }

  static async updateStats(data) {
    return this.upsertByKey('stats', data);
  }

  static async updateCoreValues(data) {
    return this.upsertByKey('coreValues', data);
  }

  static async updateWorkingProcess(data) {
    return this.upsertByKey('workingProcess', data);
  }

  static async updateAboutStory(data) {
    return this.upsertByKey('aboutStory', data);
  }

  static async updateMissionVision(data) {
    return this.upsertByKey('missionVision', data);
  }
}

export default CompanyInfo;