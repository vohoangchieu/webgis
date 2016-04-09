$(function () {
    $("#timkiem").click(function () {
//        disableDrawingCalcDistance();
        disableDrawing();
        resetMarkerIcon();
        var html = "";
        var tentram = replaceUnicode($("#tentram").val()).toLowerCase();
        var kihieutram = $("#kihieutram").val();
        var toadox = $("#toadox").val();
        var toadoy = $("#toadoy").val();
        var huyen = $("#chonhuyen").val();
        var donvithue = $("#chondonvithue").val();
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
                    (toadoy && toadoy == tramBTS.ToaDoKD) ||
                    (donvithue && tramBTS.DonViThue.indexOf(donvithue) > -1) ||
                    (huyen && (tramBTS.QuanHuyenLD == huyen))
                    ) {
                count++;
                html += "<tr class='search-result-row' data-maso='" + tramBTS.MaSo + "' id='row-" + tramBTS.MaSo + "' onclick='handleSearchResultRowClick(" + tramBTS.MaSo + ")'> \n\
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
                    <td>" + tramBTS.DonViThue + "</td> \n\
                    <td>" + tramBTS.TenDVQL + "</td> \n\
                    </tr>";
            }
        }
        if (count == 0) {
//            resetMarkerIcon();
        }
        $("#search-result-panel tbody").html(html);
    })
    $("#search-panel input").keyup(function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == KEYCODE.enter) {
            $("#timkiem").click();
        }
    })
    $("#link").click(function () {
        selectText("link");
    })

    $("#view-all-result").click(function () {

        $(".search-result-row").each(function () {
            var maso = $(this).attr("data-maso");
            markersMap[maso].setIcon(currentIcon);
        })

    })
})
function handleSearchResultRowClick(MaSo) {
    $("#search-result-panel tbody tr").removeClass("row-active");
    $("#row-" + MaSo).addClass("row-active");
    showMarker(MaSo);
}

function initDistrictSelect() {
    var html = '<option value="">Huyện</option>';
    for (var key in quanHuyenMap) {
        if (quanHuyenMap.hasOwnProperty(key)) {
            var quanHuyen = quanHuyenMap[key];
            html += '<option value="' + quanHuyen.Id + '">' + quanHuyen.Ten + '</option>';
        }
    }
    $('#chonhuyen').html(html);
//    $('#chonhuyen').select2();
}
function initDonViThueSelect() {
    var html = '<option value="_"></option>';
    var tmpMap = {};
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        if (!tmpMap[tramBTS.DonViThue]) {
            html += '<option value="' + tramBTS.DonViThue + '">' + tramBTS.DonViThue + '</option>';
            tmpMap[tramBTS.DonViThue] = '1';
        }

    }

    $('#chondonvithue').html(html);
    $('#chondonvithue').select2()
}
function initDonViThueSearch() {
    var availableDonViThue = [];
    var donviThueMap = {};
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        if (!donviThueMap[tramBTS.DonViThue]) {
            donviThueMap[tramBTS.DonViThue] = '1';
            availableDonViThue.push(tramBTS.DonViThue);
        }
    }
    $("#chondonvithue").autocomplete({
        source: availableDonViThue
    });
}


$(function () {
    initDistrictSelect();
//    initDonViThueSelect();
    initDonViThueSearch();
    $("#tentram").focus(function() { $(this).select(); } );
    
})
