var markers = {};
var markerArray = [];
var infoWindows = {};
var contents = {};
var tramBTSMap = {};
var globalInfoWindow = null;
var map, poly;
var markerClusterer;
var path = new google.maps.MVCArray;
var pathMarkerArray = [];
function initMap() {
    var location;
    if (x && y) {
        location = new google.maps.LatLng(x, y);
    } else {
        location = new google.maps.LatLng(homeLat, homeLng);
    }

    if (!zoom) {
        zoom = defaultZoomLevel;
    }
    var mapOptions = {
        zoom: parseInt(zoom),
        center: location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
}
function initPoly() {
    poly = new google.maps.Polygon({
        strokeWeight: 2,
        fillColor: '#00bfff'
    });

    google.maps.event.addListener(map, 'click', function (event) {
        if ($("#distance span").hasClass("toolactive")) {
            if (path.length < 2) {
                addPoint(event);
            }
        }

    });

}
function addPoint(event) {
    if (path.length == 0) {
        $("#sourcePoint").text(latLngToString(event.latLng));
    } else {
        $("#descPoint").text(latLngToString(event.latLng));
    }
    path.insertAt(path.length, event.latLng);

    var marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        draggable: true,
    });
    pathMarkerArray.push(marker);
    google.maps.event.addListener(marker, 'dragend', function () {
        for (var i = 0; i < pathMarkerArray.length; ++i) {
            if (pathMarkerArray[i] == marker) {
                path.setAt(i, marker.getPosition());
            }
        }
        if (path.length == 1) {
            $("#sourcePoint").text(pathMarkerArray[0].getPosition().toString());
        } else if (path.length == 2) {
            displayDistanceInfo();
        }
    });
    if (path.length > 1) {
        poly.setPaths(new google.maps.MVCArray([path]));
        poly.setMap(map);
        displayDistanceInfo();
    }
}
function displayDistanceInfo() {
    $("#sourcePoint").text(latLngToString(pathMarkerArray[0].getPosition()));
    $("#descPoint").text(latLngToString(pathMarkerArray[1].getPosition()));
    var distance = getDistance(pathMarkerArray[0].getPosition(), pathMarkerArray[1].getPosition());
    $("#distanceResult").text(distance.toFixed(5).replace(/(\d)(?=(\d{3})+\.)/g, '$1 '));
}
document.onready = function () {
    initMap();
    initPoly();

    map.addListener('center_changed', changeCurrentLink);
    map.addListener('zoom_changed', changeCurrentLink);
    changeCurrentLink();
    initMarkerClusterer();
//    if (maso) {
//        showMarker(maso);
//    }
}
function initMarkerClusterer() {
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        var key = tramBTS.MaSo;
        tramBTS.TenTram1 = replaceUnicode(tramBTS.TenTram).toLowerCase();
        var latLng = new google.maps.LatLng(tramBTS.ToaDoVD,
                tramBTS.ToaDoKD);

        var icon;
        if (tramBTS.MaSo == maso) {
            icon = contextPath + '/img/orange.ico?' + staticVersion;
        } else {
            if (tramBTS.TrangThai == 1) {
                icon = contextPath + '/img/green.ico?' + staticVersion;
            } else if (tramBTS.TrangThai == 2) {
                icon = contextPath + '/img/red.ico?' + staticVersion;
            } else {
                continue;
            }
        }
        var image = {
            url: icon,
            scaledSize: new google.maps.Size(28, 28)
        };
        var marker = new google.maps.Marker({
            position: latLng,
            icon: image,
            title: tramBTS.TenTram});
        markers[key] = (marker);
        markerArray.push(marker);
//        markers[i]=marker;


        var content = "<div style=\"width:400px;max-height:300px;overflow:scroll\"><table class=\"table table-bordered\" > " +
                " <thead style='background:#d9edf7'>  " +
                "    <tr> <th colspan=\"2\" style='text-align:center'>Thông tin trạm</th></tr> " +
                " </thead>  " +
                "  <tbody>  " +
                "      <tr> <th>Tên trạm</th> <td>" + tramBTS.TenTram + "</td></tr>  " +
                "      <tr> <th>Ngày lắp đăt</th> <td>" + tramBTS.NgayLapDat + "</td></tr>  " +
                "      <tr> <th>Điạ chỉ lắp đặt</th> <td>" + tramBTS.DiaChiLapDat + "</td></tr>  " +
                "      <tr> <th>Tỉnh thành lắp đặt</th> <td>" + tinhThanhMap[tramBTS.TinhThanhLD].Ten + "</td></tr>  " +
                "      <tr> <th>Quận huyện lắp đặt</th> <td>" + quanHuyenMap[tramBTS.QuanHuyenLD].Ten + "</td></tr>  " +
                "      <tr> <th>Phường xã lắp đặt</th> <td>" + phuongXaMap[tramBTS.PhuongXaLD].Ten + "</td></tr>  " +
                "      <tr> <th>Toạ độ X</th> <td>" + tramBTS.ToaDoVD + "</td></tr>  " +
                "      <tr> <th>Toạ độ Y</th> <td>" + tramBTS.ToaDoKD + "</td></tr>  " +
                "      <tr> <th>Trạng thái</th> <td>" + tinhtrangMap[tramBTS.TrangThai] + "</td></tr>  " +
                "      <tr> <th>Chiều cao</th> <td>" + tramBTS.ChieuCao + "</td></tr>  " +
                "      <tr> <th>Ghi chú</th> <td>" + tramBTS.GhiChu + "</td></tr>  " +
//                "      <tr> <th>Link</th> <td><a href='" + contextPath + "/?maso=" + tramBTS.MaSo + "'>" + tramBTS.TenTram + "</a></td></tr>  " +
                "  </tbody>  " +
                "</table></div>";
        contents[key] = content;
        var infoWindow = new google.maps.InfoWindow({
            content: contents[key]
        });
        infoWindows[key] = (infoWindow);
        google.maps.event.addListener(markers[key], 'click', (function (marker, content, infowindow) {
            return function () {
                if (globalInfoWindow) {
                    globalInfoWindow.close();
                }
                setTimeout(function () {
                    globalInfoWindow = new google.maps.InfoWindow({
                        content: content
                    });
                    marker.setMap(map);
                    globalInfoWindow.open(map, marker);
                }, 0)
            };
        })(markers[key], contents[key],globalInfoWindow /*infoWindows[key]*/));
    }
    var clusterStyles = getClusterStyles();
    var mcOptions = {
//        gridSize: 50,
//        maxZoom: 15,
        styles: clusterStyles,
    };
    markerClusterer = new MarkerClusterer(map, markerArray, mcOptions);
}
$(function () {
    $("#timkiem").click(function () {
        var html = "";
        var tentram = replaceUnicode($("#tentram").val()).toLowerCase();
        var kihieutram = $("#kihieutram").val();
        var toadox = $("#toadox").val();
        var toadoy = $("#toadoy").val();
        for (var i = 0; i < tramBTSList.length; i++) {
            var tramBTS = tramBTSList[i];
            if (tramBTS.ToaDoVD <= 0 || tramBTS.ToaDoKD <= 0) {
                continue;
            }
            if (
                    (kihieutram == tramBTS.MaSo) ||
                    (tentram && tramBTS.TenTram1.indexOf(tentram) > -1) ||
                    (toadox && toadox == tramBTS.ToaDoVD) ||
                    (toadoy && toadoy == tramBTS.ToaDoKD)
                    ) {
                html += "<tr id='row-" + tramBTS.MaSo + "' onclick='handleSearchResultRowClick(" + tramBTS.MaSo + ")'> \n\
                    <td>" + tramBTS.MaSo + "</td>\n\
                    <td>" + tramBTS.TenTram + "</td>\n\
                    <td>" + tramBTS.NgayLapDat + "</td>\n\
                    <td>" + tramBTS.DiaChiLapDat + "</td>\n\
                    <td>" + tinhThanhMap[tramBTS.TinhThanhLD].Ten + "</td>\n\
                    <td>" + quanHuyenMap[tramBTS.QuanHuyenLD].Ten + "</td>\n\
                    <td>" + phuongXaMap[tramBTS.PhuongXaLD].Ten + "</td>\n\
                    <td>" + tramBTS.ToaDoVD + "</td>\n\
                    <td>" + tramBTS.ToaDoKD + "</td>\n\
                    <td>" + tinhtrangMap[tramBTS.TrangThai] + "</td>\n\
                    <td>" + tramBTS.ChieuCao + "</td>\n\
                    <td>" + tramBTS.GhiChu + "</td> \n\
                    </tr>";
            }
        }
        $("#search-result-panel tbody").html(html);
    })
    $("#link").click(function () {
        selectText("link");
    })
})


