const store = require('../data/store');
const { v4: uuidv4 } = require('uuid');

const getAllrecipes = () => {
  return store.recipes;
};

const getrecipeById = (id) => {
  return store.recipes.find(recipe => recipe.id === id);
};

const createrecipe = (data) => {
  const newrecipe = {
    id: uuidv4(),
    title: data.title,
    description: data.description,
    instructorId: data.instructorId,
    price: data.price,
    createdAt: new Date().toISOString()
  };  
  store.recipes.push(newrecipe);
  return newrecipe;
};

const updaterecipe = (id, data) => {
  const index = store.recipes.findIndex(recipe => recipe.id === id);
  if (index === -1) {
    return null;
  }
  
  const updatedrecipe = {
    ...store.recipes[index],
    title: data.title || store.recipes[index].title,
    description: data.description || store.recipes[index].description,
    instructorId: data.instructorId || store.recipes[index].instructorId,
    price: data.price !== undefined ? data.price : store.recipes[index].price
  };
  
  store.recipes[index] = updatedrecipe;
  return updatedrecipe;
};

const deleterecipe = (id) => {
  const index = store.recipes.findIndex(recipe => recipe.id === id);
  if (index === -1) {
    return false;
  }
  
  store.recipes.splice(index, 1);
  return true;
};

module.exports = {
  getAllrecipes,
  getrecipeById,
  createrecipe,
  updaterecipe,
  deleterecipe
};
