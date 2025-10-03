import React from 'react';

const AssignmentsPage = ({ assignments,  }) => {
  if (assignments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No assignments created yet.</p>
        <p className="text-sm text-gray-400 mt-1">Create your first assignment to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div key={assignment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{assignment.subject}</p>
              <p className="text-gray-700 mt-2">{assignment.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Due: {new Date(assignment.deadline).toLocaleDateString()}
              </p>
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Active
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
            <div className="space-x-2">
              <button className="text-indigo-600 hover:text-indigo-800">View Submissions</button>
              <button className="text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentsPage;