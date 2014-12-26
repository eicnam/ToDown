
app.directive('focusMe', function() {
	 return function(scope, element){
		 element[0].focus();
	 }; 
});

