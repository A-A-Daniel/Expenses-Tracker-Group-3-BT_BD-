require("dotenv").config();

const express = require('express');
const index = express();


index.use(express.json()); // Parse JSON bodies

let expenses = [
    {id: 1, amount: 3000, date: "12/12/2025", category: "debit"},
    {id: 2, amount: 4000, date: "12/12/2025", category: "credit"},
    {id: 3, amount: 10000, date: "12/12/2025", category: "credit"},
];

// GET: To get the list of all expenses (READ) ===> WORKS FINE!!!
index.get('/expenses', (req,res) => {
    res.status(200).json(expenses);
});

// GET: Read specific expense => WORKS FINE!
index.get('/expenses/:id', (req, res) => {
  // Check if correct ID is inputted
  if(parseInt(req.params.id) <= expenses.length){
    const expense = expenses.find((e) => e.id === parseInt(req.params.id));
    res.status(200).json(expense); // Send array as JSON
  }else{
    res.status(404).json({error: "Expense not Found"});
  };  
});


// POST: To add a new expenses to the list of expenses (CREATE) ===> WORKS FINE!
index.post('/expenses', (req,res) => {
const newExpenses = {id: expenses.length + 1, ... req.body};
const successPrompt = "Expenses has been logged successfully!";
expenses.push(newExpenses);
console.log(successPrompt);
res.status(201).json(newExpenses);
});


// PATCH: To edit or update the list (UPDATE) ===> WORKS FINE!
index.patch('/expenses/:id',(req,res) => {
const expense = expenses.find((t) => t.id === parseInt(req.params.id));
 if (!expense){
  return res.status(404).json({ message: 'Expense not found!' });
 }else{
  Object.assign(expense, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(expense);
 }
});

// DELETE: To delete an expense from the list of expenses (DELETE) ===> WORKS FINE!
index.delete('/expenses/:id', (req,res) =>{
  const id = parseInt(req.params.id);
  const initialLength = expenses.length;
  expenses = expenses.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (expenses.length === initialLength){
    return res.status(404).json({ error: 'Expense does not exist'});
  }else{
    res.status(204).send(); // Silent success
  }
});

index.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!'});
});

const PORT = process.env.PORT || 4000;
index.listen(PORT, () => console.log(`Server on port ${PORT}`));
