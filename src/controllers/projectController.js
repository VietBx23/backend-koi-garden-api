import Project from '../models/Project.js';

class ProjectController {
  static async getAllProjects(req, res) {
    try {
      const { page, limit } = req.pagination;
      const { category, active_only = 'true' } = req.query;
      
      const result = await Project.findAll(page, limit, category, active_only === 'true');
      
      res.json({
        success: true,
        message: 'Projects retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get all projects error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getProjectById(req, res) {
    try {
      const { id } = req.params;

      const project = await Project.findById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.json({
        success: true,
        message: 'Project retrieved successfully',
        data: project
      });
    } catch (error) {
      console.error('Get project by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async createProject(req, res) {
    try {
      const projectData = req.body;
      const newProject = await Project.create(projectData);
      
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: newProject
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateProject(req, res) {
    try {
      const { id } = req.params;

      const existingProject = await Project.findById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const projectData = req.body;
      const updatedProject = await Project.update(id, projectData);
      
      res.json({
        success: true,
        message: 'Project updated successfully',
        data: updatedProject
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async toggleProjectActive(req, res) {
    try {
      const { id } = req.params;

      const existingProject = await Project.findById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const updatedProject = await Project.toggleActive(id);
      
      res.json({
        success: true,
        message: 'Project status updated successfully',
        data: updatedProject
      });
    } catch (error) {
      console.error('Toggle project active error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async deleteProject(req, res) {
    try {
      const { id } = req.params;

      const deletedProject = await Project.delete(id);
      
      if (!deletedProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.json({
        success: true,
        message: 'Project deleted successfully',
        data: deletedProject
      });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getProjectCategories(req, res) {
    try {
      const categories = await Project.getCategories();
      
      res.json({
        success: true,
        message: 'Project categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      console.error('Get project categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getProjectStyles(req, res) {
    try {
      const styles = await Project.getStyles();
      
      res.json({
        success: true,
        message: 'Project styles retrieved successfully',
        data: styles
      });
    } catch (error) {
      console.error('Get project styles error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default ProjectController;