import Post from '../models/Post.js';

class PostController {
  static async getAllPosts(req, res) {
    try {
      const { page, limit } = req.pagination;
      const { category, published_only = 'true' } = req.query;
      
      const result = await Post.findAll(page, limit, category, published_only === 'true');
      
      res.json({
        success: true,
        message: 'Posts retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get all posts error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getPostById(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findById(id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        message: 'Post retrieved successfully',
        data: post
      });
    } catch (error) {
      console.error('Get post by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getPostBySlug(req, res) {
    try {
      const { slug } = req.params;
      const { published_only = 'true' } = req.query;
      
      const post = await Post.findBySlug(slug, published_only === 'true');
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        message: 'Post retrieved successfully',
        data: post
      });
    } catch (error) {
      console.error('Get post by slug error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async createPost(req, res) {
    try {
      const postData = req.body;
      const newPost = await Post.create(postData);
      
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: newPost
      });
    } catch (error) {
      console.error('Create post error:', error);
      
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

  static async updatePost(req, res) {
    try {
      const { id } = req.params;

      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const postData = req.body;
      const updatedPost = await Post.update(id, postData);
      
      res.json({
        success: true,
        message: 'Post updated successfully',
        data: updatedPost
      });
    } catch (error) {
      console.error('Update post error:', error);
      
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

  static async togglePostPublished(req, res) {
    try {
      const { id } = req.params;

      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const updatedPost = await Post.togglePublished(id);
      
      res.json({
        success: true,
        message: 'Post publication status updated successfully',
        data: updatedPost
      });
    } catch (error) {
      console.error('Toggle post published error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params;

      const deletedPost = await Post.delete(id);
      
      if (!deletedPost) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        message: 'Post deleted successfully',
        data: deletedPost
      });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getPostCategories(req, res) {
    try {
      const categories = await Post.getCategories();
      
      res.json({
        success: true,
        message: 'Post categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      console.error('Get post categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getPostTags(req, res) {
    try {
      const tags = await Post.getTags();
      
      res.json({
        success: true,
        message: 'Post tags retrieved successfully',
        data: tags
      });
    } catch (error) {
      console.error('Get post tags error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async searchPosts(req, res) {
    try {
      const { q: searchTerm } = req.query;
      const { page, limit } = req.pagination;
      
      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const result = await Post.searchPosts(searchTerm, page, limit);
      
      res.json({
        success: true,
        message: 'Posts search completed successfully',
        data: result.data,
        pagination: result.pagination,
        searchTerm
      });
    } catch (error) {
      console.error('Search posts error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default PostController;