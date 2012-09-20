module.exports = function(config){
	var jquery_js = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js';
	var github = config.github;
	var requestLib = config.requestLib;
	var jsdom = config.jsdom;
	var milestoneMap = new Object();
	var entryList;

	return {
		index: function(req, res) {
		  	res.render('index', { title: 'gcissueimport', message:'GoogleCode issue import' });
		},
		auth: function(req, res) {},
		callback: function(req, res) {
		    res.redirect('/');
		},
		importLabel: function(req, res) {
			var url = 'https://code.google.com/feeds/issues/p/'+req.param("project")+'/issues/full?max-results=1';
			req.session.githubuser = req.param('user');
			req.session.githubrepo = req.param('repo');
 			requestLib(url, function(error, response, body){
    			if(!error, response, body){
        			var document = jsdom.jsdom();
        			var window = document.createWindow();
        			jsdom.jQueryify(window, jquery_js, function (window, jQuery) {
						var labelMap = new Object();
            			entryList = jQuery(body).find("entry");
            			jQuery.each(entryList, function(i, val){
             				jQuery(val).find("issues\\:label").each(function(){
             					var label = jQuery(this).html();
             					if(label.match(/milestone/i)){
             						milestoneMap[jQuery(this).html()] = jQuery(this).html();
             					}else{
	             					labelMap[jQuery(this).html()] = jQuery(this).html();
             					}
             				});
            			});
						var j = 0;
						var k = 0;
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
										if(Object.keys(milestoneMap).length > 0){
											jQuery.each(milestoneMap, function(i2, val2){
												github.issues.createMilestone(
													{
														user: req.session.githubuser,
														repo: req.session.githubrepo,
														title: val2
													},
													function(err2, response2){
														milestoneMap[val2] = response2.number;
														k++;
														if(k >= Object.keys(milestoneMap).length){
															res.render('finish', { title: 'gcissueimport', message: "Import Label and Milestone"});
														}
													}
												);
											});
										}else{
											res.render('finish', { title: 'gcissueimport', message: "Import Label"});											
										}
									}
								}
							);
						});
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
       			jQuery.each(entryList, function(i, val){
       				var labelArr = new Array();
       				var milestone = -1;
					var parameter = {};

   					jQuery(val).find("issues\\:label").each(function(){
   						var label = jQuery(this).html();
             			if(label.match(/milestone/i)){
             				milestone = milestoneMap[jQuery(this).html()];
             			}else{
	       					labelArr.push(jQuery(this).html());
             			}
   					});

   					if(milestone != -1){
   						parameter = 
   							{
   								user: req.session.githubuser,
								repo: req.session.githubrepo,
								title: jQuery(val).find("title").html(),
								body: jQuery(val).find("content").html(),
								milestone: milestone,
								labels: labelArr
   							};
   					}else{
   						parameter = 
   							{
   								user: req.session.githubuser,
								repo: req.session.githubrepo,
								title: jQuery(val).find("title").html(),
								body: jQuery(val).find("content").html(),
								labels: labelArr
   							};
   					}

					console.log(parameter);
					var j = 0;
   					github.issues.create(parameter, function(err, response){
						j++;
						if(j >= entryList.length){
							res.render('finish', { title: 'gcissueimport', message: "Imported Issues"});
						}	
   					});
       			});
       		});
		}
	}
};