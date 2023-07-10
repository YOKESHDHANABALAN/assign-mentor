const express = require('express');
const { mentorList, mentor , assignStudent,listMentorStundents, listPreviousMentorForStundents } = require('../controllers/mentor');
const router = express.Router();

router.post('/mentor',mentor);
router.get('/mentor',mentorList);
router.post('/mentor/assignstudent',assignStudent);
router.get('/mentor/liststudent/undermentor',listMentorStundents);
router.get('/mentor/listpreviousmentor/forstudent',listPreviousMentorForStundents);

module.exports = router;