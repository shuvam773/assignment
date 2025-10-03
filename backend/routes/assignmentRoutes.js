const { createAssignment, getAssignments } = require('../controllers/assignmentCtrl');
const authorizeRole = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = require('express').Router();


router.post('/create-assignment', authMiddleware,authorizeRole("teachers"), createAssignment);

router.get('/assignment',authMiddleware,authorizeRole("teachers", "students"), getAssignments);

module.exports = router;