function zoomIn() {
    var zoom = map.getZoom();
    if (zoom < 21) {
        map.setZoom(zoom + 1);
    }
}
function zoomOut() {
    var zoom = map.getZoom();
    if (zoom > 0) {
        map.setZoom(zoom - 1);
    }
}
function goHome() {
    var location = new google.maps.LatLng(homeLat, homeLng);
    map.setCenter(location);
    map.setZoom(defaultZoomLevel);
}
function showMarker(MaSo) {
    if (map.getZoom() < 11) {
        map.setZoom(11);
        setTimeout(function () {
            map.setCenter(markers[MaSo].getPosition());
//            map.panTo(markers[MaSo].getPosition());
            google.maps.event.trigger(markers[MaSo], 'click');
        }, 250)
    } else {
//        map.setCenter(markers[MaSo].getPosition());
        map.panTo(markers[MaSo].getPosition());
        google.maps.event.trigger(markers[MaSo], 'click');
    }
}
function handleSearchResultRowClick(MaSo) {
    $("#search-result-panel tbody tr").removeClass("row-active");
    $("#row-" + MaSo).addClass("row-active");
    showMarker(MaSo);
}
function setPan() {
    if ($("#pan span").hasClass("toolactive")) {
        $("#pan span").removeClass("toolactive");
        map.setOptions({draggable: false});
    } else {
        $("#pan span").addClass("toolactive");
        map.setOptions({draggable: true});
    }
}
function showLinkShare() {
    if ($("#share span").hasClass("toolactive")) {
        $("#share span").removeClass("toolactive");
        $("#link").hide();
    } else {
        $("#share span").addClass("toolactive");
        $("#link").show();
    }
}
$(function () {
    $("#zoom-in").click(zoomIn);
    $("#zoom-out").click(zoomOut);
    $("#home").click(goHome);
    $("#pan").click(setPan);
    $("#share").click(showLinkShare);
    $("#distance").click(distanceClick);

});

var rad = function (x) {
    return x * Math.PI / 180;
};
function distanceClick() {
    if ($("#distance span").hasClass("toolactive")) {
        $("#distance span").removeClass("toolactive");
        $("#distance-panel").hide();
        for (var i = 0; i < pathMarkerArray.length; ++i) {
            pathMarkerArray[i].setMap(null);
        }
        poly.setMap(null);
    } else {
        $("#distance span").addClass("toolactive");
        $("#distance-panel").show();
        for (var i = 0; i < pathMarkerArray.length; ++i) {
            pathMarkerArray[i].setMap(map);
        }
        poly.setMap(map);
    }
}
function changeCurrentLink() {
    var latLng = map.getCenter();
    var currentUrl = requestUrl + "?x=" + latLng.lat() + "&y=" + latLng.lng() + "&zoom=" + map.getZoom();
    $("#link").text(currentUrl);
}

function getClusterStyles() {
    var iconMarker = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png";
    var clusterStyle = {
        height: 53,
        url: iconMarker,
        width: 53
    }
    var clusterStyles = [
        clusterStyle,
        clusterStyle,
        clusterStyle,
        clusterStyle,
        clusterStyle,
    ];
    return clusterStyles;
}


