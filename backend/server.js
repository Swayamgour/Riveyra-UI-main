const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// const {seedProjects} = require('./projectsSeed')
require('dotenv').config();

// Import routes
const servicesRoutes = require('./routes/servicesRoutes');
// const aiServicesRoutes = require('./routes/aiServices');
const projectRoutes = require('./routes/projectRoutes')
const careerRoutes = require('./routes/careerRoutes')
const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require("./routes/categoryRoutes");
const blogRoutes = require("./routes/blogRoutes");
const pageSeoRoutes = require("./routes/pageSeoRoutes");
const pageRoutes = require("./routes/serviceDetailTwo");

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api', limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// seedProjects()
// console.log(Service.schema.path("seo.keywords"));

// Routes
app.use(`/api/${process.env.API_VERSION}/auth`, authRoutes);
app.use(`/api/${process.env.API_VERSION}/services`, servicesRoutes);
// app.use(`/api/${process.env.API_VERSION}/ai-services`, aiServicesRoutes);
app.use(`/api/${process.env.API_VERSION}/projects`, projectRoutes)
app.use(`/api/${process.env.API_VERSION}/careers`, careerRoutes)
app.use(`/api/${process.env.API_VERSION}/apply`, applicationRoutes);
app.use(`/api/${process.env.API_VERSION}/dashboard`, dashboardRoutes);
app.use(`/api/${process.env.API_VERSION}/contact`, contactRoutes);
app.use(`/api/${process.env.API_VERSION}/categories`, categoryRoutes);
app.use(`/api/${process.env.API_VERSION}/blogs`, blogRoutes);
app.use(`/api/${process.env.API_VERSION}/page-seo`, pageSeoRoutes);
app.use(`/api/${process.env.API_VERSION}`, pageRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: '22/07/2026',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });

});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use(require('./middleware/errorHandler'));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}/api/${process.env.API_VERSION}`);
});

module.exports = app;