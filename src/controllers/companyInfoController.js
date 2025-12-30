import CompanyInfo from '../models/CompanyInfo.js';

class CompanyInfoController {
  static async getAllCompanyInfo(req, res) {
    try {
      const companyInfo = await CompanyInfo.findAll();
      
      res.json({
        success: true,
        message: 'Company information retrieved successfully',
        data: companyInfo
      });
    } catch (error) {
      console.error('Get all company info error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getCompanyInfoById(req, res) {
    try {
      const { id } = req.params;

      const companyInfo = await CompanyInfo.findById(id);
      
      if (!companyInfo) {
        return res.status(404).json({
          success: false,
          message: 'Company information not found'
        });
      }

      res.json({
        success: true,
        message: 'Company information retrieved successfully',
        data: companyInfo
      });
    } catch (error) {
      console.error('Get company info by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getCompanyInfoByKey(req, res) {
    try {
      const { key } = req.params;

      const companyInfo = await CompanyInfo.findByKey(key);
      
      if (!companyInfo) {
        return res.status(404).json({
          success: false,
          message: 'Company information not found'
        });
      }

      res.json({
        success: true,
        message: 'Company information retrieved successfully',
        data: companyInfo
      });
    } catch (error) {
      console.error('Get company info by key error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async createCompanyInfo(req, res) {
    try {
      const companyInfoData = req.body;
      const newCompanyInfo = await CompanyInfo.create(companyInfoData);
      
      res.status(201).json({
        success: true,
        message: 'Company information created successfully',
        data: newCompanyInfo
      });
    } catch (error) {
      console.error('Create company info error:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Key already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateCompanyInfo(req, res) {
    try {
      const { id } = req.params;

      const existingCompanyInfo = await CompanyInfo.findById(id);
      if (!existingCompanyInfo) {
        return res.status(404).json({
          success: false,
          message: 'Company information not found'
        });
      }

      const companyInfoData = req.body;
      const updatedCompanyInfo = await CompanyInfo.update(id, companyInfoData);
      
      res.json({
        success: true,
        message: 'Company information updated successfully',
        data: updatedCompanyInfo
      });
    } catch (error) {
      console.error('Update company info error:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Key already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateCompanyInfoByKey(req, res) {
    try {
      const { key } = req.params;
      const { data } = req.body;

      if (!data) {
        return res.status(400).json({
          success: false,
          message: 'Data is required'
        });
      }

      const updatedCompanyInfo = await CompanyInfo.updateByKey(key, data);
      
      if (!updatedCompanyInfo) {
        return res.status(404).json({
          success: false,
          message: 'Company information not found'
        });
      }

      res.json({
        success: true,
        message: 'Company information updated successfully',
        data: updatedCompanyInfo
      });
    } catch (error) {
      console.error('Update company info by key error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async upsertCompanyInfoByKey(req, res) {
    try {
      const { key } = req.params;
      const { data } = req.body;

      if (!data) {
        return res.status(400).json({
          success: false,
          message: 'Data is required'
        });
      }

      const companyInfo = await CompanyInfo.upsertByKey(key, data);
      
      res.json({
        success: true,
        message: 'Company information saved successfully',
        data: companyInfo
      });
    } catch (error) {
      console.error('Upsert company info by key error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async deleteCompanyInfo(req, res) {
    try {
      const { id } = req.params;

      const deletedCompanyInfo = await CompanyInfo.delete(id);
      
      if (!deletedCompanyInfo) {
        return res.status(404).json({
          success: false,
          message: 'Company information not found'
        });
      }

      res.json({
        success: true,
        message: 'Company information deleted successfully',
        data: deletedCompanyInfo
      });
    } catch (error) {
      console.error('Delete company info error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Predefined endpoints for common company info types
  static async getStats(req, res) {
    try {
      const stats = await CompanyInfo.getStats();
      
      res.json({
        success: true,
        message: 'Company stats retrieved successfully',
        data: stats ? stats.data : null
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateStats(req, res) {
    try {
      const { data } = req.body;

      if (!data) {
        return res.status(400).json({
          success: false,
          message: 'Stats data is required'
        });
      }

      const updatedStats = await CompanyInfo.updateStats(data);
      
      res.json({
        success: true,
        message: 'Company stats updated successfully',
        data: updatedStats
      });
    } catch (error) {
      console.error('Update stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getCoreValues(req, res) {
    try {
      const coreValues = await CompanyInfo.getCoreValues();
      
      res.json({
        success: true,
        message: 'Core values retrieved successfully',
        data: coreValues ? coreValues.data : null
      });
    } catch (error) {
      console.error('Get core values error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateCoreValues(req, res) {
    try {
      const { data } = req.body;

      if (!data) {
        return res.status(400).json({
          success: false,
          message: 'Core values data is required'
        });
      }

      const updatedCoreValues = await CompanyInfo.updateCoreValues(data);
      
      res.json({
        success: true,
        message: 'Core values updated successfully',
        data: updatedCoreValues
      });
    } catch (error) {
      console.error('Update core values error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default CompanyInfoController;