const StudentModel = require('../models/student');

const addStudent = async (req, res) => {
    let newDoc = new StudentModel({
        studentName: req.body.studentName,
    });

    let data = await StudentModel.create(newDoc);
    if (data && data.length !== 0) {
        return res.status(200).json({ 'status': true, message: 'Student Created Successfully', data: data });
    } else {
        return res.status(409).json({ 'status': false, message: ["Student Created Failed"], data: [] });
    }
}

const listStudent = async (req, res) => {
    let listStudentDetails = await StudentModel.find();
    return res.status(200).json({ 'status': true, message: 'Student listed Successfully', data: listStudentDetails });
}

const assignMentor = async (req, res) => {
    try {
        await StudentModel.findOneAndUpdate({ _id: req.body.studentId }, { $set: { "mentors.$[elem].status": false } }, { arrayFilters: [{ "elem.status": { $eq: true } }] })
        let assignMentorToStudent = await StudentModel.findOneAndUpdate({ _id: req.body.studentId }, { $push: { "mentors": { "mentorId": req.body.mentorId, } } }, { new: true });
        return res.status(200).json({ 'status': true, message: 'assign mentor Successfully', data: assignMentorToStudent });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [error.toString()], data: [] });
    }
}

const unassignStudent = async (req, res) => {
    try {
        let listUnassignStudentDetails = await StudentModel.aggregate([
            {
              '$project': {
                'studentName': 1,
                'isActive': 1,
                'createdAt':1,
                'updatedAt':1,
                'mentors': {
                  '$filter': {
                    'input': '$mentors',
                    'as': 'item',
                    'cond': {
                      '$ne': [
                        '$$item.status', false
                      ]
                    }
                  }
                }
              }
            }, {
              '$match': {
                'mentors.status': {
                  '$ne': true
                }
              }
            }
          ])
        // for (let i = 0; i <= listUnassignStudentDetails.length - 1; i++){
        //     let assigning = listUnassignStudentDetails[i].mentors.filter(function (el) {
        //         return el.status == false;
        //       });
        //       console.log(assigning);
        // }
            return res.status(200).json({ 'status': true, message: 'Listed unassign mentor for Student Successfully', data: listUnassignStudentDetails });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [error.toString()], data: [] });
    }
}

module.exports = {
    addStudent,
    listStudent,
    assignMentor,
    unassignStudent
}