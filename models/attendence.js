const mongoose = require('mongoose')

const attendenceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    totalLecturesByTeacher: {
        type: Number,
        default:0
    },
    lectureAttended: {
        type: Number,
        default:0
    }
})

const attendenceModel = new mongoose.model('Attendence', attendenceSchema);

module.exports = attendenceModel;