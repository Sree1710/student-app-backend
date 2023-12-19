const db = require('../models/db');

const Batches = function (batches) {
    this.id = batches.id;
    this.collegeId = batches.collegeId;
    this.batchName = batches.batchName;
    this.regStartDate = batches.regStartDate;
    this.regEndDate = batches.regEndDate;
    this.batchDesc = batches.batchDesc;
    this.batchAmount = batches.batchAmount;
}

Batches.batchCreate = (newBatch, result) => {
    // Check if the collegeId exists in the college table
    db.query(
        "SELECT * FROM college WHERE id = ? AND deleteStatus = 0 AND isActive = 1",
        [newBatch.collegeId],
        (collegeErr, collegeRes) => {
            if (collegeErr) {
                console.error("Error checking college:", collegeErr);
                return result(collegeErr, null);
            }

            if (collegeRes.length === 0 || !collegeRes.every(record => record.deleteStatus === 0 && record.isActive === 1)) {
                console.log("College does not exist or is inactive/deleted.");
                return result("College does not exist or is inactive/deleted.", null);
            }

            // Check if the batchName already exists for the same collegeId
            db.query(
                "SELECT COUNT(*) as count FROM batches WHERE batchName LIKE ? AND collegeId = ?",
                [newBatch.batchName, newBatch.collegeId],
                (err, res) => {
                    if (err) {
                        console.error("Error checking batchName:", err);
                        return result(err, null);
                    }

                    if (res[0].count > 0) {
                        console.log("Batch already exists for the same collegeId.");
                        return result("Batch Name already exists for the same collegeId.", null);
                    }

                    // Insert data into batches table
                    db.query("INSERT INTO batches SET ?", newBatch, (insertErr, insertRes) => {
                        if (insertErr) {
                            console.error("Error inserting data:", insertErr);
                            return result(insertErr, null);
                        }

                        console.log("Added Batches:", { id: insertRes.id, ...newBatch });
                        result(null, { id: insertRes.id, ...newBatch });
                    });
                }
            );
        }
    );
};

module.exports = Batches;
