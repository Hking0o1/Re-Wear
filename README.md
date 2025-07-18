# ReWear - Community Clothing Exchange Platform

A sustainable fashion platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system.

## Features

### Frontend (React + TypeScript)
- **User Authentication**: Email/password signup and login
- **Landing Page**: Platform introduction with featured items carousel
- **User Dashboard**: Profile management, points balance, and swap history
- **Item Browsing**: Advanced filtering and search functionality
- **Item Management**: Upload and manage clothing listings
- **Swap System**: Request swaps or redeem items with points
- **Admin Panel**: Content moderation and platform oversight
- **Responsive Design**: Mobile-first approach with modern UI

### Backend (Express.js + MySQL)
- **RESTful API**: Comprehensive API with proper error handling
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: MySQL with connection pooling and transactions
- **File Upload**: Multer integration for image uploads
- **Validation**: Express-validator for input validation
- **Admin Features**: User management and content moderation
- **Point System**: Automated point transactions and rewards

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for development and building

### Backend
- Node.js with Express.js
- MySQL 2 for database operations
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Express-validator for validation
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rewear
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=rewear_db
   DB_USER=root
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

4. **Set up MySQL database**
   - Create a MySQL database named `rewear_db`
   - The application will automatically create tables on first run

5. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   npm run server:dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Items
- `GET /api/items` - Get items with filters
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (with image upload)
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/categories` - Get categories

### Swaps
- `GET /api/swaps` - Get swap requests
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id/respond` - Respond to swap request
- `POST /api/swaps/redeem` - Redeem item with points

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/items` - Items for moderation
- `PUT /api/admin/items/:id/moderate` - Approve/reject items
- `GET /api/admin/users` - User management
- `PUT /api/admin/users/:id/status` - Toggle user status
- `GET /api/admin/analytics` - Platform analytics

## Database Schema

### Users
- User profiles with points system
- Admin role management
- Account status tracking

### Clothing Items
- Detailed item information
- Category and condition tracking
- Approval workflow
- Image and tag associations

### Swap Requests
- Swap request management
- Status tracking (pending, accepted, declined, completed)
- Point-based redemption support

### Point Transactions
- Complete transaction history
- Multiple transaction types (earned, spent, bonus, penalty)
- Audit trail for all point movements

## Default Login Credentials

### Admin Account
- Email: `admin@rewear.com`
- Password: `password`

### Regular User
- Email: `sarah@example.com`
- Password: `password`

## File Upload

Images are stored in the `uploads/items/` directory. In production, consider using cloud storage services like AWS S3 or Cloudinary.

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention
- File upload restrictions
- CORS configuration
- Rate limiting ready (can be added with express-rate-limit)

## Development

### Running Tests
```bash
# Add your test commands here
npm test
```

### Building for Production
```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm run server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@rewear.com or create an issue in the repository.
