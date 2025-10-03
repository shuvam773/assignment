const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,

    },
    deadline:{
        type:Date,
    },
    subject:{
        type:String,
        required:true
    
    }
})

module.exports = mongoose.model("Assignment", assignmentSchema)

