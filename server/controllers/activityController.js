import streamDataToPostgres from "../models/flightDbUpdate.js";
import cron from 'node-cron';

let lastActivityTimestamp = Date.now();

const updateActivity = async (req, res) => {
    lastActivityTimestamp = Date.now();
    scheduleFetchTask();
    res.status(200).send('Activity updated');
}

const isActive = () => {
    const THRESHOLD = 1000 * 60 * 1/2; // 1 minutes of inactivity threshold
    // console.log(`isActive = ${(Date.now() - lastActivityTimestamp) < THRESHOLD}`)
    return (Date.now() - lastActivityTimestamp) < THRESHOLD;
}

let fetchTask;
let lastState = null;

const scheduleFetchTask = () => {
    const currentState = isActive();
    
    // Only reschedule if state has changed
    if (lastState !== currentState) {
        console.log(`isActive = ${currentState}`)
        console.log('State changed, rescheduling fetch task...');
        
        // Stop the existing task if it exists
        if (fetchTask) {
            fetchTask.stop();
        }
        
        if (currentState === true) {
            streamDataToPostgres();
            // Schedule for active users
            fetchTask = cron.schedule('*/20 * * * * *', streamDataToPostgres);
            console.log('User active, cron scheduled for every 20 seconds');
        } else {
            // Schedule for inactive users
            fetchTask.stop();
            console.log('User inactive, cron stopped');
        }
        
        lastState = currentState; // Update the last known state
    } else {
        // console.log('State unchanged, no need to reschedule.');
    }
}

// Initially schedule the fetch task
scheduleFetchTask();

// Optionally, re-evaluate the scheduling periodically
cron.schedule('*/1 * * * *', () => {
    // console.log('Checking activity status to adjust fetch frequency...');
    scheduleFetchTask();
});

export default updateActivity;