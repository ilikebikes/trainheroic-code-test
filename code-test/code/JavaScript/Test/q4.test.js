const answers = require("../answer.js");

test("What is Abby Smith's Bench Press PR weight?", () => {
    expect(answers.q4).toBe(350);
});