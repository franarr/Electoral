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
      html, body, #map { margin: 0; padding: 0; width:100%; height:100%; }
      h1 { text-align: center; font-size: 26px; margin: 20px 0; }
      .subtitulo { text-align: center; font-size: 14px; color: gray; margin-bottom: 15px; }

      /* POPUP */
      .ol-popup {
        position: absolute;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        border: 1px solid rgba(0,0,0,0.1);
        padding: 0;
        min-width: 300px;
        max-width: 380px;
        overflow: hidden;
        font-family: 'Segoe UI','Helvetica Neue',sans-serif;
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
        border-color: rgba(255,255,255,0);
        border-top-color: #fff;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
      }
      .ol-popup:before {
        border-color: rgba(0,0,0,0);
        border-top-color: rgba(0,0,0,0.1);
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
      .ol-popup-closer:after { content: "✕"; }
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
      .popup-content { padding: 20px; background: #fff; }
      .result-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; }
      .result-left { display: flex; align-items: center; gap: 8px; }
      .result-medal { font-size: 16px; }
      .result-label { font-weight: 600; color: #2c3e50; }
      .result-party { font-weight: 500; color: #34495e; }
      .info-section { margin-top: 16px; padding-top: 16px; border-top: 2px solid #eee; }
      .info-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
      .info-icon { width: 20px; text-align: center; }
      .ballot-type { font-weight: 600; color: #e67e22; }
      .primary-status { font-weight: 600; }
      .primary-yes { color: #27ae60; }
      .primary-no { color: #e74c3c; }
    </style>
    <title>Mapa de Coaliciones 2025</title>
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

    <!-- SCRIPTS DE MAPA -->
    <script src="./resources/qgis2web_expressions.js"></script>
    <script src="./resources/functions.js"></script>
    <script src="./resources/ol.js"></script>
    <script src="./resources/ol-layerswitcher.js"></script>
    <script src="layers/Provincias_0.js"></script>
    <script src="styles/Provincias_0_style.js"></script>

    <script>
    window.onload = function() {
      const overlay = new ol.Overlay({ element: document.getElementById('popup'), autoPan: true, autoPanAnimation: { duration: 250 } });
      map.addOverlay(overlay);
      document.getElementById('popup-closer').onclick = () => { overlay.setPosition(undefined); return false; };

      // HOVER & HIGHLIGHT
      const highlightLayer = new ol.layer.Vector({
        source: new ol.source.Vector(), map: map,
        style: new ol.style.Style({ stroke: new ol.style.Stroke({ color: '#667eea', width: 3 }), fill: new ol.style.Fill({ color: 'rgba(102,126,234,0.1)' }) })
      });
      let current;
      map.on('pointermove', evt => {
        if (evt.dragging) return;
        const feat = map.forEachFeatureAtPixel(map.getEventPixel(evt.originalEvent), f => f);
        const nm = feat ? (feat.get('nprov')||'').toLowerCase() : '';
        const excluded = (nm === 'buenos aires' || nm.includes('provincia de buenos aires') || nm.includes('corrientes'));
        if (feat !== current) {
          if (current) highlightLayer.getSource().removeFeature(current);
          if (feat && !excluded) highlightLayer.getSource().addFeature(feat);
          current = excluded ? null : feat;
        }
      });

      // DATOS PARA POPUP
      function isCABA(n) { const l = n.toLowerCase(); return l.includes('ciudad autónoma') || l.includes('caba') || l.includes('capital federal'); }
      function getBallotType(n) { return isCABA(n) ? 'ELECTRÓNICA' : 'No especificado'; }
      function getPrimaryStatus() { return { status: 'NO', class: 'primary-no' }; }
      function getElectionSplit() { return { status: 'SÍ', class: 'primary-yes' }; }

      map.on('singleclick', evt => {
        const feat = map.forEachFeatureAtPixel(evt.pixel, f => f);
        if (!feat) { overlay.setPosition(undefined); return; }
        const name = feat.get('nprov') || '';
        const ln = name.toLowerCase();
        if (ln === 'buenos aires' || ln.includes('provincia de buenos aires') || ln.includes('corrientes')) { overlay.setPosition(undefined); return; }

        let c1, v1, c2, v2, c3, v3;
        if (isCABA(name)) {
          c1 = 'LLA: OFICIALISMO'; v1 = '30';
          c2 = 'AHORA BUENOS AIRES: PERONISMO LOCAL'; v2 = '27';
          c3 = 'BUENOS AIRES PRIMERO: CONFIANZA, PARTIDO FEDERAL'; v3 = '8';
        } else {
          c1 = feat.get('_coal1'); v1 = feat.get('_votos1');
          c2 = feat.get('_coal2'); v2 = feat.get('_votos2');
          c3 = feat.get('_coal3'); v3 = feat.get('_votos3');
        }
        const ballot = getBallotType(name);
        const paso = getPrimaryStatus();
        const split = getElectionSplit();

        document.getElementById('popup-content').innerHTML = `
          <div class="popup-header"><h3>📍 ${name}</h3></div>
          <div class="popup-content">
            <div class="result-item"><div class="result-left"><span class="result-medal">🥇</span><span class="result-label">Primera fuerza:</span></div><span class="result-party">${c1} (${v1}%)</span></div>
            <div class="result-item"><div class="result-left"><span class="result-medal">🥈</span><span class="result-label">Segunda fuerza:</span></div><span class="result-party">${c2} (${v2}%)</span></div>
            <div class="result-item"><div class="result-left"><span class="result-medal">🥉</span><span class="result-label">Tercera fuerza:</span></div><span class="result-party">${c3} (${v3}%)</span></div>
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

    <!-- MODIFICAR ESTE ARCHIVO: styles/Provincias_0_style.js -->
    <!--
    function categories_Provincias_0(feature, value, size, resolution, labelText,
                               labelFont, labelFill, bufferColor, bufferWidth,
                               placement) {
      var prov = (feature.get('nprov')||'').toLowerCase();
      if (
         prov === 'buenos aires' ||
         prov.includes('provincia de buenos aires') ||
         prov.includes('corrientes')
      ) {
        return [ new ol.style.Style({
          stroke: new ol.style.Stroke({ color:'rgba(35,35,35,1.0)', width:0.988 }),
          fill:   new ol.style.Fill({ color:'rgba(255,255,255,1.0)' }),
          text: createTextStyle(feature, resolution, labelText, labelFont,
                                labelFill, placement, bufferColor,
                                bufferWidth)
        })];
      }
      var valueStr = (value !== null && value !== undefined) ? value.toString() : 'default';
      switch(valueStr) {
        case 'SI':
          return [ new ol.style.Style({
            stroke: new ol.style.Stroke({ color:'rgba(35,35,35,1.0)', width:0.988 }),
            fill:   new ol.style.Fill({ color:'rgba(0,31,255,1.0)' }),
            text: createTextStyle(feature, resolution, labelText, labelFont,
                                  labelFill, placement, bufferColor,
                                  bufferWidth)
          })];
        default:
          return [ new ol.style.Style({
            stroke: new ol.style.Stroke({ color:'rgba(35,35,35,1.0)', width:0.988 }),
            fill:   new ol.style.Fill({ color:'rgba(255,255,255,1.0)' }),
            text: createTextStyle(feature, resolution, labelText, labelFont,
                                  labelFill, placement, bufferColor,
                                  bufferWidth)
          })];
      }
    }
    -->

    <script src="./layers/layers.js"></script>
    <script src="./resources/Autolinker.min.js"></script>
    <script src="./resources/qgis2web.js"></script>
  </body>
</html>
