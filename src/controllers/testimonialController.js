import Testimonial from '../models/Testimonial.js';

class TestimonialController {
  static async getAllTestimonials(req, res) {
    try {
      const { page, limit } = req.pagination;
      const { active_only = 'true' } = req.query;
      
      const result = await Testimonial.findAll(page, limit, active_only === 'true');
      
      res.json({
        success: true,
        message: 'Testimonials retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get all testimonials error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getTestimonialById(req, res) {
    try {
      const { id } = req.params;

      const testimonial = await Testimonial.findById(id);
      
      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      res.json({
        success: true,
        message: 'Testimonial retrieved successfully',
        data: testimonial
      });
    } catch (error) {
      console.error('Get testimonial by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async createTestimonial(req, res) {
    try {
      const testimonialData = req.body;
      const newTestimonial = await Testimonial.create(testimonialData);
      
      res.status(201).json({
        success: true,
        message: 'Testimonial created successfully',
        data: newTestimonial
      });
    } catch (error) {
      console.error('Create testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateTestimonial(req, res) {
    try {
      const { id } = req.params;

      const existingTestimonial = await Testimonial.findById(id);
      if (!existingTestimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      const testimonialData = req.body;
      const updatedTestimonial = await Testimonial.update(id, testimonialData);
      
      res.json({
        success: true,
        message: 'Testimonial updated successfully',
        data: updatedTestimonial
      });
    } catch (error) {
      console.error('Update testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async toggleTestimonialActive(req, res) {
    try {
      const { id } = req.params;

      const existingTestimonial = await Testimonial.findById(id);
      if (!existingTestimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      const updatedTestimonial = await Testimonial.toggleActive(id);
      
      res.json({
        success: true,
        message: 'Testimonial status updated successfully',
        data: updatedTestimonial
      });
    } catch (error) {
      console.error('Toggle testimonial active error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async deleteTestimonial(req, res) {
    try {
      const { id } = req.params;

      const deletedTestimonial = await Testimonial.delete(id);
      
      if (!deletedTestimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      res.json({
        success: true,
        message: 'Testimonial deleted successfully',
        data: deletedTestimonial
      });
    } catch (error) {
      console.error('Delete testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getRandomTestimonials(req, res) {
    try {
      const { limit = 5 } = req.query;
      
      const testimonials = await Testimonial.getRandomTestimonials(parseInt(limit));
      
      res.json({
        success: true,
        message: 'Random testimonials retrieved successfully',
        data: testimonials
      });
    } catch (error) {
      console.error('Get random testimonials error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getRatingStats(req, res) {
    try {
      const stats = await Testimonial.getRatingStats();
      
      res.json({
        success: true,
        message: 'Rating statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get rating stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default TestimonialController;