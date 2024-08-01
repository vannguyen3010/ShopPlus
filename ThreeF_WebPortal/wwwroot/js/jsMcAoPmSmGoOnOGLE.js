var map;
var markers = [];
var marker;
function initialize(formElm, latitude, longtitude, zoom = 6) {
    var _latitude = 14.451386749094162;
    var _longtitude = 108.15273927965637;
    if (latitude != '')
        _latitude = latitude;
    if (longtitude != '')
        _longtitude = longtitude;

    var myLatlng = { lat: _latitude, lng: _longtitude };

    var location = new google.maps.LatLng(_latitude, _longtitude);//10.8873623, 107.019325
    var mapProp = {
        center: location, //new google.maps.LatLng(10.765974, 106.689422),
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("box-inner-map"), mapProp);
    //// Biến text chứa nội dung sẽ được hiển thị
    //var text = "";
    //var infowindow = new google.maps.InfoWindow(
    //    {
    //        content: text,
    //        size: new google.maps.Size(100, 50),
    //        position: location
    //    });
    //infowindow.open(map);
    //-------------------------------------------------------------
    var styles = [
        { featureType: 'road.arterial', elementType: 'all', stylers: [{ hue: '#fff' }, { saturation: 100 }, { lightness: -48 }, { visibility: 'on' }] },
        { featureType: 'road', elementType: 'all', stylers: [] },
        { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#adc9b8' }] },
        { featureType: 'landscape.natural', elementType: 'all', stylers: [{ hue: '#809f80' }, { lightness: -35 }] }];

    var styledMapType = new google.maps.StyledMapType(styles);
    map.mapTypes.set('Styled', styledMapType);

    // Create the initial InfoWindow.
    var infoWindow = new google.maps.InfoWindow({ content: 'Có thể nhấn chọn địa điểm trên bản đồ!', position: myLatlng }); infoWindow.open(map);

    if (latitude != '' && longtitude != '')
        setDefaultLocation(myLatlng, infoWindow);

    // Configure the click listener.
    map.addListener('click', function (e) {
        showinfoWindow(infoWindow);
        addMarker(e.latLng);
        placeMarkerAndPanTo(e.latLng, map);
        getMapLocation(e.latLng, formElm);
    });
}

function setDefaultLocation(location, infoWindow) {
    showinfoWindow(infoWindow);
    addMarker(location);
    placeMarkerAndPanTo(location, map);
}
//Show inforWindow
function showinfoWindow(infoWindow) {
    // Close the current InfoWindow.
    infoWindow.close();
    //// Create a new InfoWindow.
    //infoWindow = new google.maps.InfoWindow({ position: e.latLng });
    //infoWindow.setContent(e.latLng.toString());
    //infoWindow.open(map);
}
//Show toggle bounce when mouse move on marker
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
    if (marker != null)
        marker.setMap(null);
    //// Đường dẫn đến hình icon        
    ////var image = 'http://www.burlington.org/_assets_/images/info-1.png';
    //marker = new google.maps.Marker({
    //    //map: map, draggable: true, animation: google.maps.Animation.DROP, position: location, title: '' //content:'fsdfdsfdsdgd', icon: image
    //    draggable: true, animation: google.maps.Animation.DROP, position: location, title: ''
    //});
    deleteMarkers();
    marker = new google.maps.Marker({ map: map, draggable: true, animation: google.maps.Animation.DROP, position: location, title: '' });
    markers.push(marker);
    google.maps.event.addListener(marker, 'mouseover', toggleBounce);

    google.maps.event.addListener(marker, 'dragend', function () {
        //console.log(marker.getPosition().lat()); //console.log(marker.getPosition().lng());
        placeMarkerAndPanTo(marker.getPosition(), map)
        getMapLocation(marker.getPosition(), '#form_data_add_address');
    });
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    if (markers.length > 10) {
        clearMarkers();
        markers = [];
    }
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}
// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

//Move center map by location of marker
function placeMarkerAndPanTo(latLng, map) {
    //delayed so you can see it move
    setTimeout(function () {
        map.panTo(latLng);
    }, 200);
}

function mappingLocation(formElm, latitude = '', longtitude = '', zoom = 6) {
    google.maps.event.addDomListener(window, 'load', initialize(formElm, latitude, longtitude, zoom));
}

function getMapAddress(formElm, address = '') {
    if (IsNullOrEmty(address)) return false;
    $.ajax({
        type: "GET",
        url: "/Address/getMapAddress",
        data: { address: address },
        dataType: "json",
        success: function (response) {
            if (!CheckResponseIsSuccess(response)) return false;
            let data = response.data;
            if (data == null || data.status !== "OK") {
                mappingLocation(formElm);
                return false;
            }
            var latitude = data.results[0].geometry.location.lat;
            var longtitude = data.results[0].geometry.location.lng;
            $(formElm).find('[name="latitude"]').val(latitude);
            $(formElm).find('[name="longitude"]').val(longtitude);
            mappingLocation(formElm, latitude, longtitude, 17);
        },
        error: function (err) {
            CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
        }
    });
}

function getMapLocation(latLng, formElm) {
    if (IsNullOrEmty(latLng)) return false;
    $(formElm).find('[name="latitude"]').val(latLng.toJSON().lat);
    $(formElm).find('[name="longitude"]').val(latLng.toJSON().lng);
    //$.ajax({
    //    type: "GET",
    //    url: "/Address/getMapLocation",
    //    data: { latLng: `${latLng.toJSON().lat},${latLng.toJSON().lng}` },
    //    dataType: "json",
    //    success: function (response) {
    //        if (!CheckResponseIsSuccess(response)) return false;
    //        if (response.data != null) {
    //            $(formElm).find('[name="latitude"]').val(response.data.latitude);
    //            $(formElm).find('[name="longitude"]').val(response.data.longitude);
    //        }
    //    },
    //    error: function (err) {
    //        CheckResponseIsSuccess({ result: -1, error: { code: err.status } });
    //    }
    //});
}

function listenOnchangeAddress(elm) {
    $(`${elm} [name="provinceId"],[name="districtId"],[name="wardId"],[name="addressText"]`).on('change', function () {
        let provinceId = $(`${elm} [name="provinceId"]`).val();
        let districtId = $(`${elm} [name="districtId"]`).val();
        let wardId = $(`${elm} [name="wardId"]`).val();
        let addressText = $(`${elm} [name="addressText"]`).val();
        let provinceName = provinceId == null || provinceId == 0 ? '' : $(`${elm} [name="provinceId"] option:selected`).text();
        let districtName = districtId == null || districtId == 0 ? '' : $(`${elm} [name="districtId"] option:selected`).text();
        let wardName = wardId == null || wardId == 0 ? '' : $(`${elm} [name="wardId"] option:selected`).text();
        let fullAddress = `${IsNullOrEmty(addressText) ? '' : addressText.trim() + ', '}${IsNullOrEmty(wardName) ? '' : wardName + ', '}${IsNullOrEmty(districtName) ? '' : districtName + ', '}${IsNullOrEmty(provinceName) ? '' : provinceName}`;
        if (provinceId == null || provinceId == 0 || districtId == null || districtId == 0)
            return false;
        getMapAddress(elm, fullAddress);
    });
}

//google.maps.event.addDomListener(window, 'load', initialize('', ''));

