<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>TimeSlider widget | Sample | ArcGIS API for JavaScript 4.23</title>
    <link
      rel="stylesheet"
      href="https://js.arcgis.com/4.23/esri/themes/light/main.css"
    />
    <script src="https://js.arcgis.com/4.23/"></script>

    <style>
      html,
      body,
      #viewDiv {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
      }

      #timeSlider {
        position: absolute;
        left: 5%;
        right: 5%;
        bottom: 20px;
      }

      #titleDiv {
        padding: 10px;
        font-weight: 36;
        text-align: center;
      }
    </style>
    <script>
      require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/TimeSlider",
        "esri/widgets/Expand",
        "esri/widgets/Legend"
      ], (Map, MapView, FeatureLayer, TimeSlider, Expand, Legend) => {
        const layer = new FeatureLayer({
          url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/ADS_Damage_Points_Prop_Point/FeatureServer"
        });

        const map = new Map({
          basemap: "hybrid",
          layers: [layer]
        });

        const view = new MapView({
          map: map,
          container: "viewDiv",
          zoom: 4,
          center: [-100, 30]
        });

        // time slider widget initialization
        const timeSlider = new TimeSlider({
          container: "timeSlider",
          view: view,
          timeVisible: true, // show the time stamps on the timeslider
          loop: true
        });

        // add the UI for a title
        view.ui.add("titleDiv", "top-right");

        view.whenLayerView(layer).then((lv) => {
          // around up the full time extent to full hour
          timeSlider.fullTimeExtent =
            layer.timeInfo.fullTimeExtent.expandTo("months");
          timeSlider.stops = {
            interval: layer.timeInfo.interval
          };
        });

        const legend = new Legend({
          view: view
        });
        const legendExpand = new Expand({
          expandIconClass: "esri-icon-legend",
          expandTooltip: "Legend",
          view: view,
          content: legend,
          expanded: false
        });
        view.ui.add(legendExpand, "top-left");
      });
    </script>
  </head>

  <body>
    <div id="viewDiv"></div>
    <div id="timeSlider"></div>
    <div id="titleDiv" class="esri-widget">
      <div id="titleText">Precipitation forecast for next 72 hours</div>
    </div>
  </body>
</html>
