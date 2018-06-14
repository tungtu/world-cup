module.exports = {

	'facebookAuth' : {
		'clientID'      : '161482264651282', // your App ID
		'clientSecret'  : '0bfd02960b2e72ba84ff6529f66b7887', // your App Secret
		'callbackURL'   : 'http://b4usolution.xyz/auth/facebook/callback',
		'profileURL'    : 'https://graph.facebook.com/v2.10/me?fields=first_name,last_name,email',
		'profileFields' : ['id', 'email', 'gender', 'link', 'name', 'photos'] // For requesting permissions from Facebook API
	},

	'googleAuth' : {
		'clientID'      : '1019482309916-k3m4q4nq7aekqcg8l0mm0v805rmi7r7e.apps.googleusercontent.com',
		'clientSecret'  : 'pyCWVS_ZGWOKxhSgG_JDpj6q',
		'callbackURL'   : 'https://topica-worldcup.herokuapp.com/auth/google/callback'
	}

};