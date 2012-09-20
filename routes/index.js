module.exports = function(config){
	var jquery_js = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js';
	var github = config.github;
	var requestLib = config.requestLib;
	var jsdom = config.jsdom;
	var entryList;
	var labelMap = new Object();

	return {
		index: function(req, res) {
		  	res.render('index', { title: 'gcissueimport', message:'GoogleCode issue import' });
		},
		auth: function(req, res) {},
		callback: function(req, res) {
		    res.redirect('/');
		},
		importLabel: function(req, res) {
			var url = 'https://code.google.com/feeds/issues/p/'+req.param("project")+'/issues/full?max-results=10000';
			req.session.githubuser = req.param('user');
			req.session.githubrepo = req.param('repo');
 			requestLib(url, function(error, response, body){
    			if(!error, response, body){
        			var document = jsdom.jsdom();
        			var window = document.createWindow();
        			jsdom.jQueryify(window, jquery_js, function (window, jQuery) {
            			entryList = jQuery(body).find("entry");
            			jQuery.each(entryList, function(i, val){
             				jQuery(val).find("issues\\:label").each(function(){
             					labelMap[jQuery(this).html()] = jQuery(this).html();
             				});
            			});

						var j = 0;
						jQuery.each(labelMap, function(i, val){
							github.issues.createLabel(
								{
									user: req.session.githubuser,
									repo: req.session.githubrepo,
									name: val,
									color: 'ffffff'
								},
								function(err, response){
									// Attention: needs error code!
									j++;
									if(j >= Object.keys(labelMap).length){
										res.render('finish', { title: 'gcissueimport', message: "Import Label"});
									}
								}
							);
						});
						res.render('finish', { title: 'gcissueimport', message: "Imported Labels"});
        			});
    			}else{
    				res.render('finish', { title: 'gcissueimport', message: "Connection Error GoogleCode"});
    			}
  			});
		},
		importIssue: function(req, res) {
   			var document = jsdom.jsdom();
   			var window = document.createWindow();
   			jsdom.jQueryify(window, jquery_js, function (window, jQuery) {
				var j = 0;
       			jQuery.each(entryList, function(i, val){
       				var labelArr = new Array();
   					jQuery(val).find("issues\\:label").each(function(){
       					labelArr.push(jQuery(this).html());
   					});

   					github.issues.create(
						{
							user: req.session.githubuser,
							repo: req.session.githubrepo,
							title: jQuery(val).find("title").html(),
							body: jQuery(val).find("content").html(),
							labels: labelArr
						},
						function(err, response){
							j++;
							if(j >= Object.keys(entryList).length){
								res.render('finish', { title: 'gcissueimport', message: "Imported Issues"});
							}
						}
					);
       			});
       		});
		}
	}
};