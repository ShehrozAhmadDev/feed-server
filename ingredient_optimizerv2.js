import solver from "javascript-lp-solver";
import ingredients from "./ingredients";

// Function to calculate optimal ingredient quantities based on desired macros, micros, and budget
const calculateIngredients = (
  desiredProtein,
  desiredCarbs,
  desiredFat,
  desiredVitaminC,
  desiredCalcium,
  maxPrice
) => {
  const model = {
    optimize: "price", // We want to minimize the total price
    opType: "min", // Minimization problem
    constraints: {
      protein: { min: desiredProtein }, // Minimum protein requirement
      carbs: { min: desiredCarbs }, // Minimum carbs requirement
      fat: { min: desiredFat }, // Minimum fat requirement
      vitaminC: { min: desiredVitaminC }, // Minimum vitamin C requirement
      calcium: { min: desiredCalcium }, // Minimum calcium requirement
      price: { max: maxPrice }, // Maximum budget constraint
    },
    variables: {},
  };

  // Add each ingredient to the model
  ingredients.forEach((ingredient) => {
    model.variables[ingredient.name] = {
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      price: ingredient.price,
      vitaminC: ingredient.micros.vitaminC,
      calcium: ingredient.micros.calcium,
    };
  });

  // Solve the linear programming problem
  const results = solver.Solve(model);

  // Filter out ingredients that were used (non-zero quantities)
  const usedIngredients = ingredients
    .filter(
      (ingredient) => results[ingredient.name] && results[ingredient.name] > 0
    )
    .map((ingredient) => ({
      name: ingredient.name,
      quantity: results[ingredient.name].toFixed(2), // Format to two decimal places
    }));

  // Calculate total cost
  const totalCost = usedIngredients.reduce((sum, ingredient) => {
    const quantity = results[ingredient.name];
    return (
      sum + quantity * ingredients.find((i) => i.name === ingredient.name).price
    );
  }, 0);

  return { usedIngredients, totalCost: totalCost.toFixed(2) }; // Return used ingredients and total cost
};

// Example usage
const desiredProtein = 50; // grams
const desiredCarbs = 100; // grams
const desiredFat = 50; // grams
const desiredVitaminC = 75; // milligrams
const desiredCalcium = 10; // milligrams
const maxPrice = 30; // dollars

const result = calculateIngredients(
  desiredProtein,
  desiredCarbs,
  desiredFat,
  desiredVitaminC,
  desiredCalcium,
  maxPrice
);
console.log("Optimal Ingredients:", result.usedIngredients);
console.log("Total Cost: $" + result.totalCost);
