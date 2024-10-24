// Sample list of ingredients with their nutrients and cost
const ingredients = [
  { name: "Chicken Breast", protein: 31, carbs: 0, fat: 3.6, price: 5 },
  { name: "Spinach", protein: 2.9, carbs: 3.6, fat: 0.4, price: 2 },
  { name: "Almonds", protein: 21, carbs: 22, fat: 50, price: 10 },
  { name: "Greek Yogurt", protein: 10, carbs: 3.6, fat: 0.4, price: 3 },
  { name: "Eggs", protein: 13, carbs: 1, fat: 11, price: 4 },
  { name: "Salmon", protein: 25, carbs: 0, fat: 13, price: 12 },
  { name: "Tofu", protein: 8, carbs: 2, fat: 4, price: 3 },
  { name: "Brown Rice", protein: 2.6, carbs: 23, fat: 0.9, price: 2 },
  { name: "Oats", protein: 13, carbs: 66, fat: 7, price: 3 },
  { name: "Peanut Butter", protein: 25, carbs: 20, fat: 50, price: 6 },
  { name: "Broccoli", protein: 2.8, carbs: 6, fat: 0.3, price: 2 },
  { name: "Avocado", protein: 2, carbs: 9, fat: 15, price: 4 },
  { name: "Lentils", protein: 9, carbs: 20, fat: 0.4, price: 3 },
  { name: "Sweet Potato", protein: 2, carbs: 20, fat: 0.1, price: 2 },
  { name: "Quinoa", protein: 8, carbs: 39, fat: 6, price: 5 },
  { name: "Cottage Cheese", protein: 12, carbs: 3, fat: 4, price: 3 },
  { name: "Beef (Lean)", protein: 26, carbs: 0, fat: 15, price: 8 },
  { name: "Edamame", protein: 11, carbs: 8, fat: 5, price: 3 },
  { name: "Tuna", protein: 29, carbs: 0, fat: 1, price: 7 },
  { name: "Walnuts", protein: 15, carbs: 14, fat: 65, price: 9 },
  { name: "Cheddar Cheese", protein: 25, carbs: 1, fat: 33, price: 6 },
  { name: "Blueberries", protein: 0.7, carbs: 14, fat: 0.3, price: 4 },
  { name: "Pork Tenderloin", protein: 25, carbs: 0, fat: 6, price: 7 },
  { name: "Brussels Sprouts", protein: 3.5, carbs: 9, fat: 0.5, price: 2 },
];

// Desired macro goals
const targetMacros = {
  protein: 50,
  carbs: 50,
  fat: 20,
  budget: 15, // Max budget
};

// Function to generate all combinations
function getCombinations(arr) {
  const result = [];
  const f = (prefix = [], arr) => {
    for (let i = 0; i < arr.length; i++) {
      result.push([...prefix, arr[i]]);
      f([...prefix, arr[i]], arr.slice(i + 1));
    }
  };
  f([], arr);
  return result;
}

// Function to check if a combination meets nutrient requirements
function meetsRequirements(combo, targetMacros) {
  const totalMacros = combo.reduce(
    (totals, ingredient) => {
      totals.protein += ingredient.protein;
      totals.carbs += ingredient.carbs;
      totals.fat += ingredient.fat;
      totals.price += ingredient.price;
      return totals;
    },
    { protein: 0, carbs: 0, fat: 0, price: 0 }
  );

  return (
    totalMacros.protein >= targetMacros.protein &&
    totalMacros.carbs >= targetMacros.carbs &&
    totalMacros.fat >= targetMacros.fat &&
    totalMacros.price <= targetMacros.budget
  );
}

// Function to find the optimal combination
function findOptimalCombo(ingredients, targetMacros) {
  const combinations = getCombinations(ingredients);
  let optimalCombo = null;
  let lowestCost = Infinity;

  combinations.forEach((combo) => {
    if (meetsRequirements(combo, targetMacros)) {
      const totalCost = combo.reduce(
        (sum, ingredient) => sum + ingredient.price,
        0
      );
      if (totalCost < lowestCost) {
        lowestCost = totalCost;
        optimalCombo = combo;
      }
    }
  });

  return { optimalCombo, lowestCost };
}

// Find the optimal combination
const { optimalCombo, lowestCost } = findOptimalCombo(
  ingredients,
  targetMacros
);

// Output the result
if (optimalCombo) {
  console.log("Optimal combination:", optimalCombo);
  console.log("Total cost:", lowestCost);
} else {
  console.log("No combination found within the given constraints.");
}
