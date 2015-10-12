
var	dataLocations = [
   	                 {
   	                	 position: {lat: 40.438169, lng: -3.687462},
   	                	 title: 'Restaurant Trujillo',
   	                	 tags: ['restaurant']
   	                 },
   	                 {
   	                	 position:  {lat: 40.436630, lng: -3.690134},
   	                	 title: 'Hotel InterContinetal ',
   	                	 tags: ['hotel']
   	                 },
   	                 {
   	                	 position:  {lat: 40.436908, lng: -3.685896},
   	                	 title: 'Hotel Suites Barrio Salamanca ',
   	                	 tags: ['hotel']
   	                 },
   	                 {
   	                	 position:  {lat: 40.436467, lng: -3.683814},
   	                	 title: 'Restaurant 29 Fanegas ',
   	                	 tags: ['restaurant']
   	                 },
   	                 {
   	                	 position:  {lat: 40.436254, lng: -3.685756},
   	                	 title: 'Cinco Jotas Serrano ',
   	                	 tags: ['restaurant']
   	                 },
   	                 ];


var map;
var newWindow;
/* function that load the map 
 * 
 */
function initialize() {

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.437214, lng: -3.685638},
		zoom: 16
	});
	ko.applyBindings(new NeighborhoodModel());


}

/* Function called to intialized the name of location
 *
 */
function buildLocation(nameLocation,lat,lng){
	var self = this;

	self.nameLocation = nameLocation;
	self.lat = lat;
	self.lng = lng;
	self.clicked = 0;
}
/* function that load the locations list that the user searches
 * 
 */	 
function  NeighborhoodModel() {
	var self = this;
	self.isFocused = ko.observable();
	self.listLocatons = ko.observableArray([]);
	self.searchLocation = ko.observable("");
	self.locations = ko.observableArray([]);
	self.nameLocation = ko.observable(" ");





	/* Function that fill location list
	 * 
	 */
	self.loadList = function() {
		self.locations.removeAll();
		for (var i=0; i<dataLocations.length; i++) {
			self.locations.push(new buildLocation(dataLocations[i].title,dataLocations[i].position.lat, dataLocations[i].position.lng));
		}
	};
	/*function than load of FourSquare additional information
	 * 
	 */
	self.AdditionalInformation = function(location,fecha,coordenatelat,coordenatelong,marker){
		var errorTimeout = window.setTimeout(function() {
			alert('Oops!  There was a problem retrieving fourSquare data.  Please try again later.');
		}, 5000);


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
					window.clearTimeout(errorTimeout);
					var venues1 = data.response.venues;
					var j = 0;
					self.html = '<table border="0">';

					if (venues1.length === 0){
						var errorTimeout = window.setTimeout(function() {
							alert('Oops!  There was a problem retrieving fourSquare data.  Please try again later.');
						}, 5000);
					}
					while (j < 1 && j < venues1.length) {
						j++;
						self.html += '<tr>';
						self.html += '<td>'+venues1[0].name + '</td>';
						self.html += '</tr>';
						self.html += '<tr>';
						self.html += '<td>'+venues1[0].location.address + '</td>';
						self.html += '</tr>';
					}
					self.html += '</table>';
					// Is the infowindow currently defined?
					if (self.infowindow !== undefined) {
						self.infowindow.close(); // close the infowindow
					}
					self.infowindow = new google.maps.InfoWindow({
						content: self.html	
					});	

					self.infowindow.open(map, marker);

				},
				error: function() {
					console.log("error");
				}
		};

		$.ajax(settings);
	};

	/*When the user click in the search bar, I load the list with all the locations
	 * and I initialize the markers
	 */
	self.reLoadList = function(){
		if (typeof map !== 'undefined') {
			self.loadList();
			self.searcherLocations();
			self.initializeMarks();

		}
	};
	self.openMark = function(nameLocation) {

		nameLocation.clicked = 1;

		for (var i206 = 0; i206 < self.markersEnabled().length; i206++) {
			self.markersEnabled()[i206].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
		}


		for (var i205 = 0; i205 < self.markersEnabled().length; i205++){


			if (nameLocation.nameLocation === self.markersEnabled()[i205].title) {
				self.markersEnabled()[i205].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
				var latitude = self.markersEnabled()[i205].position.lat();
				var longitude = self.markersEnabled()[i205].position.lng();
				var title = self.markersEnabled()[i205].title;
				self.fecha = '20151001';
				self.AdditionalInformation(title,self.fecha,latitude,longitude,self.markersEnabled()[i205]);

			}
		}

	}; 

	self.loadList();


	/* This function initialized the markers. Whe it searches a text in the search bar. Markers
	 * are updated
	 */
	self.initializeMarks = function () {
		for (var i201 = 0; i201 < self.markersEnabled().length;i201++){
			self.markersEnabled()[i201].setVisible(false);
		}
		for ( var i202 = 0; i202 < self.markersEnabled().length; i202++){
			for (var i203 = 0; i203 < self.locations().length; i203++){
				titleMarker =  self.locations()[i203].nameLocation;
				if (self.markersEnabled()[i202].title === titleMarker ){
					self.markersEnabled()[i202].setVisible(true);
				}
			}

		}
	};

	/*Function that only selected the locations that matches with the user search
	 * 
	 */

	self.searcherLocations = function() {
		self.locations.removeAll();
		var existe;
		for (var i = 0; i < dataLocations.length; i++) {
			existe = dataLocations[i].title.toLowerCase().indexOf(self.searchLocation().toLowerCase());
			if (existe > -1) {
				self.locations.push(new buildLocation(dataLocations[i].title));
			}
		}
	};
	
    self.eventMarker = function(marker){
		google.maps.event.addListener(marker, "click", function () {
			for (var i106 = 0; i106 < self.markers().length; i106++) {
				self.markers()[i106].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
			}
			marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
			var latitude = this.position.lat();
			var longitude = this.position.lng();
			var title = this.title;
			self.AdditionalInformation(title,self.fecha,latitude,longitude,marker);
		}); //end addListener
	}

	/*This function loads the markers in the map. I have a json with the location.
	 * The marker are created with the json location information
	 * Also it creates the event on click 
	 */
	self.loadMarkers = function() {
		if (typeof map !== 'undefined') {
			self.markers = ko.observableArray([]);
			self.markersEnabled  = ko.observableArray([]);
			for (var i2=0; i2<self.locations().length; i2++) {
				self.lat = self.locations()[i2].lat;
				self.lng = self.locations()[i2].lng;
				self.title = self.locations()[i2].nameLocation;
				self.fecha = '20151001';
				marker = new google.maps.Marker(
						{
							position: new google.maps.LatLng(self.lat, self.lng),
							title: self.title,
							map: map,
							icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
						});
				self.markers.push(marker);
				self.markersEnabled.push(marker);
				self.markers()[i2].setMap(map);
			}

			for (var i103 = 0 ; i103<self.markers().length; i103++){
				self.eventMarker(self.markers()[i103]);
				/*(function(i103){
					google.maps.event.addListener(self.markers()[i103], "click", function () {
						for (var i106 = 0; i106 < self.markers().length; i106++) {
							self.markers()[i106].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
						}
						self.markers()[i103].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
						var latitude = this.position.lat();
						var longitude = this.position.lng();
						var title = this.title;
						self.AdditionalInformation(title,self.fecha,latitude,longitude,self.markers()[i103]);
					}); //end addListener
				})(i103);*/
			}
			self.loadList();
		}
	};
	self.loadMarkers()
}


