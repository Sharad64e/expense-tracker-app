// utils/parser.js

function parseInput(text) {
  const parts = text.trim().split(" ");
  
  let amount = 0;
  let title = "";

  parts.forEach(p => {
    if (!isNaN(p)) {
      amount = Number(p);
    } else {
      title += p + " ";
    }
  });

  title = title.trim();

  // simple category logic
  let category = "Other";

  const foodItems = ["tea", "coffee", "pizza", "burger"];
  const travelItems = ["uber", "bus", "train"];

  if (foodItems.includes(title.toLowerCase())) {
    category = "Food";
  } else if (travelItems.includes(title.toLowerCase())) {
    category = "Travel";
  }

  return { title, amount, category };
}

module.exports = parseInput;