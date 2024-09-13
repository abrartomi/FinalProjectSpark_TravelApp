module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,txt,html}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};