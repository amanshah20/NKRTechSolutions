const Order = require('../models/Order');
const DemoRequest = require('../models/DemoRequest');
const User = require('../models/User');

const getStats = async (req, res) => {
  try {
    // Get total orders
    const totalOrders = await Order.countDocuments();
    
    // Get completed projects (orders with status 'completed')
    const completedProjects = await Order.countDocuments({ status: 'completed' });
    
    // Get total demo requests
    const demoRequests = await DemoRequest.countDocuments();
    
    // Get total registered users
    const totalUsers = await User.countDocuments();
    
    // Fixed values as per client requirements
    const clientSatisfaction = 92;
    const activeClients = 2;
    const yearsOfExperience = 1;

    res.json({
      success: true,
      stats: {
        projectsCompleted: completedProjects,
        totalOrders: totalOrders,
        clientSatisfaction: clientSatisfaction,
        activeClients: activeClients,
        demoRequests: demoRequests,
        totalUsers: totalUsers,
        yearsOfExcellence: yearsOfExperience
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics' 
    });
  }
};

module.exports = { getStats };
