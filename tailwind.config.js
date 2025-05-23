/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				'grey-0': '#f2f2f7',
				'grey-9': '#dcdce1',
				'grey-21': '#bfbfc3',
				'grey-28': '#aeaeb2',
				'grey-35': '#9d9da1',
				'grey-49': '#7b7b7e',
				'grey-58': '#666668',
				'grey-80': '#303031',
				'grey-94': '#0f0f0f',

				'brand-blue': '#0c7ae2',
				'dark-blue': '#05549e',
				'light-blue': '#399cf9',
				'azure-blue': '#1a8bf8',

				'light-green': '#ACE5B2',
                'brand-green': '#75D87F',
                'dark-green': '#5C9F63',
			},
		},
	},
	plugins: [],
};
