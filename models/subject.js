const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true
    },
    subjectCode: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: true,
        trim: true
    },
    totalLectures: {
        type: Number,
        default:30
    },
    year: {
        type: Number,
        required: true 
    },
})

const subjectModel = new mongoose.model("Subject",subjectSchema);

module.exports = subjectModel;