const express = require('express');
const { addStudent,listStudent,assignMentor,unassignStudent } = require('../controllers/student');
const router = express.Router();

router.post('/student',addStudent);
router.get('/student',listStudent);
router.patch('/student/assignmentor',assignMentor);
router.get('/student/unassign',unassignStudent);


module.exports = router;