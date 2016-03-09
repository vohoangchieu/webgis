var markers = {};
var markerArray = [];
var infoWindows = {};
var contents = {};
var tramBTSMap = {};
var globalInfoWindow = null;
var map;
document.onready = function () {

    var location = new google.maps.LatLng(homeLat, homeLng);
    var myOptions = {
        zoom: defaultZoomLevel,
        center: location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("googleMap"), myOptions);

    google.maps.event.addListener(map, 'click', function(event) {

       console.log(event.latLng);

    });

    var clusterStyles = [
        {
            height: 53,
            url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png",
            width: 53
        },
        {
            height: 53,
            url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png",
            width: 53
        },
        {
            height: 53,
            url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png",
            width: 53
        },
        {
            height: 53,
            url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png",
            width: 53
        },
        {
            height: 53,
            url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png",
            width: 53
        },
    ];
    var mcOptions = {
//        gridSize: 50,
//        maxZoom: 15,
        styles: clusterStyles,
    };
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        var key = tramBTS.MaSo;
//        console.log(key)
        var latLng = new google.maps.LatLng(tramBTS.ToaDoVD,
                tramBTS.ToaDoKD);
        var icon;
        if (tramBTS.TrangThai == 1) {
            icon = contextPath + '/img/green.ico';
        } else if (tramBTS.TrangThai == 2) {
            icon = contextPath + '/img/red.ico';
        } else {
            continue;
        }
        var image = {
            url: icon,
            scaledSize: new google.maps.Size(28, 28)
        };
        var marker = new google.maps.Marker({
            position: latLng,
//            icon: icon, 
            icon: image,
            title: tramBTS.TenTram});
        markers[key] = (marker);
        markerArray.push(marker);
//        markers[i]=marker;


        var content = "<div style=\"width:350px;overflow:scroll\"><table class=\"table table-bordered\" > " +
                " <thead>  " +
                "    <tr> <th colspan=\"2\">Thông tin trạm</th></tr> " +
                " </thead>  " +
                "  <tbody>  " +
                "      <tr> <td>Tên trạm</td> <td>" + tramBTS.TenTram + "</td></tr>  " +
                "      <tr> <td>Ngày lắp đăt</td> <td>" + tramBTS.NgayLapDat + "</td></tr>  " +
                "      <tr> <td>Điạ chỉ lắp đặt</td> <td>" + tramBTS.DiaChiLapDat + "</td></tr>  " +
                "      <tr> <td>Tỉnh thành lắp đặt</td> <td>" + tinhThanhMap[tramBTS.TinhThanhLD].Ten + "</td></tr>  " +
                "      <tr> <td>Quận huyện lắp đặt</td> <td>" + quanHuyenMap[tramBTS.QuanHuyenLD].Ten + "</td></tr>  " +
                "      <tr> <td>Phường xã lắp đặt</td> <td>" + phuongXaMap[tramBTS.PhuongXaLD].Ten + "</td></tr>  " +
                "      <tr> <td>Toạ độ X</td> <td>" + tramBTS.ToaDoVD + "</td></tr>  " +
                "      <tr> <td>Toạ độ Y</td> <td>" + tramBTS.ToaDoKD + "</td></tr>  " +
                "      <tr> <td>Trạng thái</td> <td>" + tinhtrangMap[tramBTS.TrangThai] + "</td></tr>  " +
                "      <tr> <td>Chiều cao</td> <td>" + tramBTS.ChieuCao + "</td></tr>  " +
                "      <tr> <td>Ghi chú</td> <td>" + tramBTS.GhiChu + "</td></tr>  " +
                "      <tr> <td>Link</td> <td><a href='" + contextPath + "/?maso=" + tramBTS.MaSo + "'>" + tramBTS.TenTram + "</a></td></tr>  " +
                "  </tbody>  " +
                "</table></div>";
        contents[key] = content;
        var infoWindow = new google.maps.InfoWindow({
            content: contents[key]
        });
        infoWindows[key] = (infoWindow);
//        google.maps.event.addListener(markers[key], 'click', function () {
//            infoWindows[key].open(map, markers[key]);
//        })
    }
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        var key = tramBTS.MaSo;
        google.maps.event.addListener(markers[key], 'click', (function (marker, content, infowindow) {
            return function () {
                if (globalInfoWindow) {
                    globalInfoWindow.close();
                }
                setTimeout(function () {
                    globalInfoWindow = new google.maps.InfoWindow({
                        content: content
                    });
                    globalInfoWindow.open(map, marker);
                }, 400)
//                globalInfoWindow = new google.maps.InfoWindow({
//                    content: content
//                });
//                globalInfoWindow.open(map, marker);
//                infowindow.setContent(content);
//                infowindow.open(map, marker);
            };
        })(markers[key], contents[key], infoWindows[key]));
    }
    var mc = new MarkerClusterer(map, markerArray, mcOptions);
    if (maso) {
        showMarker(maso);
    }
}
$(function () {
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        tramBTS.TenTram1 = replaceUnicode(tramBTS.TenTram).toLowerCase();
    }
    $("#timkiem").click(function () {
        var html = "";
        var tentram = replaceUnicode($("#tentram").val()).toLowerCase();
        var kihieutram = $("#kihieutram").val();
        var toadox = $("#toadox").val();
        var toadoy = $("#toadoy").val();
        for (var i = 0; i < tramBTSList.length; i++) {
            var tramBTS = tramBTSList[i];
            if (
                    (kihieutram == tramBTS.MaSo) ||
                    (tentram && tramBTS.TenTram1.indexOf(tentram) > -1)
                    ) {
                html += "<tr onclick='showMarker(" + tramBTS.MaSo + ")'> \n\
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
            //<tr> <td>#</td><td>Tên trạm</td><td>Ngày lắp đăt</td><td>Điạ chỉ lắp đặt</td><td>Tỉnh thành lắp đặt</td><td>Quận huyện lắp đặt</td><td>Phường xã lắp đặt</td><td>Toạ độ X</td><td>Toạ độ Y</td><td>Trạng thái</td><td>Chiều cao</td><td>Ghi chú</td> </tr>
        }
        $("#search-result-panel tbody").html(html);
    })
})
function replaceUnicode(input) {
    var signedChars = "àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ";
    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    var pattern = new RegExp("[" + signedChars + "]", "g");
    var output = input.replace(pattern, function (m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
    return output;
}

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
//            map.setCenter(markers[MaSo].getPosition());
            map.panTo(markers[MaSo].getPosition());
            google.maps.event.trigger(markers[MaSo], 'click');
        }, 250)
    } else {
//        map.setCenter(markers[MaSo].getPosition());
        map.panTo(markers[MaSo].getPosition());
        google.maps.event.trigger(markers[MaSo], 'click');
    }



}
$(function () {
    $("#zoom-in").click(zoomIn);
    $("#zoom-out").click(zoomOut);
    $("#home").click(goHome);
});

