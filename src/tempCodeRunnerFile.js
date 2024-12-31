function WatchedSummary({ watched }) {
	const [moviesLength, setMoviesLength] = useState(() => watched.length);
	const [avgMoviesRating, setAvgMoviesRating] = useState(() =>
		average(watched.map((movie) => Number.parseFloat(movie.imdbRating)))
	);
	const [avgMoviesUserRating, setavgMoviesUserRating] = useState(() =>
		average(watched.map((movie) => Number.parseFloat(movie.userRating)))
	);
	const [avgMoviesRuntime, setAvgMoviesRuntime] = useState(() =>
		average(watched.map((movie) => Number.parseFloat(movie.runtime)))
	);

	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{moviesLength} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgMoviesRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgMoviesUserRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgMoviesRuntime} min</span>
				</p>
			</div>
		</div>
	);
}