import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

// Utils -->
function ErrorMessage({ children }) {
	return <p className="error">{children}</p>;
}

function Loader() {
	return <p className="loader">Loading...</p>;
}

function Main({ children }) {
	return <main className="main">{children}</main>;
}

const average = (arr) =>
	Math.round(arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0));

const API_KEY = "b1330894";

// App -->
export default function App() {
	// states->
	const [query, setQuery] = useState("the purge");
	/*
	// const [watched, setWatched] = useState(() => {
	// 	const fetchedWatchedMovies = JSON.parse(
	// 		localStorage.getItem("watchedMovies")
	// 	);
	// 	if (!fetchedWatchedMovies) return [];
	// 	return fetchedWatchedMovies;
	// });
	// 	useEffect(() => {
	// 	localStorage.setItem("watchedMovies", JSON.stringify(watched));
	// }, [watched]);
	*/
	const [watched, setWatched] = useLocalStorageState([], "watchedMovies");
	const [selectedID, setSelectedID] = useState(null);
	const { movies, error, isLoading } = useMovies(query);

	// states->
	function handleSelectedMovie(id) {
		setSelectedID(id === selectedID ? null : id);
	}
	function handleCloseMovie() {
		setSelectedID(null);
	}
	function handleAddToWatchList(movie) {
		const movies = watched.filter((item) => item.imdbID !== movie.imdbID);
		const watchedMovies = [...movies, movie];
		setWatched(watchedMovies);
		// localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
	}
	function handleDeleteWatch(id) {
		const updatedWatchedMovies = watched.filter((movie) => movie.imdbID !== id);
		setWatched(updatedWatchedMovies);
		// localStorage.setItem("watchedMovies", JSON.stringify(updatedWatchedMovies));
	}

	return (
		<>
			<NavBar>
				<Logo />
				<SearchBar
					query={query}
					setQuery={setQuery}
				/>
				<NumResults movies={movies} />
			</NavBar>

			<Main>
				<Box>
					{isLoading && <Loader></Loader>}
					{!isLoading && !error && (
						<MoviesList
							movies={movies}
							onSelectMovie={handleSelectedMovie}
						/>
					)}
					{error && <ErrorMessage>{error}</ErrorMessage>}
				</Box>

				<Box>
					{selectedID ? (
						<MovieDetails
							selectedID={selectedID}
							onCloseMovie={handleCloseMovie}
							onRate={handleAddToWatchList}
							watchedMovies={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								onDeleteWatchedMovie={handleDeleteWatch}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

// Headder -->
function NavBar({ children }) {
	return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

function SearchBar({ query, setQuery }) {
	const inputEl = useRef(null);

	useKey("enter", () => {
		if (document.activeElement === inputEl.current) return;
		inputEl.current.focus();
		setQuery("");
	});

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			ref={inputEl}
		/>
	);
}

function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	const box = useRef(null);
	const isAnimating = useRef(false);
	const { contextSafe } = useGSAP({ scope: box });

	const onClickGood = contextSafe(() => {
		if (isAnimating.current) return;
		if (isOpen) {
			gsap.to(box.current, {
				y: -60,
				autoAlpha: 0,
				duration: 0.361,
				stagger: 0.168,
				onUpdate: () => (isAnimating.current = true),
				onComplete: () => {
					setIsOpen(false);
					isAnimating.current = false;
				},
			});
		} else {
			setIsOpen(true);
		}
	});

	return (
		<div className="box">
			<button
				className="btn-toggle"
				onClick={() => onClickGood()}
			>
				{isOpen ? "–" : "+"}
			</button>
			{isOpen && <div ref={box}>{children}</div>}
		</div>
	);
}

function MoviesList({ movies, onSelectMovie }) {
	const moviesList = useRef(null);

	useGSAP(
		() => {
			if (!movies.length) return;

			gsap.from("li", {
				autoAlpha: 0,
				duration: 0.681,
				stagger: 0.168,
				y: -120,
			});
		},
		{ dependencies: [movies], scope: moviesList }
	);

	return (
		<ul
			className="list list-movies cursedComponentLoL"
			ref={moviesList}
		>
			{movies?.map((movie) => (
				<Movie
					movie={movie}
					key={movie.imdbID}
					onSelectMovie={onSelectMovie}
				></Movie>
			))}
		</ul>
	);
}

function Movie({ movie, onSelectMovie }) {
	return (
		<li onClick={() => onSelectMovie(movie.imdbID)}>
			<img
				src={movie.Poster}
				alt={`${movie.Title} poster`}
			/>
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

// //////////////

function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));
	const watchedSummary = useRef(null);

	useGSAP(
		() => {
			gsap.from(watchedSummary.current, {
				opacity: 0,
				y: -120,
				stagger: 0.168,
				duration: 0.681,
				ease: "power2.out",
			});
		},
		{ scope: watchedSummary }
	);

	return (
		<div
			className="summary"
			ref={watchedSummary}
		>
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedMoviesList({ watched, onDeleteWatchedMovie }) {
	const watchedContainerRef = useRef(null);

	useGSAP(
		() => {
			if (!watched.length) return;
			gsap.from(".watched-list li", {
				opacity: 0,
				y: -120,
				stagger: 0.168,
				duration: 0.681,
				ease: "power2.out",
			});
		},
		{ scope: watchedContainerRef }
	);

	return (
		<ul
			className="list watched-list"
			ref={watchedContainerRef}
		>
			{watched.map((movie) => (
				<WatchedMovie
					movie={movie}
					onDeleteWatchedMovie={onDeleteWatchedMovie}
					key={movie.imdbID}
				/>
			))}
		</ul>
	);
}

function WatchedMovie({ movie, onDeleteWatchedMovie }) {
	const itemRef = useRef(null);
	const { contextSafe } = useGSAP({ scope: itemRef });

	const handleDelete = contextSafe(() => {
		gsap.to(itemRef.current, {
			opacity: 0,
			x: 100,
			duration: 0.5,
			onComplete: () => onDeleteWatchedMovie(movie.imdbID),
		});
	});

	return (
		<li ref={itemRef}>
			<img
				src={movie.poster}
				alt={`${movie.title} poster`}
			/>
			<h3>{movie.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime}</span>
				</p>
				<button
					className="btn-delete"
					onClick={handleDelete}
				>
					x
				</button>
			</div>
		</li>
	);
}

function MovieDetails({ selectedID, onCloseMovie, onRate, watchedMovies }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState("");
	const [userRating, setUserRating] = useState("");
	const userRatingDecisions = useRef(0);

	const {
		Title: title,
		Poster: poster,
		Year: year,
		imdbRating,
		imdbID,
		Plot: plot,
		Runtime: runtime,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
		Rated: rated,
	} = movie;

	const watchedMovie = watchedMovies.find((item) => item.imdbID === selectedID);
	const rating = watchedMovie ? watchedMovie.userRating : 0;
	const container = useRef(null);

	function handleAddToWatchList() {
		const watchedMovie = {
			imdbID,
			title,
			year,
			poster,
			imdbRating: Number.parseFloat(imdbRating),
			runtime: Number.parseFloat(runtime),
			userRating: userRating,
			userRatingTimes: userRatingDecisions.current,
		};

		onRate(watchedMovie);
		onCloseMovie();
	}

	useKey("EscApE", onCloseMovie);

	useEffect(() => {
		if (userRating) userRatingDecisions.current++;
	}, [userRating]);

	useEffect(() => {
		async function fetchMovieDetails() {
			try {
				setIsLoading(true);
				setIsError("");
				const res =
					await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedID}
					`);
				if (!res.ok)
					throw new Error(`Something went wrong fetching movie ${res.status}`);
				const data = await res.json();

				if (data.Response === "False")
					throw new Error("Couldn't get this movie!");

				setMovie(data);
			} catch (error) {
				console.error(error);
				setIsError(error.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchMovieDetails();
	}, [selectedID]);

	useEffect(() => {
		document.title = `Movie | ${title}`;

		return () => (document.title = `usePopcorn`);
	}, [title]);

	useGSAP(
		() => {
			if (!movie) return;

			let tl = gsap.timeline({ defaults: { ease: "power2", duration: 0.681 } });
			tl.from("header img", {
				opacity: 0,
				x: -30,
			})
				.from(
					"header div h2",
					{
						opacity: 0,
						x: 30,
					},
					">-.381"
				)
				.from(
					"header div p:nth-child(2)",
					{
						opacity: 0,
						x: 20,
					},
					">-.381"
				)
				.from(
					"header div p:nth-child(3)",
					{
						opacity: 0,
						x: 20,
					},
					">-.381"
				)
				.from(
					"header div p:nth-child(4)",
					{
						opacity: 0,
						x: 20,
					},
					">-.381"
				)
				.from(
					"header div p:nth-child(5)",
					{
						opacity: 0,
						x: 20,
					},
					">-.381"
				)
				.from(
					"section .rating",
					{
						autoAlpha: 0,
						y: 20,
					},
					">-.681"
				)
				.from(
					"section p:nth-child(2)",
					{
						opacity: 0,
						y: 20,
					},
					">-.381"
				)
				.from(
					"section p:nth-child(3)",
					{
						opacity: 0,
						y: 20,
					},
					">-.381"
				)
				.from(
					"section p:nth-child(4)",
					{
						opacity: 0,
						y: 20,
					},
					">-.381"
				);
		},
		{ scope: container, dependencies: [movie], revertOnUpdate: true }
	);

	return (
		<div
			className="details"
			ref={container}
		>
			{isLoading && <Loader></Loader>}

			{!isLoading && !isError && (
				<>
					<header>
						<img
							src={poster}
							alt={`Poster of ${title}`}
						></img>
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating}
							</p>
							<p>{rated}</p>
						</div>
					</header>
					<section>
						<div className="rating">
							<StarRating
								maxRating={10}
								size={26}
								onSetRating={setUserRating}
								defaultRating={rating}
							/>
							{userRating && (
								<button
									className="btn-add"
									onClick={handleAddToWatchList}
								>
									+ Add to list
								</button>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}

			{isError && <ErrorMessage></ErrorMessage>}

			<button
				className="btn-back"
				onClick={onCloseMovie}
			>
				&larr;
			</button>
		</div>
	);
}
