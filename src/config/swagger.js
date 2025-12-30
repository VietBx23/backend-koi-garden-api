import swaggerJsdoc from "swagger-jsdoc";

const isProduction = process.env.NODE_ENV === 'production';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Koi Garden Backend API",
      version: "1.0.0",
      description: "API documentation for Koi Garden Backend - Landscape Architecture & Koi Pond Services",
      contact: {
        name: "Koi Garden Team",
        email: "contact@koigarden.com"
      }
    },
    servers: isProduction ? [
      {
        url: "https://backend-koi-garden-api.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:10000",
        description: "Local development server",
      }
    ] : [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
      {
        url: "https://backend-koi-garden-api.onrender.com",
        description: "Production server",
      }
    ],
  },
  apis: ["./src/app.js", "./src/routes/*.js"], // Files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
