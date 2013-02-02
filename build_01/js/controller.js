

      var directionsDisplay;
      var directionsService = new google.maps.DirectionsService();
      var map;

      var rendererOptions = {
        draggable: true
      };
      var dayTable = {
        "MO":[],
        "TU":[],
        "WE":[],
        "TH":[],
        "FR":[]
      };

      var translationTable = {
        "LEWIS":"37.87274,-122.25481",
        "LIKASHING":"Mulford Hall, Berkeley, CA",
        "VALLEYLSB":"Valley Life Sciences Building, Harmon Way, Berkeley, CA",
        "WHEELER":"37.87090,-122.25893",
        "SODA":"37.87531,-122.25868",
        "LECONTE":"37.87275,-122.25777",
        "EVANS":"Department of Mathematics: Evans Hall, Berkeley, CA"
      };

      function initialize() {
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        var ucb_center = new google.maps.LatLng(37.87213,-122.25923);
        var mapOptions = {
          zoom:16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: ucb_center
        }
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        directionsDisplay.setMap(map);

        google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
          computeTotalDistance(directionsDisplay.directions);
        });
        calcRoute('MO');
      }

      // function calcRouteForDay(day) {
      //   alert(day[0]);
      //   var loc1 = translationTable[day[0][2]];
      //   var loc2 = translationTable[day[1][2]];
      //   alert(loc1 + " ; "+loc2);
      //   var start = "Berkeley, CA";
      //   var end = "San Francisco, CA";

      //   var request = {
      //       origin: start,
      //       destination: end,
      //       waypoints: waypts,
      //       optimizeWaypoints: false,
      //       travelMode: google.maps.TravelMode.WALKING
      //   };

      //   directionsService.route(request, function(response, status) {
      //     if (status == google.maps.DirectionsStatus.OK) {
      //       directionsDisplay.setDirections(response);
      //       var route = response.routes[0];
      //       var summaryPanel = document.getElementById("directions_panel");
      //       summaryPanel.innerHTML = "";
      //       // For each route, display summary information.
      //       for (var i = 0; i < route.legs.length; i++) {
      //         var routeSegment = i+1;
      //         summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
      //         summaryPanel.innerHTML += route.legs[i].start_address + " to ";
      //         summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
      //         summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
      //       }

      //     }
      //   });
      // }
      function calcRoute(dayVar) {
        var waypts = [];
        for (key in dayTable[dayVar]){
          var val = translationTable[dayTable[dayVar][key][2]];
          waypts.push({location:val});

        }
        /* START AND ENDPOINTS ARE HARDCODE TO DWINELLE */
        var start = "37.87054,-122.26035";
        var end = "37.87054,-122.26035";       
        // var checkboxArray = document.getElementById("waypoints");
        // for (var i = 0; i < checkboxArray.length; i++) {
        //   if (checkboxArray.options[i].selected == true) {
        //     waypts.push({
        //         location:checkboxArray[i].value,
              
        //     });
        //   }
        // }
        
        var request = {
            origin: start,
            destination: end,
            waypoints: waypts,
            optimizeWaypoints: false,
            travelMode: google.maps.TravelMode.WALKING
        };

          directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById("directions_panel");
            summaryPanel.innerHTML = "";
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
              var routeSegment = i+1;
              summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
              summaryPanel.innerHTML += route.legs[i].start_address + " to ";
              summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
              summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
            }

          }
        });
      }





      function computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = total / 1000.
        document.getElementById("total").innerHTML = "Total: " + total + " km";
      }

      function printDict(d){
        var str = "";
        for(key in d){
          str += key+":";
          for(cls in d[key]){

            str += "("+d[key][cls]+"),";

          }
          str+="\n";
        }
        return str;
      }

      function splitByDays(sched){
        //sched is the dictionary we get from the parser that represents all of the classes

        for (key in sched){
          if(sched[key][3].indexOf("MO")!=-1){
            dayTable["MO"].push(sched[key]);
            dayTable["MO"].sort();
          }

          if(sched[key][3].indexOf("TU")!=-1){
            dayTable["TU"].push(sched[key]);
            dayTable["TU"].sort();
          }

          if(sched[key][3].indexOf("WE")!=-1){
            dayTable["WE"].push(sched[key]);
            dayTable["WE"].sort();
          }

          if(sched[key][3].indexOf("TH")!=-1){
            dayTable["TH"].push(sched[key]);
            dayTable["TH"].sort();
          }

          if(sched[key][3].indexOf("MO")!=-1){
            dayTable["FR"].push(sched[key]);
            dayTable["FR"].sort();
          }
        }
      }
