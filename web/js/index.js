var markers = {};
var markerArray = [];
var infoWindows = {};
var contents = {};
var globalInfoWindow = null;
var map;
$(function () {
    $('select').select2();
})
document.onready = function () {

    var location = new google.maps.LatLng(10.375941, 105.41854);
    var myOptions = {
        zoom: 9,
        center: location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("googleMap"), myOptions);

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

    var mcOptions = {gridSize: 50,
        maxZoom: 15,
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
                globalInfoWindow = new google.maps.InfoWindow({
                    content: content
                });
                globalInfoWindow.open(map, marker);
//                infowindow.setContent(content);
//                infowindow.open(map, marker);
            };
        })(markers[key], contents[key], infoWindows[key]));
    }
    var mc = new MarkerClusterer(map, markerArray, mcOptions);

}




