jobseeker-backend/
│
├── config/
│   └── db.js          # Database connection
│
├── controllers/       # Route handlers
│   ├── authController.js
│   ├── jobController.js
│   ├── profileController.js
│   └── applicationController.js
│
├── middleware/        # Custom middleware
│   └── authMiddleware.js
│
├── models/            # Database models
│   ├── User.js
│   ├── Profile.js
│   ├── Job.js
│   ├── Application.js
│   └── SavedJob.js
│
├── routes/            # API routes
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   ├── profileRoutes.js
│   └── applicationRoutes.js
│
├── .env               # Environment variables
├── .gitignore         # Git ignore file
├── app.js             # Main application file
└── server.js          # Server entry point