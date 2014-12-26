
app.service('freebaseService',function($http){
	//Your API Key from Google goes here
	var apiKey = 'AIzaSyBaohCgE0hyEWqp96c1OdMZpcsqJnSLYQo';
	var serviceUrl = 'https://www.googleapis.com/freebase/v1/mqlread';
	apiKey = ((apiKey) ? 'key=' + encodeURIComponent(apiKey) + '&' : '');
	this.lookup = function(query){
		return $http.jsonp(serviceUrl + '?' + apiKey + 'callback=JSON_CALLBACK&query=' + JSON.stringify(query))
			.success(function(data, status, headers, config){
				return data;
			})
			.error(function(data, status, headers, config){
				console.error('Error Getting Data from Freebase' + data);
			});
	}
});
