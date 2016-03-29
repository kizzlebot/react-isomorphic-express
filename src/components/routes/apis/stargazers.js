const fetchStargazers  = (page, per_page = 100) => {
	return githubApi.browse(
		["repos", "RickWong/react-isomorphic-starterkit", "stargazers"],
		{ query: { page, per_page } }
	)
	.then(json => (json || []).map(({id, login}) => ({id, login})))
	.catch(error => {
		throw error;
	});
};

/**
 * App React application entry-point for both the server and client.
 */
class App extends React.Component {
	/**
	 * componentWillMount() runs on server and client.
	 */
	componentWillMount() {
		if (__SERVER__) console.log("Hello server");
		if (__CLIENT__) console.log("Hello client");
	}

	/**
	 * componentDidUpdate() only runs on the client.
	 */
	componentDidUpdate (prevProps, prevState) {
		if (!this.props.additionalStargazers) return;
		this.loadMoreStargazersOnClient();
	}

	/**
	 * Load more stargazers.
	 */
	loadMoreStargazersOnClient () {
		const {additionalStargazers = [], transmit} = this.props;
		let {nextPage, pagesToFetch} = transmit.variables;

		if (--pagesToFetch <= 0) {
			return;
		}

		++nextPage;

		transmit.forceFetch({
			nextPage,
			pagesToFetch,
			additionalStargazers
		}, "additionalStargazers");
	}

	/**
	 * Runs on server and client.
	 */
	render () {
		const repositoryUrl = "https://github.com/RickWong/react-isomorphic-starterkit";
		const avatarSize    = 32;
		const avatarUrl     = (id) => `https://avatars.githubusercontent.com/u/${id}?v=3&s=${avatarSize}`;

		/**
		 * This is a Transmit fragment.
		 */
		let {stargazers, additionalStargazers} = this.props;

		if (additionalStargazers) {
			stargazers = stargazers.concat(additionalStargazers);
		}

		return (
			<div className={'row'}>
				{stargazers && stargazers.map(user =>
					<a key={user.id} href={"https://github.com/"+user.login} title={user.login} target="_blank">
						<img className="avatar" src={avatarUrl(user.id)} alt={user.login} />
					</a>
				)}
			</div>
		);
	}
}



App.propTypes = {
	additionalStargazers:React.PropTypes.array,
	stargazers:React.PropTypes.array
}









/**
 * Use Transmit to query and return GitHub stargazers as a Promise.
 * Adds to given react component
 */
export default Transmit.createContainer(App, {
	initialVariables: {
		nextPage:       2,
		pagesToFetch:   15,
		additionalStargazers: []
	},
	fragments: {
		/**
		 * Load first stargazers.
		 */
		stargazers: () => fetchStargazers(1),
		/**
		 * Load more stargazers deferred.
		 */
		additionalStargazers: ({nextPage, additionalStargazers}) => {
			return () => fetchStargazers(nextPage).then(newStargazers => {
				newStargazers = newStargazers.map(({id, login}) => {
					return { id, login };
				});

				return additionalStargazers.concat(newStargazers);
			});
		}
	}
});

