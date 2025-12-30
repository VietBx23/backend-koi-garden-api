import HeroSlide from '../models/HeroSlide.js';

class HeroSlideController {
  static async getAllHeroSlides(req, res) {
    try {
      const { page, limit } = req.pagination;
      const { active_only = 'true' } = req.query;
      
      const result = await HeroSlide.findAll(page, limit, active_only === 'true');
      
      res.json({
        success: true,
        message: 'Hero slides retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get all hero slides error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getHeroSlideById(req, res) {
    try {
      const { id } = req.params;

      const heroSlide = await HeroSlide.findById(id);
      
      if (!heroSlide) {
        return res.status(404).json({
          success: false,
          message: 'Hero slide not found'
        });
      }

      res.json({
        success: true,
        message: 'Hero slide retrieved successfully',
        data: heroSlide
      });
    } catch (error) {
      console.error('Get hero slide by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async createHeroSlide(req, res) {
    try {
      const heroSlideData = req.body;
      const newHeroSlide = await HeroSlide.create(heroSlideData);
      
      res.status(201).json({
        success: true,
        message: 'Hero slide created successfully',
        data: newHeroSlide
      });
    } catch (error) {
      console.error('Create hero slide error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateHeroSlide(req, res) {
    try {
      const { id } = req.params;

      const existingHeroSlide = await HeroSlide.findById(id);
      if (!existingHeroSlide) {
        return res.status(404).json({
          success: false,
          message: 'Hero slide not found'
        });
      }

      const heroSlideData = req.body;
      const updatedHeroSlide = await HeroSlide.update(id, heroSlideData);
      
      res.json({
        success: true,
        message: 'Hero slide updated successfully',
        data: updatedHeroSlide
      });
    } catch (error) {
      console.error('Update hero slide error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateHeroSlideOrder(req, res) {
    try {
      const { id } = req.params;
      const { order } = req.body;

      if (typeof order !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Order must be a number'
        });
      }

      const existingHeroSlide = await HeroSlide.findById(id);
      if (!existingHeroSlide) {
        return res.status(404).json({
          success: false,
          message: 'Hero slide not found'
        });
      }

      const updatedHeroSlide = await HeroSlide.updateOrder(id, order);
      
      res.json({
        success: true,
        message: 'Hero slide order updated successfully',
        data: updatedHeroSlide
      });
    } catch (error) {
      console.error('Update hero slide order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async reorderHeroSlides(req, res) {
    try {
      const { slideOrders } = req.body;

      if (!Array.isArray(slideOrders)) {
        return res.status(400).json({
          success: false,
          message: 'slideOrders must be an array'
        });
      }

      const updatedSlides = await HeroSlide.reorderSlides(slideOrders);
      
      res.json({
        success: true,
        message: 'Hero slides reordered successfully',
        data: updatedSlides
      });
    } catch (error) {
      console.error('Reorder hero slides error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async toggleHeroSlideActive(req, res) {
    try {
      const { id } = req.params;

      const existingHeroSlide = await HeroSlide.findById(id);
      if (!existingHeroSlide) {
        return res.status(404).json({
          success: false,
          message: 'Hero slide not found'
        });
      }

      const updatedHeroSlide = await HeroSlide.toggleActive(id);
      
      res.json({
        success: true,
        message: 'Hero slide status updated successfully',
        data: updatedHeroSlide
      });
    } catch (error) {
      console.error('Toggle hero slide active error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async deleteHeroSlide(req, res) {
    try {
      const { id } = req.params;

      const deletedHeroSlide = await HeroSlide.delete(id);
      
      if (!deletedHeroSlide) {
        return res.status(404).json({
          success: false,
          message: 'Hero slide not found'
        });
      }

      res.json({
        success: true,
        message: 'Hero slide deleted successfully',
        data: deletedHeroSlide
      });
    } catch (error) {
      console.error('Delete hero slide error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default HeroSlideController;