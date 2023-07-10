const MentorModel = require('../models/mentor');
const StudentModel = require('../models/student');
const mongoose = require('mongoose');
const Schema = mongoose.Schema,
ObjectId = mongoose.Types.ObjectId;

const mentor = async (req, res) => {
    let newDoc = new MentorModel({
        mentorName : req.body.mentorName,
        studentId : req.body.studentId,
        isActive: req.body.isActive
    });

    let data = await MentorModel.create(newDoc);
    if (data && data.length !== 0) {
        return res.status(200).json({ 'status': true, message: 'mentor section Successfully', data: data });
    } else {
        return res.status(409).json({ 'status': false, 'message': ["mentor section Failed"], data: [] });
    }
}



const mentorList = async (req, res) => {
    let mentorListDetails = await MentorModel.find();
    return res.status(200).json({ 'status': true, message: 'mentor listed Successfully', data: mentorListDetails });
}



const assignStudent = async (req, res) => {

    await MentorModel.findOneAndUpdate({ _id: req.body.mentorId }, { $set: { "studentId":  [] } }, { new: true });

    let updateStudent = await MentorModel.findOneAndUpdate({ _id: req.body.mentorId }, { $set: { "studentId":  req.body.studentId } }, { new: true });

    for(i=0; i<=req.body.studentId.length;i++)
    {
        await StudentModel.findOneAndUpdate({ _id: req.body.studentId[i] }, { $push: { "mentors": { "mentorId": req.body.mentorId, } } }, { new: true });
    }


    return res.status(200).json({ 'status': true, message: 'mentor listed Successfully', data: updateStudent,});
}



const listMentorStundents = async (req, res) => {
    let studentListUndermentor = await MentorModel.aggregate(
        [
          {
            $match: {
              _id: new ObjectId(req.query.mentorId)
            }
          },
          {
            $unwind: {
              path: '$studentId',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'students',
              localField: 'studentId',
              foreignField: '_id',
              as: 'result'
            }
          },
          { $unwind: { path: '$result' } },
          {
            $group: {
              _id: '$_id',
              mentorName: { $first: '$mentorName' },
              studentId: { $first: '$studentId' },
              isActive: { $first: '$isActive' },
              result: { $push: '$result' }
            }
          }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      );
    return res.status(200).json({ 'status': true, message: 'Listed students under one mentor listed Successfully', data: studentListUndermentor });
}


const listPreviousMentorForStundents= async (req, res) => {
    let previousMentorListUnderStudent = await StudentModel.aggregate(
        [
          {
            $match: {
              _id: new ObjectId(req.query.studentId)
            }
          },
          { $unwind: { path: '$mentors' } },
          { $match: { 'mentors.status': false } },
          {
            $lookup: {
              from: 'mentors',
              localField: 'mentors.mentorId',
              foreignField: '_id',
              as: 'result'
            }
          },
          { $unwind: { path: '$result' } },
          {
            $group: {
              _id: '$_id',
              studentName: { $first: '$studentName' },
              isActive: { $first: '$isActive' },
              result: { $push: '$result' }
            }
          }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      );
    return res.status(200).json({ 'status': true, message: 'Listed students under one mentor listed Successfully', data: previousMentorListUnderStudent });
}

module.exports = {
    mentor,
    mentorList,
    assignStudent,
    listMentorStundents,
    listPreviousMentorForStundents
}