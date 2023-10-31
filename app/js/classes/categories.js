export default class Categories {

	constructor() {
		this.apiQueryValueInput = document.querySelector('.joke-request-value');
		this.categoriesBlock = document.querySelector('.categories-block');
		this.setListenersForCategoriesBtn();
	}

	getCategories = async () => {
		return fetch('https://api.chucknorris.io/jokes/categories')
			.then((response) => {
				return response.json();
			})
	}

	createCategoriesStructure = async () => {
		let categories = await this.getCategories(),
				categoriesStructure = '';

		categories.forEach((category, index) => {
			let activeClass = index === 0 ? 'active' : '';
			categoriesStructure += `<div class="categories_item ${activeClass}">${category}</div>`;
		});

		return categoriesStructure;
	}

	drawCategories = async () => {
		this.categoriesBlock.innerHTML = await this.createCategoriesStructure();
	}

	setListenersForCategoriesBtn = () => {
		document.addEventListener('click', e => {
			const {target} = e;
			if (target.closest('.categories_item')) {
				this.removeActiveCategoryClass();
				target.classList.add('active');
				this.apiQueryValueInput.value = target.textContent;
			}
		});
	}

	removeActiveCategoryClass = () => {
		let categories = document.querySelectorAll('.categories_item');

		categories.forEach((el) => {
			el.classList.remove('active');
		})
	}

}
