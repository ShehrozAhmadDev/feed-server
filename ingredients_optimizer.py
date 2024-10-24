import pulp

# Expanded data: Ingredients with their macros, micros, and price per 100g
ingredients = [
    {
        'name': 'Chicken Breast',
        'price': 5,  # per 100g
        'protein': 31,  # grams per 100g
        'carbs': 0,
        'fat': 3.6,
        'micros': {'vitaminC': 0, 'calcium': 0}
    },
    {
        'name': 'Broccoli',
        'price': 2,  # per 100g
        'protein': 2.8,
        'carbs': 7,
        'fat': 0.3,
        'micros': {'vitaminC': 89.2, 'calcium': 47}
    },
    {
        'name': 'Almonds',
        'price': 10,  # per 100g
        'protein': 21,
        'carbs': 22,
        'fat': 49,
        'micros': {'vitaminC': 0, 'calcium': 264}
    },
    {
        'name': 'Oats',
        'price': 1.5,  # per 100g
        'protein': 13,
        'carbs': 68,
        'fat': 6,
        'micros': {'vitaminC': 0, 'calcium': 54}
    },
    {
        'name': 'Salmon',
        'price': 8,  # per 100g
        'protein': 25,
        'carbs': 0,
        'fat': 13,
        'micros': {'vitaminC': 0, 'calcium': 9}
    },
    {
        'name': 'Egg',
        'price': 3,  # per 100g
        'protein': 13,
        'carbs': 1.1,
        'fat': 10,
        'micros': {'vitaminC': 0, 'calcium': 56}
    },
    {
        'name': 'Spinach',
        'price': 2,  # per 100g
        'protein': 2.9,
        'carbs': 3.6,
        'fat': 0.4,
        'micros': {'vitaminC': 28, 'calcium': 99}
    },
    {
        'name': 'Quinoa',
        'price': 4,  # per 100g
        'protein': 14,
        'carbs': 64,
        'fat': 6,
        'micros': {'vitaminC': 0, 'calcium': 47}
    },
    {
        'name': 'Greek Yogurt',
        'price': 4,  # per 100g
        'protein': 10,
        'carbs': 3.6,
        'fat': 0.4,
        'micros': {'vitaminC': 0, 'calcium': 110}
    },
    {
        'name': 'Tofu',
        'price': 2.5,  # per 100g
        'protein': 8,
        'carbs': 2,
        'fat': 4.8,
        'micros': {'vitaminC': 0, 'calcium': 350}
    },
    {
        'name': 'Avocado',
        'price': 3.5,  # per 100g
        'protein': 2,
        'carbs': 9,
        'fat': 15,
        'micros': {'vitaminC': 10, 'calcium': 12}
    },
    {
        'name': 'Sweet Potato',
        'price': 1.8,  # per 100g
        'protein': 1.6,
        'carbs': 20,
        'fat': 0.1,
        'micros': {'vitaminC': 2.4, 'calcium': 30}
    },
    {
        'name': 'Lentils',
        'price': 1.2,  # per 100g
        'protein': 9,
        'carbs': 20,
        'fat': 0.4,
        'micros': {'vitaminC': 0, 'calcium': 19}
    },
    {
        'name': 'Cheddar Cheese',
        'price': 6,  # per 100g
        'protein': 25,
        'carbs': 1.3,
        'fat': 33,
        'micros': {'vitaminC': 0, 'calcium': 721}
    }
]

# User-defined desired macros, micros, and budget
desired_protein = 50  # grams
desired_carbs = 100  # grams
desired_fats = 50  # grams
desired_vitaminC = 75  # milligrams
desired_calcium = 10  # milligrams
budget = 30  # dollars

# Create the linear programming problem
prob = pulp.LpProblem("Ingredient_Optimization", pulp.LpMinimize)

# Create variables for the amount (in grams) of each ingredient
ingredient_vars = [pulp.LpVariable(f"x_{i}", lowBound=0, cat="Continuous") for i in range(len(ingredients))]

# Objective function: Minimize total cost
prob += pulp.lpSum([ingredient_vars[i] * (ingredients[i]['price'] / 100) for i in range(len(ingredients))]), "Total_Cost"

# Constraints for macro nutrients
prob += pulp.lpSum([ingredient_vars[i] * (ingredients[i]['protein'] / 100) for i in range(len(ingredients))]) >= desired_protein, "Protein_Requirement"
prob += pulp.lpSum([ingredient_vars[i] * (ingredients[i]['carbs'] / 100) for i in range(len(ingredients))]) >= desired_carbs, "Carb_Requirement"
prob += pulp.lpSum([ingredient_vars[i] * (ingredients[i]['fat'] / 100) for i in range(len(ingredients))]) >= desired_fats, "Fat_Requirement"

# Constraints for micro nutrients
prob += pulp.lpSum([ingredient_vars[i] * (ingredients[i]['micros']['vitaminC'] / 100) for i in range(len(ingredients))]) >= desired_vitaminC, "VitaminC_Requirement"
prob += pulp.lpSum([ingredient_vars[i] * (ingredients[i]['micros']['calcium'] / 100) for i in range(len(ingredients))]) >= desired_calcium, "Calcium_Requirement"

# Budget constraint
prob += pulp.lpSum([ingredient_vars[i] * (ingredients[i]['price'] / 100) for i in range(len(ingredients))]) <= budget, "Budget_Constraint"

# Solve the problem
prob.solve()

# Output the results
print(f"Status: {pulp.LpStatus[prob.status]}")

# Display the amounts of each ingredient in the solution
for i, var in enumerate(ingredient_vars):
    if var.varValue > 0:
        print(f"Use {var.varValue:.2f} grams of {ingredients[i]['name']}")

# Total cost
total_cost = pulp.value(prob.objective)
print(f"Total Cost: ${total_cost:.2f}")
