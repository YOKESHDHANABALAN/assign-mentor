const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const StudentSchema = new Schema({
    studentName : { type: String },
    mentors                :  [{ type: new mongoose.Schema ({
        mentorId                :     { type: ObjectId},
        status              :     { type: Boolean, default: true },
    },{ timestamps: true })}],
    isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true
    });
const Students = mongoose.model('students', StudentSchema);

module.exports = Students;