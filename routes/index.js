module.exports = function(config){
	var github = config.github;
	return {
		index: function(req, res) {
			github.repos.getAll({},function(err, res){
				console.log(res);
			});
		  	res.render('index', { title: 'Express' });
		},
		auth: function(req, res) {},
		callback: function(req, res) {
			//githubを作る？
			github.authenticate({
    			type: "oauth",
			    token: req.session.passport.user
			});
		    res.redirect('/');
		}
	}
};