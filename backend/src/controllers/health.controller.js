import { getHealthStatus, getDatabaseHealthStatus } from '../services/healthService.js'

const getHealth = async (req, res) => {
  const health = getHealthStatus();

  res.status(200).json({
    success: true,
    data: health,
    timestamp: new Date().toISOString(),
  });
};

const getDatabaseHealth = async (req, res) => {
  const dbHealth = getDatabaseHealthStatus();
  
  res.status(200).json({
    success: true,
    data: dbHealth,
    timestamp: new Date().toISOString(),
  });
}

export { getHealth, getDatabaseHealth };

// a controller handles the http layer
// a controller can access --> req.params, req.body, req.query, req.user
// and call our services

// For example:
// POST /api/notes
//        ↓
// createNoteController()
//        ↓
// noteService.createNote()
//        ↓
// MongoDB