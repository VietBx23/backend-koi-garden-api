import Setting from '../models/Setting.js';

class SettingController {
  static async getAllSettings(req, res) {
    try {
      const settings = await Setting.findAll();
      
      res.json({
        success: true,
        message: 'Settings retrieved successfully',
        data: settings
      });
    } catch (error) {
      console.error('Get all settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getSettingById(req, res) {
    try {
      const { id } = req.params;

      const setting = await Setting.findById(id);
      
      if (!setting) {
        return res.status(404).json({
          success: false,
          message: 'Setting not found'
        });
      }

      res.json({
        success: true,
        message: 'Setting retrieved successfully',
        data: setting
      });
    } catch (error) {
      console.error('Get setting by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getSettingByKey(req, res) {
    try {
      const { key } = req.params;

      const setting = await Setting.findByKey(key);
      
      if (!setting) {
        return res.status(404).json({
          success: false,
          message: 'Setting not found'
        });
      }

      res.json({
        success: true,
        message: 'Setting retrieved successfully',
        data: setting
      });
    } catch (error) {
      console.error('Get setting by key error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async createSetting(req, res) {
    try {
      const settingData = req.body;
      const newSetting = await Setting.create(settingData);
      
      res.status(201).json({
        success: true,
        message: 'Setting created successfully',
        data: newSetting
      });
    } catch (error) {
      console.error('Create setting error:', error);
      
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

  static async updateSetting(req, res) {
    try {
      const { id } = req.params;

      const existingSetting = await Setting.findById(id);
      if (!existingSetting) {
        return res.status(404).json({
          success: false,
          message: 'Setting not found'
        });
      }

      const settingData = req.body;
      const updatedSetting = await Setting.update(id, settingData);
      
      res.json({
        success: true,
        message: 'Setting updated successfully',
        data: updatedSetting
      });
    } catch (error) {
      console.error('Update setting error:', error);
      
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

  static async updateSettingByKey(req, res) {
    try {
      const { key } = req.params;
      const { value, type } = req.body;

      if (value === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Value is required'
        });
      }

      const updatedSetting = await Setting.updateByKey(key, value, type);
      
      if (!updatedSetting) {
        return res.status(404).json({
          success: false,
          message: 'Setting not found'
        });
      }

      res.json({
        success: true,
        message: 'Setting updated successfully',
        data: updatedSetting
      });
    } catch (error) {
      console.error('Update setting by key error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async upsertSettingByKey(req, res) {
    try {
      const { key } = req.params;
      const { value, type = 'string' } = req.body;

      if (value === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Value is required'
        });
      }

      const setting = await Setting.upsertByKey(key, value, type);
      
      res.json({
        success: true,
        message: 'Setting saved successfully',
        data: setting
      });
    } catch (error) {
      console.error('Upsert setting by key error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async deleteSetting(req, res) {
    try {
      const { id } = req.params;

      const deletedSetting = await Setting.delete(id);
      
      if (!deletedSetting) {
        return res.status(404).json({
          success: false,
          message: 'Setting not found'
        });
      }

      res.json({
        success: true,
        message: 'Setting deleted successfully',
        data: deletedSetting
      });
    } catch (error) {
      console.error('Delete setting error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getMultipleSettings(req, res) {
    try {
      const { keys } = req.body;

      if (!Array.isArray(keys)) {
        return res.status(400).json({
          success: false,
          message: 'Keys must be an array'
        });
      }

      const settings = await Setting.getMultipleByKeys(keys);
      
      res.json({
        success: true,
        message: 'Settings retrieved successfully',
        data: settings
      });
    } catch (error) {
      console.error('Get multiple settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Predefined endpoints for common settings
  static async getSiteName(req, res) {
    try {
      const siteName = await Setting.getSiteName();
      
      res.json({
        success: true,
        message: 'Site name retrieved successfully',
        data: { site_name: siteName }
      });
    } catch (error) {
      console.error('Get site name error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async setSiteName(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Site name is required'
        });
      }

      const updatedSetting = await Setting.setSiteName(name);
      
      res.json({
        success: true,
        message: 'Site name updated successfully',
        data: updatedSetting
      });
    } catch (error) {
      console.error('Set site name error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getContactInfo(req, res) {
    try {
      const contactInfo = await Setting.getContactInfo();
      
      res.json({
        success: true,
        message: 'Contact information retrieved successfully',
        data: contactInfo
      });
    } catch (error) {
      console.error('Get contact info error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getSocialLinks(req, res) {
    try {
      const socialLinks = await Setting.getSocialLinks();
      
      res.json({
        success: true,
        message: 'Social links retrieved successfully',
        data: socialLinks
      });
    } catch (error) {
      console.error('Get social links error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async setSocialLinks(req, res) {
    try {
      const { links } = req.body;

      if (!links || typeof links !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Social links object is required'
        });
      }

      const updatedSetting = await Setting.setSocialLinks(links);
      
      res.json({
        success: true,
        message: 'Social links updated successfully',
        data: updatedSetting
      });
    } catch (error) {
      console.error('Set social links error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default SettingController;