import Categories from './classes/categories.js';
import JokeCard from './classes/jokeCard.js';
import Controls from "./classes/controls.js";

document.addEventListener("DOMContentLoaded",  function () {

	const categories = new Categories;
	categories.drawCategories();

	const jokeCard = new JokeCard;
	jokeCard.init();

	const controls = new Controls;
	controls.initControls();

});