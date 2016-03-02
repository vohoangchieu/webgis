$(function() {
    $('select').select2();
})
document.onready = function() {
//    return;
    var iconshop = new google.maps.MarkerImage("/static/image/website/shop.jpg",
            new google.maps.Size(250, 90),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 0));

    //                    $("#map_container").height($(window).width()-100);
    var map;
    var title = 'Trạm 3G Viettel';
    var location = new google.maps.LatLng(10.7990549, 106.64467100000002);
    var myOptions = {
        zoom: 10,
        center: location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("googleMap"), myOptions);
    var marker = new google.maps.Marker({
        map: map,
        position: location,
        title: title,
        icon: '/img/map-marker-orange.png'
    });
    var infoWindow = new google.maps.InfoWindow({
        content: "Trạm 1 tọa độ (x1,y1)"
//        content: "<img src='/img/bts.jpg'>"
    });
    infoWindow.open(map, marker);
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
    })
    var location1 = new google.maps.LatLng(10.8990549, 106.94467100000002);
     var marker1 = new google.maps.Marker({
        map: map,
        position: location1,
        title: title,
        icon: '/img/map-marker-pink.png'
    });
    var infoWindow1 = new google.maps.InfoWindow({
        content: "Trạm 2 tọa độ (x2,y2)"
//        content: "<img src='/img/bts.jpg'>"
    });
    infoWindow1.open(map, marker1);
     google.maps.event.addListener(marker1, 'click', function() {
        infoWindow1.open(map, marker1);
    })


}



