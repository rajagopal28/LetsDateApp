var UserService = function() {
	var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://localhost:3000/api";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }
    this.findAll = function() {
    	return $.ajax({url: url+'/users/all', method: 'GET'});
    };
		this.getUserInterests = function(userId){
			return $.ajax({url: url+'/users/interests/all/'+userId, method: 'GET'});
		};

}
