(function(window){
	var map = L.map('map').fitBounds([
		[50.5, 5],
		[52.5, 6]
	  ]);

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var startStyle = {
		color: "orange",
		fillColor: "yellow"
	  };

	fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
		.then(res => res.json())
		.then((out) => {
			var polygons = L.geoJson(out, {
				style: startStyle
			}).addTo(map).on("click", function(event) {
				event.layer.setStyle({
					fillColor: "red"
				});
			}).on("mouseout", function(event) {
				event.layer.setStyle(startStyle);
			});

			var overlays = L.layerGroup().addTo(map);
			L.circle([51.5, 5.5], 100000).addTo(overlays).on("mouseover", function() {
			  this.setStyle({
				fillColor: "green",
				fillOpacity: 0.8
			  });

			}).on("mouseout", function() {
			  this.setStyle({
				fillColor: "blue",
				fillOpacity: 0.2
			  });
			});

			trackLayerForMouseEvents(map, polygons);
		});


	function trackLayerForMouseEvents(map, layer) {
		map.on('mousemove', function(event) {
			var latlng = event.latlng;
			var point = [latlng.lng, latlng.lat];
			layer.eachLayer(function(polygon) {
				var geoJson = polygon.toGeoJSON();
				if(d3.geoContains(geoJson, point)) {
					layer.fire('mouseover', {
						latlng: latlng,
						layerPoint: event.layerPoint,
						containerPoint: event.containerPoint,
						originalEvent: event.originalEvent,
						layer: polygon
					});
				} else {
					layer.fire('mouseout', {
						latlng: latlng,
						layerPoint: event.layerPoint,
						containerPoint: event.containerPoint,
						originalEvent: event.originalEvent,
						layer: polygon
					});
				}
			});
		});
		map.on('click', function(event) {
			var latlng = event.latlng;
			var point = [latlng.lng, latlng.lat];
			layer.eachLayer(function(polygon) {
				var geoJson = polygon.toGeoJSON();
				if(d3.geoContains(geoJson, point)) {
					layer.fire('click', {
						latlng: latlng,
						layerPoint: event.layerPoint,
						containerPoint: event.containerPoint,
						originalEvent: event.originalEvent,
						layer: polygon
					});
				}
			});
		});
	}
})(window);
