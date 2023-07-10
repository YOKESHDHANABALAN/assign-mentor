const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const MentorSchema = new Schema({
    mentorName : { type: String },
    studentId : { type: Array},
    isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true
    });
const Mentor = mongoose.model('mentor', MentorSchema);

module.exports = Mentor;