module.exports = function(config){
	var github = config.github;
	return {
		index: function(req, res) {
			github.authenticate({
				type: "oauth",
				token: ""
			})
		  res.render('index', { title: 'Express' });
		}
	}
};