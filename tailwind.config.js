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
				quicksand_regular: ["Quicksand-Regular"],
				quicksand_medium: ["Quicksand-Medium"],
				quicksand_bold: ["Quicksand-Bold"],
				quicksand_semibold: ["Quicksand-SemiBold"],
			},
		},
	},
	plugins: [],
};
