import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Post from '../models/Post.js';
import Testimonial from '../models/Testimonial.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import HeroSlide from '../models/HeroSlide.js';
import db from '../config/db.js';

class DashboardController {
  static async getDashboardStats(req, res) {
    try {
      // Get counts for all entities
      const [
        servicesResult,
        projectsResult,
        postsResult,
        testimonialsResult,
        contactsResult,
        usersResult,
        heroSlidesResult
      ] = await Promise.all([
        db.query('SELECT COUNT(*) FROM services'),
        db.query('SELECT COUNT(*) FROM projects'),
        db.query('SELECT COUNT(*) FROM posts'),
        db.query('SELECT COUNT(*) FROM testimonials'),
        db.query('SELECT COUNT(*) FROM contacts'),
        db.query('SELECT COUNT(*) FROM users'),
        db.query('SELECT COUNT(*) FROM hero_slides')
      ]);

      const stats = {
        services: parseInt(servicesResult.rows[0].count),
        projects: parseInt(projectsResult.rows[0].count),
        posts: parseInt(postsResult.rows[0].count),
        testimonials: parseInt(testimonialsResult.rows[0].count),
        contacts: parseInt(contactsResult.rows[0].count),
        users: parseInt(usersResult.rows[0].count),
        heroSlides: parseInt(heroSlidesResult.rows[0].count)
      };

      res.json({
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getMonthlyStats(req, res) {
    try {
      // Get monthly statistics for the last 6 months
      const monthlyQuery = `
        WITH months AS (
          SELECT 
            date_trunc('month', generate_series(
              date_trunc('month', CURRENT_DATE - INTERVAL '5 months'),
              date_trunc('month', CURRENT_DATE),
              '1 month'::interval
            )) AS month
        ),
        services_monthly AS (
          SELECT 
            date_trunc('month', created_at) AS month,
            COUNT(*) AS services_count
          FROM services 
          WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
          GROUP BY date_trunc('month', created_at)
        ),
        projects_monthly AS (
          SELECT 
            date_trunc('month', created_at) AS month,
            COUNT(*) AS projects_count
          FROM projects 
          WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
          GROUP BY date_trunc('month', created_at)
        ),
        posts_monthly AS (
          SELECT 
            date_trunc('month', created_at) AS month,
            COUNT(*) AS posts_count
          FROM posts 
          WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
          GROUP BY date_trunc('month', created_at)
        ),
        contacts_monthly AS (
          SELECT 
            date_trunc('month', created_at) AS month,
            COUNT(*) AS contacts_count
          FROM contacts 
          WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
          GROUP BY date_trunc('month', created_at)
        )
        SELECT 
          m.month,
          COALESCE(s.services_count, 0) AS services,
          COALESCE(p.projects_count, 0) AS projects,
          COALESCE(po.posts_count, 0) AS posts,
          COALESCE(c.contacts_count, 0) AS contacts
        FROM months m
        LEFT JOIN services_monthly s ON m.month = s.month
        LEFT JOIN projects_monthly p ON m.month = p.month
        LEFT JOIN posts_monthly po ON m.month = po.month
        LEFT JOIN contacts_monthly c ON m.month = c.month
        ORDER BY m.month;
      `;

      const result = await db.query(monthlyQuery);
      
      const monthlyData = result.rows.map(row => ({
        month: new Date(row.month).toLocaleDateString('vi-VN', { month: 'short' }),
        services: parseInt(row.services),
        projects: parseInt(row.projects),
        posts: parseInt(row.posts),
        contacts: parseInt(row.contacts)
      }));

      res.json({
        success: true,
        message: 'Monthly stats retrieved successfully',
        data: monthlyData
      });
    } catch (error) {
      console.error('Get monthly stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getCategoryStats(req, res) {
    try {
      // Get project categories statistics
      const categoryQuery = `
        SELECT 
          category,
          COUNT(*) as count
        FROM projects 
        WHERE category IS NOT NULL AND category != ''
        GROUP BY category
        ORDER BY count DESC
        LIMIT 10;
      `;

      const result = await db.query(categoryQuery);
      
      const categoryData = result.rows.map(row => ({
        name: row.category,
        value: parseInt(row.count)
      }));

      res.json({
        success: true,
        message: 'Category stats retrieved successfully',
        data: categoryData
      });
    } catch (error) {
      console.error('Get category stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getRecentActivities(req, res) {
    try {
      const limit = req.query.limit || 10;
      
      // Get recent activities from different tables
      const activitiesQuery = `
        (
          SELECT 
            'contact' as type,
            'Liên hệ mới từ ' || name as message,
            created_at,
            id
          FROM contacts 
          ORDER BY created_at DESC 
          LIMIT 3
        )
        UNION ALL
        (
          SELECT 
            'project' as type,
            'Dự án "' || title || '" được tạo' as message,
            created_at,
            id
          FROM projects 
          ORDER BY created_at DESC 
          LIMIT 3
        )
        UNION ALL
        (
          SELECT 
            'post' as type,
            'Bài viết "' || title || '" được xuất bản' as message,
            created_at,
            id
          FROM posts 
          WHERE is_published = true
          ORDER BY created_at DESC 
          LIMIT 3
        )
        UNION ALL
        (
          SELECT 
            'testimonial' as type,
            'Đánh giá ' || rating || ' sao từ ' || author as message,
            created_at,
            id
          FROM testimonials 
          ORDER BY created_at DESC 
          LIMIT 3
        )
        ORDER BY created_at DESC
        LIMIT $1;
      `;

      const result = await db.query(activitiesQuery, [limit]);
      
      const activities = result.rows.map((row, index) => ({
        id: index + 1,
        type: row.type,
        message: row.message,
        time: getTimeAgo(row.created_at)
      }));

      res.json({
        success: true,
        message: 'Recent activities retrieved successfully',
        data: activities
      });
    } catch (error) {
      console.error('Get recent activities error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getPerformanceStats(req, res) {
    try {
      // Mock performance data - you can replace with real business metrics
      const performanceQuery = `
        WITH months AS (
          SELECT 
            date_trunc('month', generate_series(
              date_trunc('month', CURRENT_DATE - INTERVAL '5 months'),
              date_trunc('month', CURRENT_DATE),
              '1 month'::interval
            )) AS month
        ),
        testimonial_ratings AS (
          SELECT 
            date_trunc('month', created_at) AS month,
            AVG(rating) AS avg_rating
          FROM testimonials 
          WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
          AND rating IS NOT NULL
          GROUP BY date_trunc('month', created_at)
        ),
        project_counts AS (
          SELECT 
            date_trunc('month', created_at) AS month,
            COUNT(*) * 50 AS revenue_estimate -- Mock revenue calculation
          FROM projects 
          WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
          GROUP BY date_trunc('month', created_at)
        )
        SELECT 
          m.month,
          COALESCE(p.revenue_estimate, 100) AS revenue,
          COALESCE(t.avg_rating, 4.5) AS satisfaction
        FROM months m
        LEFT JOIN project_counts p ON m.month = p.month
        LEFT JOIN testimonial_ratings t ON m.month = t.month
        ORDER BY m.month;
      `;

      const result = await db.query(performanceQuery);
      
      const performanceData = result.rows.map(row => ({
        month: new Date(row.month).toLocaleDateString('vi-VN', { month: 'short' }),
        revenue: parseInt(row.revenue),
        satisfaction: parseFloat(parseFloat(row.satisfaction).toFixed(1))
      }));

      res.json({
        success: true,
        message: 'Performance stats retrieved successfully',
        data: performanceData
      });
    } catch (error) {
      console.error('Get performance stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else {
    return `${diffInDays} ngày trước`;
  }
}

export default DashboardController;