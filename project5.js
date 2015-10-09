var dataLocations = {
		locations:[
		           {
		        	   position: {lat: 40.438169, lng: -3.687462},
		        	   title: 'Restaurant 1',
		        	   tags: ['restaurant']
		           },
		           {
		        	   position:  {lat: 40.436407, lng: -3.690125},
		        	   title: 'Restaurant 2',
		        	   tags: ['restaurant']
		           },
		           {
		        	   position:  {lat: 40.435680, lng: -3.689642},
		        	   title: 'Coffe 1 ',
		        	   tags: ['coffe']
		           },
		           ]
};

var map;
function initialize() {

	console.log("begining initialize");
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.437214, lng: -3.685638},
		zoom: 16
	});
	console.log("end  initialize");

};
/* Function called to intialized the name of location
 * 
 */
function buildLocation(searchLocation){
	var self = this;
	self.nameLocation = searchLocation;
};
/* function that load the locations list that the user searches
 * 
 */	 
function  NeighborhoodModel() {
	var self = this;
	self.isFocused=ko.observable();
	self.listLocatons = ko.observableArray([]);
	self.searchLocation= ko.observable("");
	self.locations = ko.observableArray([]);
	self.nameLocation = ko.observable(" ");
	
	
	console.log(" model searchLocation "+self.searchLocation);
	
	/* Function that fill location list
	 * 
	 */
	self.loadList = function() {
	     console.log("begin loadList");
	
		self.locations.removeAll();
		for (var i=0; i<dataLocations.locations.length; i++) {
			self.locations.push(new buildLocation(dataLocations.locations[i].title));
		}
		 console.log("end  loadList locations length "+self.locations.length);
	};
	/*function than load of FourSquare additional information
	 * 
	 */
	self.AdditionalInformation = function(location,fecha,coordenatelat,coordenatelong,marker){
		
		var client_id = 'HKOUXWROVI3L5ZYXQS0ZJQKFZMJMRAJ1NRNZDPZJMJJDGUS5';
		var client_secret = 'FMMYWKWK43Y1ZSAFIS25JU21UZ5WE2Y4CRNY1HTZDXLO4DIM';
		var url_foursquare =  'https://api.foursquare.com/v2/venues/search?client_id=';
		var url_foursquare_1 = url_foursquare + client_id + '&client_secret='+client_secret+'&v='+fecha+'&ll='+coordenatelat+","+coordenatelong+'&query='+location;
		var settings =  {
				url: url_foursquare_1,
				cache: true,
				dataType: 'jsonp',
				async: true,
				success: function(data) {
					console.log("sucess");
					var $response=$(data);
					var venues = $response.find('#response');
					var venues1 = data.response.venues;
					var j = 0;
					self.html = '<table border="1">';
					while (j < 5 && j < venues1.length) {
						j++;
						self.html += '<tr>';
						self.html += '<td>'+venues1[0].name + '</td>';
						self.html += '</tr>';
					}
					self.html += '</table>';
					self.infowindow = new google.maps.InfoWindow({
						content: self.html	
					});	
					
					self.infowindow.open(self.map, marker);
					
				},
				error: function() {
					console.log("error");
				}
		}

		$.ajax(settings);
	}; 
	/*When the user click in the search bar, I load the list with all the locations
	 * and I initialize the markers
	 */
	self.focusHandler = function(){
		console.log("begin foco");
		console.log(" foco  after load list searchLocation "+self.searchLocation());
		self.loadList();
		self.searcherLocations();
		console.log("after searcherLocations "+self.locations().length);
		
		console.log("after loadList  "+self.locations().length);
		self.initializeMarks();
	};
	self.blurHandler = function() {
		console.log("the input lost focus ");
	};
	
	for (var i=0; i<dataLocations.locations.length; i++) {
		self.locations.push(new buildLocation(dataLocations.locations[i].title));
	}
	
	/*This function loads the markers in the map. I have a json with the location.
	 * The marker are created with the json location information
	 * Also it creates the event on click 
	 */
	self.loadMarkers = function() {
		
		if (typeof map !== 'undefined') {
			
			self.markers = ko.observableArray([]);

			self.markersEnabled  = ko.observableArray([]);
			for (var i2=0; i2<dataLocations.locations.length; i2++) {

			
				self.lat = dataLocations.locations[i2].position.lat;
				self.lng = dataLocations.locations[i2].position.lng;
				self.title = dataLocations.locations[i2].title;
				
				self.fecha = '20151001'
					marker = new google.maps.Marker(
							{
								position: new google.maps.LatLng(self.lat, self.lng),
								title: self.title,
								map: map
							});

				
				self.markers.push(marker);
				self.markersEnabled.push(marker);
				
				self.markers()[i2].setMap(map);
				

			}
			
			for (var i101 = 0 ; i101<self.markers().length; i101++){
				
				
				google.maps.event.addListener(self.markers()[i101], "click", function (event) {
					var latitude = this.position.lat();
					var longitude = this.position.lng();
					var title = this.title;
					
					self.AdditionalInformation(title,self.fecha,latitude,longitude,marker);
				}); //end addListener


			}
			clearInterval(myVar);
		}
	};
	/* This function initialized the markers. Whe it searches a text in the search bar. Markers
	 * are updated
	 */
	self.initializeMarks = function () {
		self.lat = ko.observable(" ");
		self.lng = ko.observable(" ");
		self.title = ko.observable(" ");
		self.existeEnabled = ko.observable("");
		self.existeDisabled = ko.observable(" ");
		self.markerTitle = ko.observable(""); 
		self.removeMarkers = function() {
			for (var i3 = 0; i3 < self.markersEnabled().length;i3++) {
				self.markersEnabled()[i3].setMap(null);
			}
		}
		self.removeMarkers();
		self.markersEnabled.removeAll();
		for(var  i=0; i<self.locations().length; i++) {
			titleMarker = ko.observable("");
			titleMarker =  self.locations()[i].nameLocation;
			markerTitle = "wwwww";
			var posicion= 0;
			for (var b = 0; b<self.markers().length; b++) {
				if (self.markers()[b].title == titleMarker) {
					posicion = self.markers()[b].position;
				}
			}
			var posicion = 0;
			for (var b2=0; b2<dataLocations.locations.length; b2++) {
				if (dataLocations.locations[b2].title== titleMarker) {
					posicion = dataLocations.locations[b2].position;
					self.lat = dataLocations.locations[b2].position.lat;
					self.lng = dataLocations.locations[b2].position.lng;
					self.title = dataLocations.locations[b2].title;
				}
			}
			if ( posicion != 0) {
				var marker = new google.maps.Marker(
						{
							position: new google.maps.LatLng(self.lat,self.lng),
							title:self.title,
							map: map
						});

				marker.setMap(map);
				self.markersEnabled.push(marker);
			}
		}	

		for (var i102 = 0 ; i102<self.markersEnabled().length; i102++){
			
			
			google.maps.event.addListener(self.markersEnabled()[i102], "click", function (event) {
				var latitude = this.position.lat();
				var longitude = this.position.lng();
				var title = this.title;
				
				self.AdditionalInformation(title,self.fecha,latitude,longitude,marker);
			}); //end addListener


		}
	};

	/*Function that only selected the locations that matches with the user search
	 * 
	 */
	self.searcherLocations = function() {
		console.log("en searcherLocations");
		var cadena = self.searchLocation();
		console.log(" en searcherLocations cadena "+cadena+ "self.searcherLocation "+self.searchLocation());
		var nativeArray = ko.observableArray();
		
		for (var i=0; i< self.locations().length;i++) {
			nativeArray.push(new buildLocation(self.locations()[i].nameLocation));
		}
		console.log("step1 searcherLocations nativeArray size"+nativeArray().length);
		self.locations.removeAll();
		for (var i=0; i<nativeArray().length;i++) {
			var existe = nativeArray()[i].nameLocation.toLowerCase().indexOf(cadena.toLowerCase())
			if (existe > -1) {
				self.locations.push(new buildLocation(nativeArray()[i].nameLocation));
			}
			else {
				console.log("not exist "+existe);
			}
		}
		console.log("step2 searcherLocations self.locations "+self.locations().length);
		//self.initializeMarks();

	};
	self.loadScript = function() {
		console.log("start loadScript");
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
		'&signed_in=true&callback=initialize';
		document.body.appendChild(script);
	}
	window.onload = self.loadScript();
	//myVar = setInterval(alertFunc, 3000);
	myVar = setInterval(self.loadMarkers, 30000);
};
//Activates knockout.js
ko.applyBindings(new NeighborhoodModel());
