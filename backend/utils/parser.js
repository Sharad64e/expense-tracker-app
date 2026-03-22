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

  title = title.trim().toLowerCase();

  // 🔥 CATEGORY LIST
  const categories = {
    Food: ["tea", "coffee", "pizza", "burger", "biryani", "milk", "bread", "egg", "juice"],
    Travel: ["uber", "bus", "train", "metro", "auto", "cab", "flight"],
    Education: ["book", "copy", "pen", "notebook", "course", "fees", "exam"],
    Shopping: ["shoes", "clothes", "shirt", "jeans", "bag", "watch"],
    Bills: ["electricity", "rent", "wifi", "internet", "mobile", "recharge"],
    Health: ["medicine", "doctor", "hospital", "gym", "protein"],
    Entertainment: ["movie", "netflix", "spotify", "game"],
  };

  let category = "Other";

  for (let key in categories) {
    if (categories[key].includes(title)) {
      category = key;
      break;
    }
  }

  return { title, amount, category };
}

module.exports = parseInput;