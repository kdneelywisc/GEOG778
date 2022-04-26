require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/TimeSlider",
    "esri/widgets/Legend",
    "esri/widgets/Expand"
    ], (Map, MapView, FeatureLayer, TimeSlider,Legend, Expand) => {
        let floodLayerView;
        const layer = new FeatureLayer({
          url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/ADS_Damage_Points_Prop_Point/FeatureServer"
            
        });
  
    
/*****************************************************************
* Define symbols for each class break.
*****************************************************************/

    const less35 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#fffcd4",
      style: "solid",
      outline: {
        width: 1.5,
        color: [255, 255, 255, 0.5]
      }
    };

    const less50 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#b1cdc2",
      style: "solid",
      outline: {
          width: 1.5,
            color: [255, 255, 255, 0.5]
          }
    };

    const more50 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#38627a",
      style: "solid",
      outline: {
        width: 1.5,
        color: [255, 255, 255, 0.5]
      }
    };
    const more75 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#0d2644",
      style: "solid",
      outline: {
        width: 1.5,
        color: [100, 100, 100, 0.5]
      }
    };

/*****************************************************************
 * Set each unique value directly in the renderer's constructor.
 * At least one field must be used (in this case the "COL_DEG" field).
 * The label property of each unique value will be used to indicate
 * the field value and symbol in the legend.
 *****************************************************************/

    const renderer = {
      type: "class-breaks", // autocasts as new ClassBreaksRenderer()
      field: "TOTAL_HOURS",
     /* normalizationField: "EDUCBASECY",*/
      legendOptions: {
        title: "FHP HOURS"
      },
      defaultSymbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "black",
        style: "backward-diagonal",
        outline: {
          width: 0.5,
          color: [50, 50, 50, 0.6]
        }
      },
      defaultLabel: "0 Hours",
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 49,
          symbol: less35,
          label: "< 50 Hours"
        },
        {
          minValue: 50,
          maxValue: 99,
          symbol: less50,
          label: "50 - 100 Hours"
        },
        {
          minValue: 100,
          maxValue: 199,
          symbol: more50,
          label: "100 - 200 Hours"
        },
        {
          minValue: 200,
          maxValue: 500,
          symbol: more75,
          label: "> 200 Hours"
        }
      ]
    };

    const seattleLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/Aerial_Survey_Stats/FeatureServer",
      title: "Aerial Survey Stats",
      renderer: renderer/*,
      popupTemplate: {
        // autocast as esri/PopupTemplate
        title: "Block Group {FID_Block_Group}",
        content:
          "{COL_DEG} adults 25 years old and older in this block group have a college degree. " +
          "{NO_COL_DEG} adults do not have a college degree."
      },
      // show only block groups in Seattle
      definitionExpression: "City = 'Seattle' AND EDUCBASECY > 0",
      opacity: 0.9*/
    });

    const map = new Map({
      basemap: "hybrid",
      layers: [seattleLayer, layer]
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-95.3487846, 35.58907],
      zoom: 4
    });
    
    
    /******************************************************************
 *
 * Demo 5: Filter data to display
 *
 ******************************************************************/


    const seasonsNodes = document.querySelectorAll('.season-item');
    const seasonsElement = document.getElementById("seasons-filter");

    // click event handler for seasons choices
    seasonsElement.addEventListener("click", filterBySeason);

    // User clicked on Winter, Spring, Summer or Fall
    // set an attribute filter on flood warnings layer view
    // to display the warnings issued in that season
    function filterBySeason(event) {
        const selectedSeason = event.target.getAttribute("data-season");
        floodLayerView.filter = {
            where: "YEAR_FORMAT = '" + selectedSeason + "'"
          };
        }

    view.whenLayerView(seattleLayer).then(function (layerView) {
      // Crime data layer is loaded
      // Get a reference to the crime data layerview
      floodLayerView = layerView;

      // Set up the UI items
      seasonsElement.style.visibility = "visible";
      const seasonsExpand = new Expand({
        view: view,
        content: seasonsElement,
        expandIconClass: "esri-icon-filter",
        group: "top-left"
      });

      // Clear the filters when the user closes the expand widget
      seasonsExpand.watch("expanded", function () {
        if (!seasonsExpand.expanded) {
          floodLayerView.filter = null;
        }
      });

      // Add the widget
      view.ui.add(seasonsExpand, "top-left");
    });
    
 /******************************************************************
 *
 * time slider widget initialization
 *
 ******************************************************************/   
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
            layer.timeInfo.fullTimeExtent.expandTo("hours");
          timeSlider.stops = {
            interval: layer.timeInfo.interval
          };
        });    

/******************************************************************
 *
 * Add layers to layerInfos on the legend
 *
 ******************************************************************/

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
        view.ui.add(legendExpand, "top-right");
});
