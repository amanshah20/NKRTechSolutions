const db = require('../database/init');

const getStats = (req, res) => {
  try {
    // Get total orders
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
    
    // Get completed projects (orders with status 'completed')
    const completedProjects = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'").get();
    
    // Get total demo requests
    const demoRequests = db.prepare('SELECT COUNT(*) as count FROM demo_requests').get();
    
    // Get total registered users
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
    
    // Fixed values as per client requirements
    const clientSatisfaction = 92;
    const activeClients = 2;
    const yearsOfExperience = 1;

    res.json({
      success: true,
      stats: {
        projectsCompleted: completedProjects.count,
        totalOrders: totalOrders.count,
        clientSatisfaction: clientSatisfaction,
        activeClients: activeClients,
        demoRequests: demoRequests.count,
        totalUsers: totalUsers.count,
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
