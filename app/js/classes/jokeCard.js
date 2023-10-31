export default class JokeCard {

	constructor() {
		this.prefixForStorageName = 'chuckIds69';
	}

	init = () => {
		this.loadFavoriteCardsJoke();
		this.getRandomJoke();
	}

	getRandomJoke = async () => {
		await fetch('https://api.chucknorris.io/jokes/random')
			.then(res=> res.json())
			.then(data=> {
				let cardStructure = this.createJokeCardStructure(data);
				document.querySelector('.jokes-block').append(cardStructure);
			});
	}

	createJokeCardStructure = (data, cardType = 'standard') => {
		let div = document.createElement('div');

		let jokeMeta =
			`<div class="joke_meta">
                <div class="joke_time">
                    <div class="joke_time-meta">Last update:</div>
                    <div class="joke_time-value">${this.changeDateToHoursAgo(data.updated_at)} hours ago</div>
                </div>`;

		jokeMeta += ( data.categories.length > 0 && cardType === 'standard' ) ?
			`<div class="joke_category">${data.categories}</div></div>` :
			`</div>`

		let jokeIdAttr = cardType === 'standard' ? '' : `id="${this.prefixForStorageName}${data.id}"`;
		let cardFavoriteClass = this.isFavoriteCard(data.id) ? 'card-favorite' : '';

		div.innerHTML =
			`<div ${jokeIdAttr} class="joke-card joke-card-${cardType} ${cardFavoriteClass}" data-id="${this.prefixForStorageName}${data.id}">
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
		this.listenerToBtnFavorite(btnFav, data);

		return div.firstElementChild;
	}

	listenerToBtnFavorite = (btn, data = []) => {
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
				this.listenerToBtnFavorite(cloneJokeCard);

				localStorage.setItem(jokeId, JSON.stringify(data));

				document.querySelector('aside').append(cloneJokeCard);
			}
		});
	}

	loadFavoriteCardsJoke = () => {
		Object.keys(localStorage).forEach((key) => {
			if (key.indexOf(this.prefixForStorageName) !== -1) {
				let card = this.createJokeCardStructure(JSON.parse(localStorage.getItem(key)), 'mini');
				document.querySelector('aside').append(card);
			}
		});
	}

	changeDateToHoursAgo = (date) => {
		let timeStampUpdate = new Date(date).getTime(),
			currentTimeStamp = new Date().getTime(),
			timeStampDiff = currentTimeStamp - timeStampUpdate;

		return Math.floor(timeStampDiff/1000/60/60);
	}

	isFavoriteCard = (cardId) => {
		return !!localStorage.getItem(this.prefixForStorageName + cardId);
	}

}