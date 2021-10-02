answers = {
    // In total, how many pounds have these athletes Bench Pressed?
    "q1": null,

    // How many pounds did Barry Moore Back Squat in 2016?
    "q2": null,

    // In what month of 2017 did Barry Moore Back Squat the most total weight?
    "q3": null,

    // What is Abby Smith's Bench Press PR weight?
    // PR defined as the most the person has ever lifted for that exercise, regardless of reps performed.
    "q4": null
}

// Load data
var fs = require("fs");
var fileContentsUsers = fs.readFileSync("./../../data/users.json");
var fileContentsExercises = fs.readFileSync("./../../data/exercises.json");
var fileContentsWorkouts = fs.readFileSync("./../../data/workouts.json");
var users = JSON.parse(fileContentsUsers);
var exercises = JSON.parse(fileContentsExercises);
var workouts = JSON.parse(fileContentsWorkouts);

// Candidate TODO: Write code to answer questions

// takes a user, lift with an optional date filter
// returns an array of the total weight and personal best weight for the
// given parameters
function totalWeightAndPB(requestedUser, requestedLift, optionalDateFilter) {
    var total = 0;
    var exerciseids_seen = 0;
    var personalBest = 0;
    // loop over workouts
    workouts.forEach(workout => {
        // make sure the workout is for the user that you want
        if (workout.user_id !== requestedUser) {
            return;
        }
        // make sure that if the filter exists that we are only including
        // values we care about
        if (typeof optionalDateFilter === "string" &&
            !workout.datetime_completed.includes(optionalDateFilter)) {
            return;
        }
        workout.blocks.forEach(liftSesh => {
            // make sure you are looking at the lifts you want
            if (liftSesh.exercise_id !== requestedLift) {
                return;
            }
            exerciseids_seen += 1;
            // make sure that the reps and weight are not null
            liftSesh.sets.forEach(set => {
                if (typeof set.reps !== "number" && typeof set.weight !== "number") {
                    return;
                }
                if (set.weight > personalBest) {
                    personalBest = set.weight;
                }
                // add to total weight
                total += (set.reps * set.weight);
            });
        });
    });
    //total, PB
    return [total, personalBest];
}

// loop through all users
users.forEach(user => {
    // calculate their full name
    var name_full = user.name_first + " " + user.name_last
    // if we have Barry filter exercises by back squat and year
    if (name_full === "Barry Moore") {
        exercises.forEach(exercise => {
            if (exercise.title === "Back Squat") {
                // calculate q3 separately
                // break down by month
                // initially set highestmonth to 0
                let highestMonth = 0;
                // set highest weight to 0
                let weight = 0;
                for (let i = 1; i <= 12; i++) {
                    let yearMonth;
                    // if i is jan - sep, prepend a 0
                    if (i < 10) {
                        yearMonth = "0" + i.toString();
                    } else {
                        yearMonth = i.toString();
                    }
                    if (weight < totalWeightAndPB(user.id, exercise.id, "2017-" + yearMonth)[0]) {
                        highestMonth = i;
                        weight = totalWeightAndPB(user.id, exercise.id, "2017-" + yearMonth)[0];
                    }

                }
                answers.q3 = highestMonth;
                answers.q2 += totalWeightAndPB(user.id, exercise.id, "2016")[0];
            }
        });
    }

    // else calculate bench press for everyone (q1)
    exercises.forEach(exercise => {
        if (exercise.title === "Bench Press") {
            let total = totalWeightAndPB(user.id, exercise.id)[0];
            let personalBest = totalWeightAndPB(user.id, exercise.id)[1];
            answers.q1 += total;
            // q4 calculation
            if (name_full === "Abby Smith") {
                answers.q4 = personalBest;
            }
        }
    });
});

// Output answers
console.log(JSON.stringify(answers));

module.exports = answers;