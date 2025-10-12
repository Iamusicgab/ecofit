/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./App.{js,jsx,ts,tsx}",
		"./screens/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				quicksand_regular: ["quicksand-regular", "sans-serif"],
				quicksand_medium: ["quicksand-medium", "sans-serif"],
				quicksand_semibold: ["quicksand-semibold", "sans-serif"],
				quicksand_bold: ["quicksand-bold", "sans-serif"],
			},
		},
	},
	plugins: [],
};
