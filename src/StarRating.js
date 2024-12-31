import { useState } from "react";

const containerStyle = {
	display: "flex",
	gap: "8px",
	alignItems: "center",

	lineHeight: "1",
};

const containerStarStyle = {
	display: "flex",
	alignItems: "center",
	lineHeight: "1",
};

/**
 * StarRating component allows users to rate items using a star-based rating system.
 *
 * @param {Object} props - The properties object.
 * @param {number} [props.maxRating=5] - The maximum number of stars for the rating.
 * @param {string} [props.color="#fcc419"] - The color of the stars.
 * @param {number} [props.size=48] - The size of the stars in pixels.
 * @param {Array<string>} [props.messages=[]] - An array of messages corresponding to each rating.
 * @param {number} [props.defaultRating] - The default rating value.
 * @param {string} [props.className=""] - Additional class names for the container.
 * @param {Function} [props.onSetRating=() => {}] - Callback function to handle rating changes.
 * @returns {JSX.Element} The StarRating component.
 */
export default function StarRating({
	maxRating = 5,
	color = "#fcc419",
	size = 48,
	messages = [],
	defaultRating,
	className = "",
	onSetRating = () => {},
}) {
	const textStyle = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",

		margin: "0",
		lineHeight: "0",
		fontSize: `${size / 1.5}px`,
		color,
	};

	const [rating, setRating] = useState(
		defaultRating <= maxRating ? defaultRating : 0
	);
	const [tempRating, setTempRating] = useState(0);

	function handleSetRating(rating) {
		setRating(rating);
		onSetRating(rating);
	}

	return (
		<div
			style={containerStyle}
			className={className}
		>
			<div style={containerStarStyle}>
				{Array.from({ length: maxRating }, (_, i) => (
					<Star
						key={i + 1}
						onClick={() => handleSetRating(i + 1)}
						onMouseEnter={() => setTempRating(i + 1)}
						onMouseLeave={() => setTempRating(0)}
						isFull={tempRating ? i < tempRating : i < rating}
						color={color}
						size={size}
					/>
				))}
			</div>
			<p style={textStyle}>
				{messages.length === maxRating
					? messages[tempRating ? tempRating : rating]
					: tempRating || rating || ""}
			</p>
		</div>
	);
}

function Star({ onClick, isFull, onMouseEnter, onMouseLeave, color, size }) {
	const svgStyle = {
		height: `${size}px`,
		width: `${size}px`,
		color,
		cursor: "pointer",
	};
	return (
		<div
			style={svgStyle}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{isFull ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill={color}
					stroke={color}
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke={color}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="{2}"
						d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
					/>
				</svg>
			)}
		</div>
	);
}
