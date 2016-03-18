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
var isDrawing = false;
var drawingManager = null;
var polyline = null;
var currentIcon = {
    url: contextPath + '/img/cyan.ico?' + staticVersion,
    scaledSize: new google.maps.Size(markerSize, markerSize)
}
function initMap() {
    var location;
    if (x && y) {
        location = new google.maps.LatLng(x, y);
    } else {
        location = new google.maps.LatLng(homeLat, homeLng);
    }

    if (!zoom) {
        zoom = homeZoomLevel;
    }
    var mapOptions = {
        zoom: parseInt(zoom),
        center: location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
}
function initPoly() {
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingMode: google.maps.drawing.OverlayType.POLYLINE,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYLINE,
            ]
        },
        polylineOptions: {
            strokeColor: '#ff80df',
            zIndex: 6
        }
    });
//    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'polylinecomplete', function (event) {
        polyline = event;
        var latLngArray = (event.getPath().getArray());
        var distance = 0; //getDistance(latLngArray[0], latLngArray[1]);
        for (var i = 0; i < latLngArray.length - 1; i++) {
            distance += getDistance(latLngArray[i], latLngArray[i + 1]);
        }
        $("#distanceResult").text(distance.toFixed(5).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ').replace(".", ",").replace(" ", "."));
        $("#distance-div").show();
        drawingManager.setMap(null);
    });
    $("#distance-div .glyphicon-remove").click(function () {
        $("#distance-div").hide();
        polyline.setMap(null);
        if (isDrawing) {
            drawingManager.setMap(map);
        }
    })
}
function distanceClick() {
    if (isDrawing) {
        isDrawing = false;
        drawingManager.setMap(null);
        $("#distance span").removeClass("toolactive");
        $("#distance-panel").hide();
    } else {
        isDrawing = true;
        drawingManager.setMap(map);
        $("#distance span").addClass("toolactive");
    }
}
function displayDistanceInfo() {
    var distance = getDistance(path.getAt(0), path.getAt(1));
    $("#distanceResult").text(distance.toFixed(5).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ').replace(".", ",").replace(" ", "."));
    $("#distance-div").show();
}
function initSize() {
    var contentTop = $("#row-banner").outerHeight() + $("#row-nav").outerHeight() + 8;
    $("#show-left-panel").css({top: contentTop - 3});
    var contentHeight = $(window).height() - $("#row-banner").outerHeight() - $("#row-nav").outerHeight() - 8;
    $("#row-content").height(contentHeight);
    $("#googleMap").height(contentHeight);
    var searchResultPanelHeight = contentHeight - $("#search-panel").height() - $("#note-panel").height();
    $("#search-result-panel").height(searchResultPanelHeight - 40);
    $("#search-result-panel panel-body").height(searchResultPanelHeight - 73);
}
document.onready = function () {
    initSize();
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

        var image;
        if (tramBTS.MaSo == maso) {
            image = contextPath + '/img/orange.ico?' + staticVersion;
        } else {
            if (tramBTS.TrangThai == 1) {
                image = contextPath + '/img/green.ico?' + staticVersion;
            } else if (tramBTS.TrangThai == 2) {
                image = contextPath + '/img/red.ico?' + staticVersion;
            } else {
                continue;
            }
        }
        var icon = {
            url: image,
            scaledSize: new google.maps.Size(markerSize, markerSize)
        };
        tramBTS.icon = icon;
        var marker = new google.maps.Marker({
            position: latLng,
            icon: image,
            title: tramBTS.TenTram});
        if (!useCluster) {
            marker.setMap(map);
        }
        tramBTS.marker = marker;
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
        })(markers[key], contents[key], globalInfoWindow /*infoWindows[key]*/));
    }
    var clusterStyles = getClusterStyles();
    var mcOptions = {
//        gridSize: 50,
//        maxZoom: 15,
        styles: clusterStyles,
    };
    if (useCluster) {
        markerClusterer = new MarkerClusterer(map, markerArray, mcOptions);
    }
//    markerClusterer = new MarkerClusterer(map, markerArray, mcOptions);
}
$(function () {
    $("#timkiem").click(function () {
        var html = "";
        var tentram = replaceUnicode($("#tentram").val()).toLowerCase();
        var kihieutram = $("#kihieutram").val();
        var toadox = $("#toadox").val();
        var toadoy = $("#toadoy").val();
        var count = 0;
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
                count++;
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
        if (count == 0) {
            resetMarkerIcon();
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
    map.setZoom(homeZoomLevel);
}
function showMarker(MaSo) {
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        if (tramBTS.MaSo == MaSo) {
            tramBTS.marker.setIcon(currentIcon);
        } else {
            tramBTS.marker.setIcon(tramBTS.icon);
        }
    }

    if (map.getZoom() < detailZoomLevel) {
        map.setZoom(detailZoomLevel);
        setTimeout(function () {
//            map.setCenter(markers[MaSo].getPosition());
            map.panTo(markers[MaSo].getPosition());
            google.maps.event.trigger(markers[MaSo], 'click');
        }, 1000)
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
//    $("#pan").click(setPan);
    $("#share").click(showLinkShare);
    $("#distance").click(distanceClick);
    $("#show-left-panel").click(showLeftPanel);
    $("#hide-left-panel").click(hideLeftPanel);

});

var rad = function (x) {
    return x * Math.PI / 180;
};

function changeCurrentLink() {
    var latLng = map.getCenter();
    var currentUrl = requestUrl + "?x=" + latLng.lat() + "&y=" + latLng.lng() + "&zoom=" + map.getZoom();
    $("#link").text(currentUrl);
}

function getClusterStyles() {
//    var iconMarker = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png";
    var iconMarker = contextPath + '/img/cluster.png?' + staticVersion;
    ;
    var clusterStyle = {
        height: 32,
        url: iconMarker,
        width: 32
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
function resetMarkerIcon() {
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        tramBTS.marker.setIcon(tramBTS.icon);
    }
}

function hideLeftPanel() {
    $("#left-panel").hide();
    $("#right-panel").attr("class", "col-md-12 col-sm-12 col-lg-12 col-xs-12");
    $("#show-left-panel").show();
    google.maps.event.trigger(map, 'resize');
    map.setZoom(map.getZoom());
}
function showLeftPanel() {
    $("#left-panel").show();
    $("#right-panel").attr("class", "col-md-9 col-sm-9 col-lg-9 col-xs-9");
    $("#show-left-panel").hide();
    google.maps.event.trigger(map, 'resize');
    map.setZoom(map.getZoom());
}


