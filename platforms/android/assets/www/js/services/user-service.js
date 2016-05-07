var UserService = function() {
	var url;
	this.initialize = function(serviceURL) {
	    url = serviceURL ? serviceURL : "http://10.0.2.2:3000/api";
	    var deferred = $.Deferred();
	    deferred.resolve();
	    return deferred.promise();
	};
	this.getAllUsers = function() {
		return $.ajax({url: url+'/users/all', method: 'GET'});
	};
	this.getUserDates = function(userId) {
		return $.ajax({url: url+'/dates/all/'+userId, method: 'GET'});
	};
	this.getUserInterests = function(userId){
		return $.ajax({url: url+'/users/interests/all/'+userId, method: 'GET'});
	};
	this.getImpressData = function(currentUserId, partnerId, categoryId){
		return $.ajax({url: url+'/users/interests/impress/'+partnerId+'/'+categoryId, data : {userId : currentUserId}, method: 'GET'});
	};
	this.loginUser = function(userCreds){
		return $.ajax({url: url+'/users/login', data: userCreds, method: 'POST'});
	};

}
