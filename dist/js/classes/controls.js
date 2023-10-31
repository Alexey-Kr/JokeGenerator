import JokeCard from './jokeCard.js';
export default class Controls {

	constructor() {
		this.form = document.querySelector('form');
		this.apiQueryValueInput = document.querySelector('.joke-request-value');
		this.searchInput = document.querySelector('.search_input');
		this.mainJokesBlock = document.querySelector('.jokes-block');
		this.msgJokesBlock = document.querySelector('.jokes-msg');
		this.radioInputs = document.querySelectorAll('input[type=\'radio\']');
		this.mobMenuBtns = document.querySelectorAll('.mob-menu-toggle');
		this.jokeCard = new JokeCard;
	}

	initControls = () => {
		this.addMainFormListener();
		this.addSearchInputListener();
		this.addRadioBtnListener();
		this.addMenuButtonsControl();
	}

	addMainFormListener = () => {
		this.form.addEventListener('submit', async (e) => {
			e.preventDefault();

			let checkedInput = document.querySelector('input[name=queryType]:checked');
			let queryType = checkedInput.value;
			let apiUrl = 'https://api.chucknorris.io/jokes/' + queryType + this.apiQueryValueInput.value;
			if (queryType.includes('search') && this.apiQueryValueInput.value.length < 4) {
				this.form.classList.add('show-search-msg');
				return;
			}

			this.msgJokesBlock.innerHTML = '';

			await fetch(apiUrl)
				.then(res => res.json())
				.then(response => {
					let jokesStructure = [];
					if (typeof(response.total) !== "undefined" && response.total !== null) {
						this.msgJokesBlock.innerHTML = `We found ${response.total} joke(s) with "${this.apiQueryValueInput.value}"`;

						response.result.forEach((joke) => {
							jokesStructure.push(this.jokeCard.createJokeCardStructure(joke));
						});
					} else {
						jokesStructure.push(this.jokeCard.createJokeCardStructure(response));
					}
					this.mainJokesBlock.innerHTML = '';

					jokesStructure.forEach((joke) => {
						this.mainJokesBlock.append(joke);
					});
				});
		});
	}

	addSearchInputListener = () => {
		this.searchInput.addEventListener('keyup', (e) => {
			if (e.isComposing || e.keyCode === 229) {
				return;
			}

			this.apiQueryValueInput.value = e.target.value;
		});
	}

	addRadioBtnListener = () => {
		this.radioInputs.forEach((el) => {
			el.addEventListener('change', e => {
				const {target} = e;

				this.form.className = '';
				this.form.classList.add(target.id + '-active');

				switch (target.id) {
					case `categories`:
						this.apiQueryValueInput.value = document.querySelector('.categories_item.active').textContent;
						break;
					case `random`:
						this.apiQueryValueInput.value = '';
						break;
					case `search`:
						this.apiQueryValueInput.value = this.searchInput.value;
						window.setTimeout(() => this.searchInput.focus(), 0);
						break;
				}

			});
		})
	}

	addMenuButtonsControl = () => {
		this.mobMenuBtns.forEach((el) => {
			el.addEventListener('click', e => {
				document.body.classList.toggle('menu-show');
			});
		})
	}

}