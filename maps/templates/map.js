
/*
 Maps namespace

 gnt.maps
*/
gnt.maps = {};


var map = undefined;
gnt.maps.layer = undefined;
gnt.maps.layers = [];

{% if map_data.google_key %}
/*
 * This function injects google maps API to document
 */
gnt.maps.GoogleLoaded = false;
gnt.maps.loadGoogleMaps = function() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key={{ map_data.google_key }}&sensor=false&language={{ LANGUAGE_CODE }}&callback=gnt.maps.create_google";
  document.body.appendChild(script);
};

gnt.maps.create_google = function() {
    gnt.maps.GoogleLoaded = true;
    gnt.maps.create_map(gnt.maps.map_div, gnt.maps.callback_function);
};
{% endif %}

/*
This function creates the map and layers.

Additional parameters and layers can be given to the
function.

map_div -- id of the element to create the map into
initial_extent -- initial extent where the map should open
callback_function -- callback function the to be called after creation
    The callback_function will get the map as a parameter
*/
gnt.maps.create_map = function (map_div, callback_function) {
    var layer;
    {% if map_data.google_key %}
    if(!gnt.maps.GoogleLoaded) {
        gnt.maps.map_div = map_div;
        gnt.maps.callback_function = callback_function;
        gnt.maps.loadGoogleMaps()
        return;
    }
    {% endif %}

    var mapOptions = {};
    var map_options_created = false;

    {% for layer in layer_data %}

        {% if layer.protocol == 'OSM-standard' %}
        layer = new OpenLayers.Layer.OSM('OSM-standard');
        {% endif %}


        {% if layer.protocol == 'Google-satellite' %}
        layer = new OpenLayers.Layer.Google('Satellite', {
                                        type: google.maps.MapTypeId.SATELLITE,
                                        numZoomLevels: 22
                                        });
        {% endif %}

        {% if layer.protocol == 'Google-hybrid' %}
        layer = new OpenLayers.Layer.Google('Hybrid', {
                                        type: google.maps.MapTypeId.HYBRID,
                                        numZoomLevels: 22
                                        });
        {% endif %}

        {% if layer.protocol == 'Google-road' %}
        layer = new OpenLayers.Layer.Google('Road', {
                                        type: google.maps.MapTypeId.ROAD,
                                        numZoomLevels: 22
                                        });
        {% endif %}

        {% if layer.protocol == 'Google-terrain' %}
        layer = new OpenLayers.Layer.Google('Terrain', {
                                        type: google.maps.MapTypeId.TERRAIN
                                        });
        {% endif %}
        {% if layer.protocol == 'Bing-satellite' %}
        layer = new OpenLayers.Layer.Bing({
                                        name: "Satellite",
                                        type: "AerialWithLabels",
                                        key: "AjB69asvfCy_FaIvDNBzCFc2eJdF7m7_bA7-M-xpJKctrxjmYQjqYX5DRCH0sd3J",
                                        culture: "en"});
        {% endif %}
        {% if layer.protocol == 'Imagefile' %}
        size = "{{layer.layer_info}}".split(',');
        layer = new OpenLayers.Layer.Image(
                        'Imagemap',
                        "{{ layer.source }}",
                        new OpenLayers.Bounds(0,0,size[0],size[1]),
                        new OpenLayers.Size(size[0], size[1]),
                        {numZoomLevels: 3});
        {% endif %}

        {% if layer.protocol == 'OSM-cyclemap' %}
        layer = new OpenLayers.Layer.OSM('OSM-cyclemap',
            ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
            "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
            "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]);
        {% endif%}

        {% if layer.protocol == 'MapBox' %}
        layer = new OpenLayers.Layer.OSM('MapBox',
         [  "http://a.tiles.mapbox.com/v3/mmlodkowski.gpl722i4/${z}/${x}/${y}.png",
            "http://b.tiles.mapbox.com/v3/mmlodkowski.gpl722i4/${z}/${x}/${y}.png",
            "http://c.tiles.mapbox.com/v3/mmlodkowski.gpl722i4/${z}/${x}/${y}.png",
            "http://d.tiles.mapbox.com/v3/mmlodkowski.gpl722i4/${z}/${x}/${y}.png"]);
        {% endif%}

        {% if layer.protocol == 'MapBox-satellite' %}
        layer = new OpenLayers.Layer.OSM('Satelita',
            [   "http://a.tiles.mapbox.com/v3/2michal3.gig3bd66/${z}/${x}/${y}.png",
                "http://b.tiles.mapbox.com/v3/2michal3.gig3bd66/${z}/${x}/${y}.png",
                "http://c.tiles.mapbox.com/v3/2michal3.gig3bd66/${z}/${x}/${y}.png",
                "http://d.tiles.mapbox.com/v3/2michal3.gig3bd66/${z}/${x}/${y}.png"]);
        {% endif %}

        {% if layer.protocol == 'MapBox-road' %}
        layer = new OpenLayers.Layer.OSM('Ulice',
            [   "http://a.tiles.mapbox.com/v3/2michal3.gig154l5/${z}/${x}/${y}.png",
                "http://b.tiles.mapbox.com/v3/2michal3.gig154l5/${z}/${x}/${y}.png",
                "http://c.tiles.mapbox.com/v3/2michal3.gig154l5/${z}/${x}/${y}.png",
                "http://d.tiles.mapbox.com/v3/2michal3.gig154l5/${z}/${x}/${y}.png"]);
        {% endif %}


        {% if layer.protocol == 'OSM-mapquest' %}
        layer = new OpenLayers.Layer.OSM('OSM-mapquest',
            ["http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
             "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
             "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
             "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg"]);
        {% endif %}

        {% if layer.protocol == 'OSM-watercolor' %}
        layer = new OpenLayers.Layer.OSM('OSM-watercolor',
            ["http://a.tile.stamen.com/watercolor/${z}/${x}/${y}.jpg",
             "http://b.tile.stamen.com/watercolor/${z}/${x}/${y}.jpg",
             "http://c.tile.stamen.com/watercolor/${z}/${x}/${y}.jpg",
             "http://d.tile.stamen.com/watercolor/${z}/${x}/${y}.jpg"]);
        {% endif %}

        {% if layer.protocol == 'ArcGISCache' %}
        var layer_info = {{ layer.layer_info|safe }};
        layer = new OpenLayers.Layer.ArcGISCache(
                    "{{ layer.name }}",
                    "{{ layer.source }}",
                    {
                    layerInfo: layer_info,
                    attribution: layer_info.copyrightText
                    }
                );

        mapOptions = {
            maxExtent: layer.maxExtent,
            units: layer.units,
            resolutions: layer.resolutions,
            numZoomLevels: layer.lods.length,
            tileSize: layer.tileSize,
            projection: layer.projection,
            restrictedExtent: layer.maxExtent
        };
        map_options_created = true;
        {% endif %}


        {% if layer.protocol == 'ArcGISREST' %}
        layer = new OpenLayers.Layer.ArcGIS93Rest(
            "{{ layer.name }}",
            "{{ layer.source }}",
            {{ layer.layer_info|safe }},
            {isBaseLayer: false}
        );
        {% endif %}
        if(map_options_created === false) {
            mapOptions = {
                projection: new OpenLayers.Projection("EPSG:{{ map_data.projection }}"),
                matrixSet: "EPSG:{{ map_data.projection }}",
                maxExtent: new OpenLayers.Bounds({{ map_data.max_extent }}),
                units: "m",
                maxResolution: {{ map_data.max_resolution|stringformat:"f" }},
                format: "image/png",
                zoom: {{ map_data.zoom_level }},
                numZoomLevels: 15,
                style : "_null",
                tileSize: new OpenLayers.Size({{ map_data.tile_size }})
            };
        }
        {% if layer.protocol == 'WMTS' %}
        var matrixIds = new Array(16);
            for (var i=0; i<16; ++i) {
                matrixIds[i] = "EPSG:{{ map_data.projection }}:" + i;
        }

        mapOptions.url = {{ layer.source|safe }};
        mapOptions.layer = "{{ layer.name }}";
        mapOptions.name = "{{ layer.name }}";
        {% if layer.layer_type == 'OL' %}
        mapOptions.isBaseLayer = false;
        {% endif %}
        mapOptions.matrixIds = matrixIds;
        mapOptions.attribution = '<a target="_blank" href="{{ layer.attr_url}}">{{ layer.attr_title|safe }}</a>'
        layer = new OpenLayers.Layer.WMTS(mapOptions);
        {% endif %}

        {% if layer.protocol == 'WMS' %}
        var urlArray = {{layer.source|safe}};

        layer = new OpenLayers.Layer.WMS( "OpenLayers WMS",
                    urlArray,
                    {layers: "{{ layer.name }}",
                    {% if layer.layer_type == 'OL' %}
                       transparent: true,
                    {% endif %}
                     attribution: '<a target="_blank" href="{{ layer.attr_url}}">{{ layer.attr_title|safe }}</a>'
                    });

        {% endif %}
        gnt.maps.layers.push(layer);
    {% endfor %}

    //make sure mapOptions controls are set correct
    mapOptions.controls = [new OpenLayers.Control.Navigation(),
                           new OpenLayers.Control.Attribution(),
                           new OpenLayers.Control.PanZoomBar()
                           ];
	var ls = false;
	
    {% if layer_data|length > 1 %}
		ls = new OpenLayers.Control.LayerSwitcher();
        mapOptions.controls.push(ls);
		
    {% endif %}
    
    mapOptions['theme'] = null;
    mapOptions['fallThrough'] = true;
    
    //OpenLayers.ProxyHost = "";
    map = new OpenLayers.Map(map_div, mapOptions);
    map.addLayers(gnt.maps.layers);
    map.zoomToMaxExtent();
	
	if(ls)
	ls.maximizeControl();
	

    if(callback_function !== undefined) {
        callback_function(map);
    }
};

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
