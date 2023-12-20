const db = require('../models/db');
const { response } = require('express')




const Tasks = function (tasks) {
    this.id = tasks.id
    this.batchId = tasks.batchId;
    this.taskTitle = tasks.taskTitle;
    this.taskDesc = tasks.taskDesc;
    this.taskType = tasks.taskType;
    this.taskFileUpload = tasks.taskFileUpload
    this.totalScore = tasks.totalScore;
    this.dueDate = tasks.dueDate
};



Tasks.createTask = (newTask, result) => {
    // Check if the batch exists in the batches table
    db.query(
        "SELECT * FROM batches WHERE id = ? AND deleteStatus = 0 AND isActive = 1",
        [newTask.batchId],
        (batchErr, batchRes) => {
            if (batchErr) {
                console.error("Error checking batch: ", batchErr);
                return result(batchErr, null);
            }

            if (batchRes.length === 0) {
                console.log("Batch does not exist or is inactive/deleted.");
                return result("Batch does not exist or is inactive/deleted.", null);
            }

            // Check if the task title already exists for the same batchId
            db.query(
                "SELECT COUNT(*) as count FROM task WHERE taskTitle LIKE ? AND batchId = ? AND id != ?",
                [newTask.taskTitle, newTask.batchId, newTask.id],
                (titleErr, titleRes) => {
                    if (titleErr) {
                        console.error("Error checking task title: ", titleErr);
                        return result(titleErr, null);
                    }

                    if (titleRes[0].count > 0) {
                        console.log("Title already exists for the same batchId.");
                        return result("Title already exists for the same batchId.", null);
                    }

                    // Insert the new task into the task table
                    db.query("INSERT INTO task SET ?", newTask, (insertErr, insertRes) => {
                        if (insertErr) {
                            console.error("Error inserting task: ", insertErr);
                            return result(insertErr, null);
                        } else {
                            const insertedTask = { id: insertRes.insertId, ...newTask };
                            console.log("Task inserted: ", insertedTask);
                            result(null, insertedTask);
                        }
                    });
                }
            );
        }
    );
};


module.exports=Tasks