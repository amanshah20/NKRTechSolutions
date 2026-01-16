# NKR Tech Solutions

A professional, enterprise-grade business website built with React and Node.js for NKR Tech Solutions - a leading provider of AI-powered software solutions.

## 🚀 Features

### Client-Facing Website
- **Home Page**: Hero section with company overview and key statistics
- **About Us**: Company mission, vision, values, and track record
- **Services**: Comprehensive list of 8+ enterprise services
- **Why Choose Us**: Glassmorphism design showcasing competitive advantages
- **Request Demo**: Functional form to request product demonstrations
- **Place Order**: Complete order form with budget and timeline options
- **Contact Us**: Contact form with business information

### Admin Dashboard
- **Secure Authentication**: JWT-based login system
- **Dashboard Overview**: Real-time statistics and recent activity
- **Demo Request Management**: View, update status, and delete demo requests
- **Order Management**: Full CRUD operations for client orders
- **Contact Management**: View and manage customer inquiries
- **Real-time Data**: All statistics calculated from actual database entries

## 🛠️ Technology Stack

### Frontend
- **React** (Create React App)
- **React Router** (Client-side routing)
- **Axios** (API requests)
- **Lucide Icons** (Professional icon library)
- **Pure CSS** (No frameworks - custom professional design)

### Backend
- **Node.js** & **Express.js** (Server framework)
- **SQLite** with **better-sqlite3** (Database)
- **JWT** (Authentication)
- **bcryptjs** (Password hashing)
- **Nodemailer** (Email notifications)
- **express-validator** (Input validation)

## 📁 Project Structure

```
nkr-tech-solution/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── pages/          # Page components
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── Services.js
│   │   │   ├── WhyChooseUs.js
│   │   │   ├── RequestDemo.js
│   │   │   ├── PlaceOrder.js
│   │   │   ├── Contact.js
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminDashboard.js
│   │   ├── styles/         # CSS files
│   │   │   ├── global.css
│   │   │   ├── navbar.css
│   │   │   ├── hero.css
│   │   │   ├── footer.css
│   │   │   ├── admin.css
│   │   │   └── dashboard.css
│   │   ├── utils/
│   │   │   └── api.js      # API service
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── demoController.js
│   │   ├── orderController.js
│   │   ├── contactController.js
│   │   └── adminController.js
│   ├── database/
│   │   └── init.js         # Database initialization
│   ├── middleware/
│   │   └── auth.js         # JWT authentication
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── demo.js
│   │   ├── orders.js
│   │   ├── contact.js
│   │   └── admin.js
│   ├── utils/
│   │   └── emailService.js # Email functionality
│   ├── .env
│   ├── server.js           # Main server file
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "g:\Semester-7\client project\nkr-tech-solution"
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Edit `server/.env` file with your email credentials:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@nkrtechsolution.com
ADMIN_EMAIL=admin@nkrtechsolution.com
```

### Running the Application

1. **Start the backend server**
```bash
cd server
npm start
```
Server will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal)**
```bash
cd client
npm start
```
Client will run on `http://localhost:3000`

## 🔐 Admin Access

**Default Admin Credentials:**
- Email: `admin@nkrtech.com`
- Password: `Admin@123`

**Admin Dashboard URL:** `http://localhost:3000/admin/login`

## 📋 API Endpoints

### Public Endpoints
- `POST /api/demo` - Submit demo request
- `POST /api/orders` - Place an order
- `POST /api/contact` - Send contact message

### Admin Endpoints (JWT Protected)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/demo` - Get all demo requests
- `PUT /api/admin/demo/:id` - Update demo request status
- `DELETE /api/admin/demo/:id` - Delete demo request
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `DELETE /api/admin/orders/:id` - Delete order
- `GET /api/admin/contacts` - Get all contacts
- `DELETE /api/admin/contacts/:id` - Delete contact

## 🎨 Design System

### Color Palette
- Primary: `#0A66C2` (Professional Blue)
- Secondary: `#0FB9B1` (Teal)
- Background: `#F7F9FC` (Light Gray)
- Dark: `#0F172A` (Navy)
- Text: `#0F172A` (Dark) / `#64748B` (Light)

### Typography
- Font Family: Inter
- Headings: 700-800 weight
- Body: 400-500 weight

### Components
- Border Radius: 16px
- Shadows: Soft, layered
- Transitions: 0.3s ease
- Cards: Hover lift effect

## 📧 Email Notifications

The system sends automated emails for:
- Demo request confirmations (to client)
- Order confirmations (to client)
- Contact form confirmations (to client)
- Admin notifications (for all submissions)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected admin routes
- Input validation
- SQL injection prevention (parameterized queries)
- CORS configuration
- Environment variable protection

## 🚀 Production Deployment

### Build the frontend
```bash
cd client
npm run build
```

### Environment Configuration
1. Update `.env` with production values
2. Change `JWT_SECRET` to a strong random string
3. Configure production email credentials
4. Set `NODE_ENV=production`

### Database
- The SQLite database will be created automatically on first run
- Database file: `server/database/nkr_tech.db`
- Backup regularly for production use

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px, 968px
- Touch-friendly navigation
- Optimized for all screen sizes

## ✅ Quality Assurance

- Form validation on client and server
- Error handling and user feedback
- Loading states
- Success/error messages
- Professional UI/UX
- Cross-browser compatibility

## 🤝 Support

For issues or questions:
- Email: info@nkrtechsolution.com
- Phone: +1 (555) 123-4567

## 📄 License

This project is proprietary software of NKR Tech Solutions.

---

**Built with ❤️ by NKR Tech Solutions Team**
"# NKRTechSolutions" 
