const express = require("express");
const cors = require("cors");
const solver = require("javascript-lp-solver");
const ingredients = require("./ingredients");

const app = express();
app.use(express.json());
app.use(cors());

const calculateIngredients = (
  desiredProtein,
  desiredCarbs,
  desiredFats,
  desiredVitaminC,
  desiredCalcium,
  budget,
  selectedIngredients
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

  const filteredIngredients = ingredients.filter((ingredient) =>
    selectedIngredients.includes(ingredient.name)
  );

  filteredIngredients.forEach((ingredient) => {
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

  const usedIngredients = filteredIngredients
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
      sum +
      quantity *
        filteredIngredients.find((i) => i.name === ingredient.name).price
    );
  }, 0);

  return { usedIngredients, totalCost: totalCost.toFixed(2) };
};

app.post("/calculate", (req, res) => {
  console.log(req.body);
  const {
    desiredProtein,
    desiredCarbs,
    desiredFats,
    desiredVitaminC,
    desiredCalcium,
    budget,
    selectedIngredients,
  } = req.body;

  if (
    !desiredProtein ||
    !desiredCarbs ||
    !desiredFats ||
    !desiredVitaminC ||
    !desiredCalcium ||
    !budget ||
    !selectedIngredients ||
    selectedIngredients.length === 0
  ) {
    return res.status(400).json({
      error:
        "All input values are required, including at least one selected ingredient.",
    });
  }

  const result = calculateIngredients(
    desiredProtein,
    desiredCarbs,
    desiredFats,
    desiredVitaminC,
    desiredCalcium,
    budget,
    selectedIngredients
  );

  res.json(result);
});

app.get("/", (req, res) => {
  res.send("APP IS RUNNING");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
