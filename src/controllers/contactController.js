import Contact from '../models/Contact.js';

class ContactController {
  static async getAllContacts(req, res) {
    try {
      const { page, limit } = req.pagination;
      const { status } = req.query;
      
      const result = await Contact.findAll(page, limit, status);
      
      res.json({
        success: true,
        message: 'Contacts retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get all contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getContactById(req, res) {
    try {
      const { id } = req.params;

      const contact = await Contact.findById(id);
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.json({
        success: true,
        message: 'Contact retrieved successfully',
        data: contact
      });
    } catch (error) {
      console.error('Get contact by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async createContact(req, res) {
    try {
      const contactData = req.body;
      const newContact = await Contact.create(contactData);
      
      res.status(201).json({
        success: true,
        message: 'Contact created successfully',
        data: newContact
      });
    } catch (error) {
      console.error('Create contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateContact(req, res) {
    try {
      const { id } = req.params;

      const existingContact = await Contact.findById(id);
      if (!existingContact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      const contactData = req.body;
      const updatedContact = await Contact.update(id, contactData);
      
      res.json({
        success: true,
        message: 'Contact updated successfully',
        data: updatedContact
      });
    } catch (error) {
      console.error('Update contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async updateContactStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const existingContact = await Contact.findById(id);
      if (!existingContact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      const updatedContact = await Contact.updateStatus(id, status);
      
      res.json({
        success: true,
        message: 'Contact status updated successfully',
        data: updatedContact
      });
    } catch (error) {
      console.error('Update contact status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async deleteContact(req, res) {
    try {
      const { id } = req.params;

      const deletedContact = await Contact.delete(id);
      
      if (!deletedContact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.json({
        success: true,
        message: 'Contact deleted successfully',
        data: deletedContact
      });
    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getContactStats(req, res) {
    try {
      const statusCounts = await Contact.getStatusCounts();
      
      // Transform array to object for easier frontend consumption
      const stats = statusCounts.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {});
      
      // Ensure all statuses are present with 0 if not found
      const allStatuses = ['new', 'read', 'replied'];
      allStatuses.forEach(status => {
        if (!stats[status]) {
          stats[status] = 0;
        }
      });
      
      res.json({
        success: true,
        message: 'Contact statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get contact stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default ContactController;