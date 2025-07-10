var wms_layers = [];

var format_Provincias_0 = new ol.format.GeoJSON();
var features_Provincias_0 = format_Provincias_0.readFeatures(json_Provincias_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Provincias_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Provincias_0.addFeatures(features_Provincias_0);
var lyr_Provincias_0 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Provincias_0, 
                style: style_Provincias_0,
                popuplayertitle: 'Provincias',
                interactive: true,
    title: 'Provincias<br />\
    <img src="styles/legend/Provincias_0_0.png" /> SI<br />\
    <img src="styles/legend/Provincias_0_1.png" /> <br />'
        });

lyr_Provincias_0.setVisible(true);
var layersList = [lyr_Provincias_0];
lyr_Provincias_0.set('fieldAliases', {'nprov': 'nprov', 'KM2': 'KM2', 'Desdoblaro': 'Desdoblaro', 'auxiliary_storage_labeling_positionx': 'auxiliary_storage_labeling_positionx', 'auxiliary_storage_labeling_positiony': 'auxiliary_storage_labeling_positiony', 'auxiliary_storage_labeling_lineanchorpercent': 'auxiliary_storage_labeling_lineanchorpercent', 'auxiliary_storage_labeling_lineanchorclipping': 'auxiliary_storage_labeling_lineanchorclipping', 'auxiliary_storage_labeling_lineanchortype': 'auxiliary_storage_labeling_lineanchortype', 'auxiliary_storage_labeling_lineanchortextpoint': 'auxiliary_storage_labeling_lineanchortextpoint', '_coal1': '_coal1', '_votos1': '_votos1', '_coal2': '_coal2', '_votos2': '_votos2', '_coal3': '_coal3', '_votos3': '_votos3', });
lyr_Provincias_0.set('fieldImages', {'nprov': 'TextEdit', 'KM2': 'TextEdit', 'Desdoblaro': 'TextEdit', 'auxiliary_storage_labeling_positionx': 'Hidden', 'auxiliary_storage_labeling_positiony': 'Hidden', 'auxiliary_storage_labeling_lineanchorpercent': 'TextEdit', 'auxiliary_storage_labeling_lineanchorclipping': 'TextEdit', 'auxiliary_storage_labeling_lineanchortype': 'TextEdit', 'auxiliary_storage_labeling_lineanchortextpoint': 'TextEdit', '_coal1': 'TextEdit', '_votos1': 'Range', '_coal2': 'TextEdit', '_votos2': 'Range', '_coal3': 'TextEdit', '_votos3': 'Range', });
lyr_Provincias_0.set('fieldLabels', {'nprov': 'inline label - always visible', 'KM2': 'no label', 'Desdoblaro': 'no label', 'auxiliary_storage_labeling_lineanchorpercent': 'no label', 'auxiliary_storage_labeling_lineanchorclipping': 'no label', 'auxiliary_storage_labeling_lineanchortype': 'no label', 'auxiliary_storage_labeling_lineanchortextpoint': 'no label', '_coal1': 'inline label - always visible', '_votos1': 'inline label - always visible', '_coal2': 'inline label - always visible', '_votos2': 'inline label - always visible', '_coal3': 'inline label - always visible', '_votos3': 'inline label - always visible', });
lyr_Provincias_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});