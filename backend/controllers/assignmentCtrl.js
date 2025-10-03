const Assignment = require('../models/assignmentModel');

const createAssignment = async (req, res) =>{
    try {
        const { title, description, deadline, subject } = req.body;

        const newAssignment = new Assignment({
            teacherId: req.user.id,
            title,
            description,
            deadline,
            subject
        });

        await newAssignment.save();
        res.status(201).json({ message: "Assignment created successfully", assignment: newAssignment });
    } catch (error) {
        res.status(500).json({ message: "Error creating assignment", error: error.message });
    }
}

const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate('teacherId', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching assignments", error: error.message });
    }
}

module.exports = {
    createAssignment,
    getAssignments
}