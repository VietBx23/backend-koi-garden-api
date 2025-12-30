import Service from '../models/Service.js';

class ServiceController {
  static async getAllServices(req, res) {
    try {
      const { page, limit } = req.pagination;
      const { active_only = 'false', search = '' } = req.query;
      
      const result = await Service.findAll(page, limit, active_only === 'true', search);
      
      res.json({
        success: true,
        message: 'Services retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get all services error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getServiceById(req, res) {
    try {
      const { id } = req.params;

      const service = await Service.findById(id);
      
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        message: 'Service retrieved successfully',
        data: service
      });
    } catch (error) {
      console.error('Get service by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getServiceBySlug(req, res) {
    try {
      const { slug } = req.params;
      
      const service = await Service.findBySlug(slug);
      
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        message: 'Service retrieved successfully',
        data: service
      });
    } catch (error) {
      console.error('Get service by slug error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async createService(req, res) {
    try {
      const serviceData = req.body;
      const newService = await Service.create(serviceData);
      
      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: newService
      });
    } catch (error) {
      console.error('Create service error:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateService(req, res) {
    try {
      const { id } = req.params;

      const existingService = await Service.findById(id);
      if (!existingService) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      const serviceData = req.body;
      const updatedService = await Service.update(id, serviceData);
      
      res.json({
        success: true,
        message: 'Service updated successfully',
        data: updatedService
      });
    } catch (error) {
      console.error('Update service error:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async toggleServiceActive(req, res) {
    try {
      const { id } = req.params;

      const existingService = await Service.findById(id);
      if (!existingService) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      const updatedService = await Service.toggleActive(id);
      
      res.json({
        success: true,
        message: 'Service status updated successfully',
        data: updatedService
      });
    } catch (error) {
      console.error('Toggle service active error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async deleteService(req, res) {
    try {
      const { id } = req.params;

      const deletedService = await Service.delete(id);
      
      if (!deletedService) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        message: 'Service deleted successfully',
        data: deletedService
      });
    } catch (error) {
      console.error('Delete service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default ServiceController;