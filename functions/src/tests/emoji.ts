const split = require("lodash.split");
console.log(split("✅", "").length);
console.log(split("✅ ", "").length);
console.log(split("🧞‍♂️", "").length);
console.log("🧞‍♂️".length);
console.log(split("kjrkjr ", "").length);
console.log(split("kjrkjr ❤️", "").length);
