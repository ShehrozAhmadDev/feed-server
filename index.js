const express = require("express");
const cors = require("cors"); // Import cors
const solver = require("javascript-lp-solver");
const ingredients = require("./ingredients");

const app = express();
app.use(express.json());

// Use CORS middleware to allow requests from other origins
app.use(cors()); // Default allows all origins

// Function to calculate optimal ingredient quantities based on desired macros, micros, and budget
const calculateIngredients = (
  desiredProtein,
  desiredCarbs,
  desiredFats,
  desiredVitaminC,
  desiredCalcium,
  budget
) => {
  const model = {
    optimize: "price",
    opType: "min",
    constraints: {
      protein: { min: desiredProtein },
      carbs: { min: desiredCarbs },
      fat: { min: desiredFats },
      vitaminC: { min: desiredVitaminC },
      calcium: { min: desiredCalcium },
      price: { max: budget },
    },
    variables: {},
  };

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

  const results = solver.Solve(model);

  const usedIngredients = ingredients
    .filter(
      (ingredient) => results[ingredient.name] && results[ingredient.name] > 0
    )
    .map((ingredient) => ({
      name: ingredient.name,
      quantity: results[ingredient.name].toFixed(2),
    }));

  const totalCost = usedIngredients.reduce((sum, ingredient) => {
    const quantity = results[ingredient.name];
    return (
      sum + quantity * ingredients.find((i) => i.name === ingredient.name).price
    );
  }, 0);

  return { usedIngredients, totalCost: totalCost.toFixed(2) };
};

// API route to get optimal ingredients and cost
app.post("/calculate", (req, res) => {
  console.log(req.body);
  const {
    desiredProtein,
    desiredCarbs,
    desiredFats,
    desiredVitaminC,
    desiredCalcium,
    budget,
  } = req.body;

  if (
    !desiredProtein ||
    !desiredCarbs ||
    !desiredFats ||
    !desiredVitaminC ||
    !desiredCalcium ||
    !budget
  ) {
    return res.status(400).json({ error: "All input values are required." });
  }

  const result = calculateIngredients(
    desiredProtein,
    desiredCarbs,
    desiredFats,
    desiredVitaminC,
    desiredCalcium,
    budget
  );

  res.json(result);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
