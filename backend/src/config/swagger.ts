import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Itinerary Generator API",
            version: "1.0.0",
            description: "API documentation untuk Itinerary Generator App",
        },
        servers: [
            {
                url: process.env.API_BASE_URL || "http://localhost:4000/api",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "accessToken", // sesuaikan nama cookie JWT kamu
                },
            },
        },
        security: [{ cookieAuth: [] }],
    },
    // path ke file yang berisi JSDoc comment @swagger
    apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);