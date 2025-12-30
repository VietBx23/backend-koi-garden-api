import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
});

const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing database for production deployment...');
    console.log('📍 Host:', process.env.DB_HOST);
    console.log('📊 Database:', process.env.DB_NAME);
    
    // Check if tables already exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('✅ Database tables already exist. Skipping initialization.');
      console.log('📋 Existing tables:', tablesResult.rows.map(row => row.table_name).join(', '));
      return;
    }

    console.log('🔄 Creating database tables...');

    // Services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(100),
        image_url TEXT,
        image_hint TEXT,
        details JSONB,
        benefits JSONB,
        process JSONB,
        pricing JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        style VARCHAR(100),
        location VARCHAR(255) NOT NULL,
        cost VARCHAR(100),
        date VARCHAR(20),
        image_url TEXT,
        image_hint TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        image_url TEXT,
        image_hint TEXT,
        category VARCHAR(100) NOT NULL,
        tags JSONB,
        is_published BOOLEAN DEFAULT false,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Testimonials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        quote TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        image_url TEXT,
        image_hint TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Hero slides table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        button_text VARCHAR(100) NOT NULL,
        button_link VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        image_hint TEXT,
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Company info table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_info (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        website VARCHAR(255),
        social_media JSONB,
        business_hours JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All tables created successfully!');

    // Insert sample data only if tables are empty
    const servicesCount = await pool.query('SELECT COUNT(*) FROM services');
    if (parseInt(servicesCount.rows[0].count) === 0) {
      console.log('🔄 Inserting sample data...');

      // Sample services
      await pool.query(`
        INSERT INTO services (slug, title, description, icon, is_active) VALUES
        ('thiet-ke-san-vuon', 'Thiết kế sân vườn', 'Thiết kế và thi công sân vườn theo phong cách hiện đại, cổ điển và nhiệt đới', 'Leaf', true),
        ('thi-cong-ho-koi', 'Thi công hồ Koi', 'Thi công hồ cá Koi chuyên nghiệp với hệ thống lọc nước hiện đại', 'Waves', true),
        ('bao-tri-canh-quan', 'Bảo trì cảnh quan', 'Dịch vụ bảo trì và chăm sóc cảnh quan định kỳ', 'Scissors', true)
      `);

      // Sample projects
      await pool.query(`
        INSERT INTO projects (title, category, style, location, cost, date, is_active) VALUES
        ('Biệt thự hiện đại Quận 2', 'Sân Vườn', 'Hiện đại', 'Quận 2, TP.HCM', '~ 200 triệu', '2024', true),
        ('Hồ Koi resort Đà Lạt', 'Hồ Koi', 'Zen Nhật Bản', 'Đà Lạt', '~ 150 triệu', '2023', true),
        ('Công viên mini Thủ Đức', 'Cảnh Quan Công Cộng', 'Nhiệt đới', 'Thủ Đức, TP.HCM', '~ 500 triệu', '2024', true)
      `);

      console.log('✅ Sample data inserted successfully!');
    } else {
      console.log('✅ Sample data already exists. Skipping insertion.');
    }

    console.log('🎉 Database initialization completed successfully!');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run initialization
initializeDatabase();