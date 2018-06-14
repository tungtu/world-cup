module.exports = {

	'facebookAuth' : {
		'clientID'      : '883615401791167', // your App ID
		'clientSecret'  : '6cd9253e1e33061fe7edadd6f645fec6', // your App Secret
		'callbackURL'   : 'http://localhost:3001/auth/facebook/callback',
		'profileURL'    : 'https://graph.facebook.com/v2.10/me?fields=first_name,last_name,email',
		'profileFields' : ['id', 'email', 'gender', 'link', 'name', 'photos'] // For requesting permissions from Facebook API
	},

	'googleAuth' : {
		'clientID'      : '1019482309916-k3m4q4nq7aekqcg8l0mm0v805rmi7r7e.apps.googleusercontent.com',
		'clientSecret'  : 'pyCWVS_ZGWOKxhSgG_JDpj6q',
		'callbackURL'   : 'http://localhost:3001/auth/google/callback'
	}

};