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
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 0;
        min-width: 300px;
        max-width: 380px;
        overflow: hidden;
        font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
        font-size: 14px;
        line-height: 1.5;
      }
      .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        position: absolute;
        pointer-events: none;
      }
      .ol-popup:after {
        border-color: rgba(255, 255, 255, 0);
        border-top-color: #fff;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
      }
      .ol-popup:before {
        border-color: rgba(0, 0, 0, 0);
        border-top-color: rgba(0, 0, 0, 0.1);
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
      }
      .ol-popup-closer {
        position: absolute;
        top: 8px;
        right: 12px;
        width: 20px;
        height: 20px;
        color: #666;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ol-popup-closer:after {
        content: "✕";
      }
      .popup-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        padding: 16px 20px;
        margin: 0;
      }
      .popup-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .popup-content {
        padding: 20px;
        background: #fff;
      }
      .result-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      .result-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .result-medal {
        font-size: 16px;
      }
      .result-label {
        font-weight: 600;
        color: #2c3e50;
      }
      .result-party {
        font-weight: 500;
        color: #34495e;
      }
      .info-section {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 2px solid #eee;
      }
      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .info-icon {
        width: 20px;
        text-align: center;
      }
      .ballot-type {
        font-weight: 600;
        color: #e67e22;
      }
      .primary-status {
        font-weight: 600;
      }
      .primary-yes {
        color: #27ae60;
      }
      .primary-no {
        color: #e74c3c;
      }
    </style>
    <title>Mapa sólo CABA – Elecciones 2025</title>
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
        const container = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        const closer = document.getElementById('popup-closer');
        const overlay = new ol.Overlay({
          element: container,
          autoPan: true,
          autoPanAnimation: { duration: 250 }
        });
        map.addOverlay(overlay);
        closer.onclick = () => {
          overlay.setPosition(undefined);
          closer.blur();
          return false;
        };

        // Almacenar el estilo original
        const styleOrig = style_Provincias_0;

        // Sobrescribir el estilo para provincias específicas
        style_Provincias_0 = function(feature, resolution) {
          const p = (feature.get('nprov') || '').toLowerCase();

          // Verificar si la provincia es Buenos Aires (sin CABA) o Corrientes
          if ((p.includes('buenos aires') && !p.includes('ciudad') && !p.includes('autonoma'))
              || p.includes('corrientes')) {
            // Retornar un nuevo estilo con relleno blanco
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

          // Para otras provincias, utilizar el estilo original
          return styleOrig(feature, resolution);
        };

        // Highlight
        const featureOverlay = new ol.layer.Vector({
          source: new ol.source.Vector(),
          map: map,
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#667eea',
              width: 3
            }),
            fill: new ol.style.Fill({
              color: 'rgba(102,126,234,0.1)'
            })
          })
        });

        let highlight;
        map.on('pointermove', function(evt) {
          if (evt.dragging) return;
          const pixel = map.getEventPixel(evt.originalEvent);
          const ft = map.forEachFeatureAtPixel(pixel, f => f);
          const nameLc = ft ? (ft.get('nprov') || '').toLowerCase() : '';
          const excl = ((nameLc.includes('buenos aires') && !nameLc.includes('ciudad') && !nameLc.includes('autonoma')) || nameLc.includes('corrientes'));
          if (ft !== highlight) {
            if (highlight) featureOverlay.getSource().removeFeature(highlight);
            if (ft && !excl) featureOverlay.getSource().addFeature(ft);
            highlight = excl ? null : ft;
          }
        });

        // Funciones
        function isCABA(p) {
          const pLc = p.toLowerCase();
          return pLc.includes('ciudad') && pLc.includes('autonom');
        }

        function getBallotType(p) {
          return isCABA(p) ? 'ELECTRÓNICA' : 'No especificado';
        }

        function getPrimaryStatus() {
          return { status: 'NO', class: 'primary-no' };
        }

        function getElectionSplit() {
          return { status: 'SÍ', class: 'primary-yes' };
        }

        // Click popup
        map.on('singleclick', function(evt) {
          const ft = map.forEachFeatureAtPixel(evt.pixel, f => f);
          if (!ft) {
            overlay.setPosition(undefined);
            return;
          }
          const nombre = ft.get('nprov') || '';
          const nameLc = nombre.toLowerCase();
          if ((nameLc.includes('buenos aires') && !nameLc.includes('ciudad') && !nameLc.includes('autonoma')) || nameLc.includes('corrientes')) {
            overlay.setPosition(undefined);
            return;
          }
          let coal1, v1, coal2, v2, coal3, v3;
          if (isCABA(nombre)) {
            coal1 = 'LLA: OFICIALISMO';
            v1 = '30';
            coal2 = 'AHORA BUENOS AIRES: PERONISMO LOCAL';
            v2 = '27';
            coal3 = 'BUENOS AIRES PRIMERO: CONFIANZA, PARTIDO FEDERAL';
            v3 = '8';
          } else {
            coal1 = ft.get('_coal1');
            v1 = ft.get('_votos1');
            coal2 = ft.get('_coal2');
            v2 = ft.get('_votos2');
            coal3 = ft.get('_coal3');
            v3 = ft.get('_votos3');
          }
          const ballot = getBallotType(nombre);
          const paso = getPrimaryStatus();
          const split = getElectionSplit();
          content.innerHTML = `
            <div class="popup-header"><h3>📍 ${nombre}</h3></div>
            <div class="popup-content">
              <div class="result-item"><div class="result-left"><span class="result-medal">🥇</span><span class="result-label">Primera fuerza:</span></div><span class="result-party">${coal1} (${v1}%)</span></div>
              <div class="result-item"><div class="result-left"><span class="result-medal">🥈</span><span class="result-label">Segunda fuerza:</span></div><span class="result-party">${coal2} (${v2}%)</span></div>
              <div class="result-item"><div class="result-left"><span class="result-medal">🥉</span><span class="result-label">Tercera fuerza:</span></div><span class="result-party">${coal3} (${v3}%)</span></div>
              <div class="info-section">
                <div class="info-item"><span class="info-icon">🗳️</span><span><strong>Tipo de boleta:</strong> <span class="ballot-type">${ballot}</span></span></div>
                <div class="info-item"><span class="info-icon">📊</span><span><strong>PASO:</strong> <span class="primary-status ${paso.class}">${paso.status}</span></span></div>
                <div class="info-item"><span class="info-icon">🗓️</span><span><strong>Desdoblaron elección:</strong> <span class="primary-status ${split.class}">${split.status}</span></span></div>
              </div>
            </div>`;
          overlay.setPosition(evt.coordinate);
        });
      };
    </script>
    <script src="./layers/layers.js"></script>
    <script src="./resources/Autolinker.min.js"></script>
    <script src="./resources/qgis2web.js"></script>
  </body>
</html>
