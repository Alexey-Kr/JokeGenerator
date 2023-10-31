

export const listenerToForm = () => {
	const form = document.querySelector('form');
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
}

// export {listenerToForm}
