var UserService = function() {
	var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://localhost:3000/api/users";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }
    this.findAll = function() {
    	return $.ajax({url: url, method: 'GET'});
    }
    this.findById = function(id) {
        return $.ajax({url: url + "/" + id});
    }

    this.findByName = function(searchKey) {
        return $.ajax({url: url + "?name=" + searchKey});
    }

}