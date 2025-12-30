import Service from '../models/Service.js';
import Contact from '../models/Contact.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Service validation
export const validateService = async (req, res, next) => {
  try {
    const { slug, title, description, icon, image_url, details, benefits, process, pricing } = req.body;
    const errors = [];

    if (!slug || slug.trim().length === 0) {
      errors.push('Slug is required');
    } else if (slug.length > 255) {
      errors.push('Slug must not exceed 255 characters');
    } else {
      const excludeId = req.method === 'PUT' ? req.params.id : null;
      const slugExists = await Service.checkSlugExists(slug, excludeId);
      if (slugExists) {
        errors.push('Slug already exists');
      }
    }

    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    } else if (title.length > 255) {
      errors.push('Title must not exceed 255 characters');
    }

    if (!description || description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (icon && icon.length > 100) {
      errors.push('Icon name must not exceed 100 characters');
    }

    if (image_url && !validateUrl(image_url)) {
      errors.push('Invalid image URL format');
    }

    if (details && !Array.isArray(details)) {
      errors.push('Details must be an array');
    }

    if (benefits && !Array.isArray(benefits)) {
      errors.push('Benefits must be an array');
    }

    if (process && !Array.isArray(process)) {
      errors.push('Process must be an array');
    }

    if (pricing && !Array.isArray(pricing)) {
      errors.push('Pricing must be an array');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  } catch (error) {
    console.error('Service validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: error.message
    });
  }
};

// Project validation
export const validateProject = (req, res, next) => {
  try {
    const { title, category, location, image_url } = req.body;
    const errors = [];

    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    } else if (title.length > 255) {
      errors.push('Title must not exceed 255 characters');
    }

    if (!category || category.trim().length === 0) {
      errors.push('Category is required');
    } else if (category.length > 50) {
      errors.push('Category must not exceed 50 characters');
    }

    if (!location || location.trim().length === 0) {
      errors.push('Location is required');
    } else if (location.length > 255) {
      errors.push('Location must not exceed 255 characters');
    }

    if (!image_url || !validateUrl(image_url)) {
      errors.push('Valid image URL is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  } catch (error) {
    console.error('Project validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: error.message
    });
  }
};

// Post validation
export const validatePost = async (req, res, next) => {
  try {
    const { slug, title, content, author, category } = req.body;
    const errors = [];

    if (!slug || slug.trim().length === 0) {
      errors.push('Slug is required');
    } else if (slug.length > 255) {
      errors.push('Slug must not exceed 255 characters');
    } else {
      const excludeId = req.method === 'PUT' ? req.params.id : null;
      const slugExists = await Post.checkSlugExists(slug, excludeId);
      if (slugExists) {
        errors.push('Slug already exists');
      }
    }

    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    } else if (title.length > 255) {
      errors.push('Title must not exceed 255 characters');
    }

    if (!content || content.trim().length === 0) {
      errors.push('Content is required');
    }

    if (!author || author.trim().length === 0) {
      errors.push('Author is required');
    } else if (author.length > 255) {
      errors.push('Author must not exceed 255 characters');
    }

    if (!category || category.trim().length === 0) {
      errors.push('Category is required');
    } else if (category.length > 100) {
      errors.push('Category must not exceed 100 characters');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  } catch (error) {
    console.error('Post validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: error.message
    });
  }
};

// Testimonial validation
export const validateTestimonial = (req, res, next) => {
  try {
    const { quote, author, location, rating } = req.body;
    const errors = [];

    if (!quote || quote.trim().length === 0) {
      errors.push('Quote is required');
    }

    if (!author || author.trim().length === 0) {
      errors.push('Author is required');
    } else if (author.length > 255) {
      errors.push('Author must not exceed 255 characters');
    }

    if (!location || location.trim().length === 0) {
      errors.push('Location is required');
    } else if (location.length > 255) {
      errors.push('Location must not exceed 255 characters');
    }

    if (rating !== undefined) {
      const ratingNum = parseInt(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        errors.push('Rating must be between 1 and 5');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  } catch (error) {
    console.error('Testimonial validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: error.message
    });
  }
};

// Contact validation
export const validateContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    const errors = [];

    if (!name || name.trim().length === 0) {
      errors.push('Name is required');
    } else if (name.length > 255) {
      errors.push('Name must not exceed 255 characters');
    }

    if (!email || !validateEmail(email)) {
      errors.push('Valid email is required');
    } else if (email.length > 255) {
      errors.push('Email must not exceed 255 characters');
    }

    if (phone && !validatePhone(phone)) {
      errors.push('Invalid phone number format');
    } else if (phone && phone.length > 20) {
      errors.push('Phone number must not exceed 20 characters');
    }

    if (!message || message.trim().length === 0) {
      errors.push('Message is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  } catch (error) {
    console.error('Contact validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: error.message
    });
  }
};

// Contact status validation
export const validateContactStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['new', 'read', 'replied'];
  
  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be one of: new, read, replied'
    });
  }
  
  next();
};

// Hero slide validation
export const validateHeroSlide = (req, res, next) => {
  try {
    const { title, description, button_text, button_link, image_url } = req.body;
    const errors = [];

    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    } else if (title.length > 255) {
      errors.push('Title must not exceed 255 characters');
    }

    if (!description || description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!button_text || button_text.trim().length === 0) {
      errors.push('Button text is required');
    } else if (button_text.length > 100) {
      errors.push('Button text must not exceed 100 characters');
    }

    if (!button_link || button_link.trim().length === 0) {
      errors.push('Button link is required');
    } else if (button_link.length > 255) {
      errors.push('Button link must not exceed 255 characters');
    }

    if (!image_url || !validateUrl(image_url)) {
      errors.push('Valid image URL is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  } catch (error) {
    console.error('Hero slide validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: error.message
    });
  }
};

// User validation
export const validateUser = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    const errors = [];

    if (!email || !validateEmail(email)) {
      errors.push('Valid email is required');
    } else if (email.length > 255) {
      errors.push('Email must not exceed 255 characters');
    } else {
      const excludeId = req.method === 'PUT' ? req.params.id : null;
      const emailExists = await User.checkEmailExists(email, excludeId);
      if (emailExists) {
        errors.push('Email already exists');
      }
    }

    if (req.method === 'POST') {
      if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
    }

    if (!name || name.trim().length === 0) {
      errors.push('Name is required');
    } else if (name.length > 255) {
      errors.push('Name must not exceed 255 characters');
    }

    if (role && !['admin', 'editor'].includes(role)) {
      errors.push('Role must be either admin or editor');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  } catch (error) {
    console.error('User validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: error.message
    });
  }
};

// Pagination validation
export const validatePagination = (req, res, next) => {
  let { page = 1, limit = 10 } = req.query;
  
  page = parseInt(page);
  limit = parseInt(limit);
  
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  
  if (isNaN(limit) || limit < 1) {
    limit = 10;
  }
  
  if (limit > 100) {
    limit = 100;
  }
  
  req.pagination = { page, limit };
  next();
};