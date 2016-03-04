$(function () {
    $('select').select2();
})
document.onready = function () {
//    return;
//    $("#googleMap").height($("#left-panel").height());
    var iconshop = new google.maps.MarkerImage("/static/image/website/shop.jpg",
            new google.maps.Size(250, 90),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 0));

    //                    $("#map_container").height($(window).width()-100);
    var map;
    var title = 'Trạm 3G Viettel';
    var location = new google.maps.LatLng(10.375941, 105.41854);
    var myOptions = {
        zoom: 9,
        center: location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("googleMap"), myOptions);
    var marker = new google.maps.Marker({
        map: map,
        position: location,
        title: title,
        icon: contextPath + '/img/green.ico'
    });
    var content = "<div style=\"width:350px;overflow-x:scroll\"><table class=\"table table-bordered\" > " +
            " <thead>  " +
            "    <tr> <th>#</th> <th>TenTram</th><th>NgayLapDat</th><th>DiaChiLapDat</th><th>TinhThanhLD</th><th>x</th> <th>y</th> </tr> " +
            " </thead>  " +
            "  <tbody>  " +
            "      <tr> <th scope=\"row\">1</th> <td>Mark</td> <td>Ngay Lap Dat 1</td><td>Dia Chi Lap Dat 1</td><td>Tinh Thanh LD 1</td><td>x1</td> <td>y1</td> </tr>  " +
            "  </tbody>  " +
            "</table></div>";
    var infoWindow = new google.maps.InfoWindow({
//        content: "Trạm 1 tọa độ (x1,y1)"
        content: content
    });
    infoWindow.open(map, marker);
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
    })
    var location1 = new google.maps.LatLng(10.664509, 105.09262);
    var marker1 = new google.maps.Marker({
        map: map,
        position: location1,
        title: title,
        icon: contextPath + '/img/map-marker-pink.png'
    });
    var infoWindow1 = new google.maps.InfoWindow({
        content: "Trạm 2 tọa độ (x2,y2)"
//        content: "<img src='/img/bts.jpg'>"
    });
//    infoWindow1.open(map, marker1);
    google.maps.event.addListener(marker1, 'click', function () {
        infoWindow1.open(map, marker1);
    })


}



