var KEYCODE = {left: 37, up: 38, right: 39, down: 40, enter: 13, backspace: 8, pause: 19};
var markersMap = {};
var markerArray = [];
var infoWindows = {};
var contentMap = {};
var globalInfoWindow = null;
var map, poly;
var markerClusterer;
var path = new google.maps.MVCArray;
var pathMarkerArray = [];
var isDrawingCalcDistance = false;
var isEditing = false;
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
        zoom = 15;
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


function initSize() {
    var contentTop = $("#row-banner").outerHeight() + $("#row-nav").outerHeight() + 8;
    $("#show-left-panel").css({top: contentTop - 3});
    var contentHeight = $(window).height() - $("#row-banner").outerHeight() - $("#row-nav").outerHeight() - 8;
    $("#row-content").height(contentHeight);
    $("#googleMap").height(contentHeight);

}
document.onready = function () {
    initSize();
    initMap();
    map.addListener('center_changed', changeCurrentLink);
    map.addListener('zoom_changed', changeCurrentLink);
    changeCurrentLink();
    initMarkerClusterer();

}
function initMarkerClusterer() {
    clearAllMarker();
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
        marker.tramBTS = tramBTS;
        tramBTS.marker = marker;
        markersMap[key] = (marker);
        markerArray.push(marker);


        var content = "<div class=\"bts-infowindow\" style=\"width:480px;max-height:300px;\"><table class=\"table table-bordered\" > " +
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
                "      <tr> <th>Đơn vị thuê</th> <td>" + tramBTS.DonViThue + "</td></tr>  " +
                "      <tr> <th>Đơn vị lắp đặt</th> <td>" + tramBTS.TenDVQL + "</td></tr>  " +
                "  </tbody>  " +
                "</table></div>";
        contentMap[key] = content;

        google.maps.event.addListener(markersMap[key], 'click', (function (marker, content, infowindow) {
            return function () {
                if (globalInfoWindow) {
                    globalInfoWindow.close();
                }
                if (isEditing) {
                    showPopupUpdateBTS(marker.tramBTS);
                    return;
                }
                setTimeout(function () {
                    globalInfoWindow = new google.maps.InfoWindow({
                        content: content
                    });
                    marker.setMap(map);
                    globalInfoWindow.open(map, marker);
                }, 0)
                if (isDrawingCalcDistance) {
                    addMarker(marker.getPosition());
                }
            };
        })(markersMap[key], contentMap[key], globalInfoWindow));
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
}


function zoomIn() {
    disableDrawing();
    map.setOptions({draggableCursor: null});
    var zoom = map.getZoom();
    if (zoom < 21) {
        map.setZoom(zoom + 1);
    }
}
function zoomOut() {
    disableDrawing();

    map.setOptions({draggableCursor: null});
    var zoom = map.getZoom();
    if (zoom > 0) {
        map.setZoom(zoom - 1);
    }
}
function goHome() {
    disableDrawing();
    map.setOptions({draggableCursor: null});
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
            show(MaSo);
        }, 1000)
    } else {
        show(MaSo);
//        map.panTo(markersMap[MaSo].getPosition());
//        google.maps.event.trigger(markersMap[MaSo], 'click');
    }
    function show(MaSo) {
        map.panTo(markersMap[MaSo].getPosition());
        if (globalInfoWindow) {
            globalInfoWindow.close();
        }
        globalInfoWindow = new google.maps.InfoWindow({
            content: contentMap[MaSo]
        });
        markersMap[MaSo].setMap(map);
        globalInfoWindow.open(map, markersMap[MaSo]);
//            google.maps.event.trigger(markersMap[MaSo], 'click');
    }
}
function setPan() {
    disableDrawing();
    map.setOptions({draggableCursor: null});
}
function showLinkShare() {
    disableDrawing();
    map.setOptions({draggableCursor: null});
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
    $("#show-left-panel").click(showLeftPanel);
    $("#hide-left-panel").click(hideLeftPanel);

});
var rad = function (x) {
    return x * Math.PI / 180;
};
function changeCurrentLink() {
    var latLng = map.getCenter();
    var currentUrl = requestUrl + "?x=" + latLng.lat() + "&y=" + latLng.lng();//+ "&zoom=" + map.getZoom();
    $("#link").text(currentUrl);
}
function getClusterStyles() {
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

function clearAllMarker() {
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        if (tramBTS.marker) {
            tramBTS.marker.setMap(null);
        }
    }
    markersMap = {};
    markerArray = [];
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

function handleFilterBTSType() {
    $(".btsType").click(function () {
        var isCheck = $(this).is(":checked");
        var type = $(this).attr("data-type");
        for (var i = 0; i < tramBTSList.length; i++) {
            var tramBTS = tramBTSList[i];
            if (tramBTS.TrangThai != type) {
                continue;
            }
            if (isCheck) {
                tramBTS.marker.setMap(map);
            } else {
                tramBTS.marker.setMap(null);
            }
        }
    })

}
function disableDrawing() {
    disableDrawingCalcDistance();
    disableZoomInSelect();
    disableZoomOutSelect();
    disableEdit();
}
$(function () {
    handleFilterBTSType();
})
