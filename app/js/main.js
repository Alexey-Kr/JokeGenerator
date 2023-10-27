document.addEventListener("DOMContentLoaded",  function () {

	const prefixForStorageName = 'chuckIds69';

	const form = document.querySelector('form');
	const apiQueryValueInput = document.querySelector('.joke-request-value');
	const searchInput = document.querySelector('.search_input');
	const mainJokesBlock = document.querySelector('.jokes-block');
	const msgJokesBlock = document.querySelector('.jokes-msg');
	const radioInputs = document.querySelectorAll('input[type=\'radio\']');
	const label = document.querySelectorAll('label');

	const changeDateToHoursAgo = (date) => {
		let timeStampUpdate = new Date(date).getTime(),
			currentTimeStamp = new Date().getTime(),
			timeStampDiff = currentTimeStamp - timeStampUpdate;

		return Math.floor(timeStampDiff/1000/60/60);
	}
	const isFavoriteCard = (cardId) => {
		return !!localStorage.getItem(prefixForStorageName + cardId);
	}
	const removeActiveCategoryClass = () => {
		let categories = document.querySelectorAll('.categories_item');
		categories.forEach((el) => {
			el.classList.remove('active');
		})
	}
	const loadFavoriteCardsJoke = () => {
		Object.keys(localStorage).forEach((key) => {
			if (key.indexOf(prefixForStorageName) !== -1) {
				let card = createJokeCardStructure(JSON.parse(localStorage.getItem(key)), 'mini');
				document.querySelector('aside').append(card);
			}
		});
	}
	const createCategories = async () => {
		const categories = await fetch('https://api.chucknorris.io/jokes/categories');
		const data = await categories.json();

		let categoriesStructure = '';

		data.forEach((category,index) => {

			if (index === 0) {
				apiQueryValueInput.value = category;
				categoriesStructure += '<div class="categories_item active">'+category+'</div>';
			} else {
				categoriesStructure += '<div class="categories_item">'+category+'</div>';
			}

		});

		document.querySelector('.categories-block').innerHTML = categoriesStructure;
	}
	const getRandomJoke = async () => {
		await fetch('https://api.chucknorris.io/jokes/random')
			.then(res=> res.json())
			.then(data=> {
				let cardStructure = createJokeCardStructure(data);
				document.querySelector('.jokes-block').append(cardStructure);
			});
	}
	const listenerToBtnFavorite = (btn, data = []) => {
		btn.addEventListener('click', e => {
			const {target} = e;
			let jokeCard = target.parentNode,
				jokeId = jokeCard.dataset.id;

			if ( jokeCard.classList.contains('card-favorite') ) {

				let favoriteCards = document.querySelectorAll('[data-id="'+jokeId+'"]');

				favoriteCards.forEach((card) => {
					card.classList.remove('card-favorite');
				});

				localStorage.removeItem(jokeId);

				document.querySelector('#'+jokeId).remove();
			} else {
				jokeCard.classList.add('card-favorite');
				let cloneJokeCard = jokeCard.cloneNode(true);
				cloneJokeCard.className = 'joke-card joke-card-mini card-favorite';
				cloneJokeCard.id = jokeId;
				listenerToBtnFavorite(cloneJokeCard);

				localStorage.setItem(jokeId, JSON.stringify(data));

				document.querySelector('aside').append(cloneJokeCard);
			}
		});
	}
	const createJokeCardStructure = (data, cardType = 'standard') => {
		let div = document.createElement('div');

		let jokeMeta =
			`<div class="joke_meta">
                <div class="joke_time">
                    <div class="joke_time-meta">Last update:</div>
                    <div class="joke_time-value">${changeDateToHoursAgo(data.updated_at)} hours ago</div>
                </div>`;

		jokeMeta += ( data.categories.length > 0 && cardType === 'standard' ) ?
			`<div class="joke_category">${data.categories}</div></div>` :
			`</div>`

		let jokeIdAttr = cardType === 'standard' ? '' : `id="${prefixForStorageName}${data.id}"`;
		let cardFavoriteClass = isFavoriteCard(data.id) ? 'card-favorite' : '';

		div.innerHTML =
			`<div ${jokeIdAttr} class="joke-card joke-card-${cardType} ${cardFavoriteClass}" data-id="${prefixForStorageName}${data.id}">
                <div class="btn-favorite"></div>
                <div class="joke_body">
                    <div class="joke_link">
                        <span class="joke_link-title">ID:</span>
                        <a href="${data.url}" class="joke-link">${data.id}</a>
                    </div>
                    <div class="joke_text">${data.value}</div>
                    ${jokeMeta}
                </div>
            </div>`;

		let btnFav = div.firstElementChild.querySelector('.btn-favorite');
		listenerToBtnFavorite(btnFav, data);

		return div.firstElementChild;
	}

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		let checkedInput = document.querySelector('input[name=queryType]:checked');
		let queryType = checkedInput.value;
		let apiUrl = 'https://api.chucknorris.io/jokes/' + queryType + apiQueryValueInput.value;
		if (queryType.includes('search') && apiQueryValueInput.value.length < 4) {
			form.classList.add('show-search-msg');
			return;
		}

		msgJokesBlock.innerHTML = '';

		await fetch(apiUrl)
			.then(res => res.json())
			.then(response => {
				let jokesStructure = [];
				if (typeof(response.total) !== "undefined" && response.total !== null) {
					msgJokesBlock.innerHTML = `We found ${response.total} joke(s) with "${apiQueryValueInput.value}"`;

					response.result.forEach((joke) => {
						jokesStructure.push(createJokeCardStructure(joke));
					});
				} else {
					jokesStructure.push(createJokeCardStructure(response));
				}
				mainJokesBlock.innerHTML = '';

				jokesStructure.forEach((joke) => {
					mainJokesBlock.append(joke);
				});
			});
	});

	searchInput.addEventListener('keyup', (e) => {
		if (e.isComposing || e.keyCode === 229) {
			return;
		}

		apiQueryValueInput.value = e.target.value;
	});

	radioInputs.forEach((el) => {
		el.addEventListener('change', e => {
			const {target} = e;

			switch (target.id) {
				case `categories`:
					if (!document.querySelector('.categories-block .categories_item')) {
						createCategories();
					} else {
						apiQueryValueInput.value = document.querySelector('.categories_item.active').textContent;
					}
					break;
				case `random`:
					apiQueryValueInput.value = '';
					break;
				case `search`:
					apiQueryValueInput.value = searchInput.value;
					break;
			}

		});
	})

	label.forEach((el) => {
		el.addEventListener('click', e => {
			const {target} = e;

			form.className = '';
			form.classList.add(target.dataset.formClass);

			window.setTimeout(() => searchInput.focus(), 0);
		});
	})

	document.addEventListener('click', e => {
		const {target} = e;
		if (target.closest('.categories_item')) {
			removeActiveCategoryClass();
			target.classList.add('active');
			apiQueryValueInput.value = target.textContent;
		}
	});

	document.addEventListener('click', e => {
		const {target} = e;
		if (target.closest('.mob-menu-toggle')) {
			document.body.classList.toggle("menu-show");
		}
	});

	loadFavoriteCardsJoke();
	getRandomJoke();

});