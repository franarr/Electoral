<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width">
    <link rel="stylesheet" href="./resources/ol.css">
    <link rel="stylesheet" href="./resources/ol-layerswitcher.css">
    <link rel="stylesheet" href="./resources/qgis2web.css">
    <style>
      html, body, #map {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
      h1 {
        text-align: center;
        font-size: 26px;
        margin: 20px 0;
      }
      .subtitulo {
        text-align: center;
        font-size: 14px;
        color: gray;
        margin-bottom: 15px;
      }
      .ol-popup {
        position: absolute;
        background-color: white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        min-width: 280px;
      }
      .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }
      .ol-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
      }
      .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
      }
      .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        top: 2px;
        right: 8px;
      }
      .ol-popup-closer:after {
        content: "✕";
      }
    </style>
    <title>Mapa de Coaliciones Provinciales - Elecciones 2025</title>
  </head>
  <body>
    <h1>🗳️ Mapa de Coaliciones Provinciales - Elecciones 2025</h1>
    <p class="subtitulo">Resultados por provincia – Distribución de votos y principales alianzas</p>
    <div id="map">
      <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>
    </div>
    <script src="./resources/qgis2web_expressions.js"></script>
    <script src="./resources/functions.js"></script>
    <script src="./resources/ol.js"></script>
    <script src="./resources/ol-layerswitcher.js"></script>
    <script src="layers/Provincias_0.js"></script>
    <script src="styles/Provincias_0_style.js"></script>
    <script>
      window.onload = function() {
        // Inicialización del mapa
        var map = new ol.Map({
          target: 'map',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat([-65.21, -34.57]), // Coordenadas aproximadas de Argentina
            zoom: 5
          })
        });

        // Configuración del popup
        var container = document.getElementById('popup');
        var content = document.getElementById('popup-content');
        var closer = document.getElementById('popup-closer');

        var overlay = new ol.Overlay({
          element: container,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        });
        map.addOverlay(overlay);

        closer.onclick = function() {
          overlay.setPosition(undefined);
          closer.blur();
          return false;
        };

        // Estilo para las provincias de Buenos Aires y Corrientes
        var styleOrig = window.style_Provincias_0;
        window.style_Provincias_0 = function(feature, resolution) {
          var p = (feature.get('nprov') || '').toLowerCase();
          if ((p.includes('buenos aires') && !p.includes('ciudad') && !p.includes('autonoma')) || p.includes('corrientes')) {
            return new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 1)'
              }),
              stroke: new ol.style.Stroke({
                color: '#999',
                width: 1
              })
            });
          }
          return styleOrig(feature, resolution);
        };

        // Capa de provincias
        var layerProvincias = new ol.layer.Vector({
          source: new ol.source.Vector({
            url: 'path_to_your_geojson_file.geojson', // Asegúrate de tener la ruta correcta
            format: new ol.format.GeoJSON()
          }),
          style: window.style_Provincias_0
        });
        map.addLayer(layerProvincias);

        // Manejo de clics en el mapa para mostrar información
        map.on('singleclick', function(evt) {
          var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
          });
          if (feature) {
            var coordinates = evt.coordinate;
            overlay.setPosition(coordinates);
            content.innerHTML = '<p>Provincia: ' + feature.get('nprov') + '</p>';
          } else {
            overlay.setPosition(undefined);
          }
        });
      };
    </script>
    <script src="./layers/layers.js"></script>
    <script src="./resources/Autolinker.min.js"></script>
    <script src="./resources/qgis2web.js"></script>
  </body>
</html>
