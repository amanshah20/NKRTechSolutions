require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Feedback = require('../models/Feedback');

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nkr_tech';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // Create default admin
    const adminExists = await Admin.findOne({ email: 'admin@nkrtech.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await Admin.create({
        email: 'admin@nkrtech.com',
        password: hashedPassword
      });
      console.log('✅ Default admin created');
      console.log('   📧 Email: admin@nkrtech.com');
      console.log('   🔑 Password: Admin@123');
    } else {
      console.log('✅ Default admin already exists');
    }

    // Create sample feedback
    const feedbackCount = await Feedback.countDocuments();
    
    if (feedbackCount === 0) {
      const sampleFeedback = [
        {
          name: 'Kiara Jewellery Pvt Ltd',
          email: 'info@kiarajewellery.com',
          company: 'Jewellery Manufacturing & Retail',
          rating: 5,
          message: 'NKR Tech Solutions delivered an outstanding ERP system for our company. Their AI-powered features have significantly improved our operational efficiency. Highly recommended!',
          isApproved: true
        },
        {
          name: 'Chandra Jewellery',
          email: 'contact@chandrajewellery.com',
          company: 'Jewellery & Ornaments',
          rating: 5,
          message: 'Working with NKR Tech Solutions was a great experience. They understood our requirements perfectly and delivered a custom solution that exceeded our expectations. Professional and reliable!',
          isApproved: true
        },
        {
          name: 'Amit Patel',
          email: 'amit.patel@manufacturing.com',
          company: 'Manufacturing Solutions Inc',
          rating: 4,
          message: 'The industrial automation software developed by NKR Tech Solutions has streamlined our manufacturing processes. Great team, excellent support, and timely delivery!',
          isApproved: true
        }
      ];

      await Feedback.insertMany(sampleFeedback);
      console.log('✅ Sample feedback created (3 entries)');
    } else {
      console.log(`✅ Feedback collection already has ${feedbackCount} entries`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('You can now start the server with: npm start\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
