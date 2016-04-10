function initDonViQuanLySelect() {
    var availableDonViQuanLy = [];
    var donviQuanLyMap = {};
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        if (!donviQuanLyMap[tramBTS.TenDVQL]) {
            donviQuanLyMap[tramBTS.TenDVQL] = '1';
            availableDonViQuanLy.push(tramBTS.TenDVQL);
        }
    }
    $("#TenDVQL").autocomplete({
//        source: availableDonViQuanLy
        source: function (request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response($.grep(availableDonViQuanLy, function (value) {
                value = value.label || value.value || value;
                return matcher.test(value) || matcher.test(replaceUnicode(value));
            }));
        }
    });
    $("#TenDVQL").focus(function () {
        $(this).select();
    });
}
function initDonViThueSelect() {
    var availableDonViThue = [];
    var donviThueMap = {};
    for (var i = 0; i < tramBTSList.length; i++) {
        var tramBTS = tramBTSList[i];
        if (!donviThueMap[tramBTS.DonViThue]) {
            donviThueMap[tramBTS.DonViThue] = '1';
            availableDonViThue.push(tramBTS.DonViThue);
        }
    }
    $("#DonViThue").autocomplete({
//        source: availableDonViThue
        source: function (request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response($.grep(availableDonViThue, function (value) {
                value = value.label || value.value || value;
                return matcher.test(value) || matcher.test(replaceUnicode(value));
            }));
        }
    });
    $("#DonViThue").focus(function () {
        $(this).select();
    });

}
function initTinhSelect() {
    var html = '<option value="">Chọn tỉnh</option>';
    for (var key in tinhThanhMap) {
        if (tinhThanhMap.hasOwnProperty(key)) {
            var tinhThanh = tinhThanhMap[key];
            html += '<option value="' + tinhThanh.Id + '">' + tinhThanh.Ten + '</option>';
        }
    }
    $('#TinhThanhLD').html(html);
//    $('#TinhThanhLD').select2();

    $('#TinhThanhLD').change(function () {
        var html = '<option value="">Chọn huyện</option>';
        var tinhthanhLD = $('#TinhThanhLD').val();
        for (var key in quanHuyenMap) {
            if (quanHuyenMap.hasOwnProperty(key)) {
                var quanHuyen = quanHuyenMap[key];
                if (quanHuyen.ThuocTinhThanh == tinhthanhLD) {
                    html += '<option value="' + quanHuyen.Id + '">' + quanHuyen.Ten + '</option>';
                }
            }
        }
        $("#QuanHuyenLD").html(html);
    })
    $('#QuanHuyenLD').change(function () {
        var html = '<option value="">Chọn xã</option>';
        var quanhuyenLD = $('#QuanHuyenLD').val();
        for (var key in phuongXaMap) {
            if (phuongXaMap.hasOwnProperty(key)) {
                var phuongxa = phuongXaMap[key];
                if (phuongxa.ThuocQuanHuyen == quanhuyenLD) {
                    html += '<option value="' + phuongxa.Id + '">' + phuongxa.Ten + '</option>';
                }
            }
        }
        $("#PhuongXaLD").html(html);
    })
}
function handleEditButtonClick() {
    if ($("#edit span").hasClass("toolactive")) {
        isEditing = false;
        $("#edit span").removeClass("toolactive");
        map.setOptions({draggableCursor: null});
    } else {
        disableDrawing();
        map.setOptions({draggableCursor: 'crosshair'});
        isEditing = true;
        $("#edit span").addClass("toolactive");
    }
}
$(function () {

    initDonViQuanLySelect();
    initDonViThueSelect();
    initTinhSelect();
    $('#NgayLapDat').datepicker({
        setDate: new Date(),
        autoclose: true,
        format: 'dd/mm/yyyy',
    });
//    var date = new Date();
//    var dateDDMMYYYY = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    $("#NgayLapDat").val(getDDMMYYYY());
    $("#edit").click(handleEditButtonClick);
    setTimeout(function () {
        google.maps.event.addListener(map, 'click', function (event) {
            if (isEditing == false) {
                return;
            }
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({location: event.latLng}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
//                    console.log(results);
                    if (results.length < 2) {
                        return;
                    }
                    $("#DiaChiLapDat").val(results[0].formatted_address);
                    var address = replaceUnicode(results[1].formatted_address);
//                    console.log("address=" + address);
                    $("#TinhThanhLD option").each(function () {
                        var text = replaceUnicode($(this).text());
                        if (address.indexOf(text) > -1) {
                            $("#TinhThanhLD").val($(this).attr("value")).change();
                            setTimeout(function () {
                                $("#QuanHuyenLD option").each(function () {
                                    var text = replaceUnicode($(this).text());
                                    if (address.indexOf(text) > -1) {
                                        $("#QuanHuyenLD").val($(this).attr("value")).change();
                                        setTimeout(function () {
                                            $("#PhuongXaLD option").each(function () {
                                                var text = replaceUnicode($(this).text());
                                                if (address.indexOf(text) > -1) {
                                                    $("#PhuongXaLD").val($(this).attr("value"));
                                                    var subfix = $("#PhuongXaLD option:selected").text() + ", " + $("#QuanHuyenLD option:selected").text();
                                                    var tramBTS = "Trạm BTS " + subfix
                                                    $("#TenTram").val(tramBTS);
                                                    $("#DonViThue").val("DVT " + subfix);
                                                    $("#TenDVQL").val("DVQL " + subfix);
                                                    return;
                                                }
                                            })
                                        }, 250);
                                        return;
                                    }
                                })
                            }, 250);
                        }
                        return;
                    })
                }
            });
            showPopupAddBTS(event.latLng);

        });
    }, 250);


})
function showPopupAddBTS(latLng) {
    $("#ToaDoVD").val(latLng.lat());
    $("#ToaDoKD").val(latLng.lng());
    $("#popup-title").text("Thêm trạm BTS");
    $("#btn-add-bts").show();
    $("#btn-update-bts").hide();
    $("#btn-delete-bts").hide();
    $("#popup-add-bts").show();
    $("#TenTram").focus();
}
function hidePopupAddBTS() {
    $("#popup-add-bts").hide();
}
function showPopupUpdateBTS(tramBTS) {
    $("#MaSo").val(tramBTS.MaSo);
    $("#TenTram").val(tramBTS.TenTram);
    $("#NgayLapDat").val(tramBTS.NgayLapDat);
    $("#TinhThanhLD").val(tramBTS.TinhThanhLD).change();
    $("#QuanHuyenLD").val(tramBTS.QuanHuyenLD).change();
    $("#PhuongXaLD").val(tramBTS.PhuongXaLD);
    $("#DiaChiLapDat").val(tramBTS.DiaChiLapDat);
    $("#TrangThai").val(tramBTS.TrangThai);
    $("#ToaDoKD").val(tramBTS.ToaDoKD);
    $("#ToaDoVD").val(tramBTS.ToaDoVD);
    $("#DonViThue").val(tramBTS.DonViThue);
    $("#TenDVQL").val(tramBTS.TenDVQL);
    $("#popup-title").text("Cập nhật trạm BTS");
    $("#btn-add-bts").hide();
    $("#btn-update-bts").show();
    $("#btn-delete-bts").show();
    $("#popup-add-bts").show();
    $("#TenTram").focus();
}
function  handlePopupSubmitAdd() {
    $.ajax({
        type: "post",
        url: contextPath + '/ajax/add-bts',
        data: {
            TenTram: $("#TenTram").val(),
            NgayLapDat: $("#NgayLapDat").val(),
            TinhThanhLD: $("#TinhThanhLD").val(),
            QuanHuyenLD: $("#QuanHuyenLD").val(),
            PhuongXaLD: $("#PhuongXaLD").val(),
            DiaChiLapDat: $("#DiaChiLapDat").val(),
            TrangThai: $("#TrangThai").val(),
            ToaDoKD: $("#ToaDoKD").val(),
            ToaDoVD: $("#ToaDoVD").val(),
            DonViThue: $("#DonViThue").val(),
            TenDVQL: $("#TenDVQL").val(),
        },
        dataType: "json"
    })
            .done(function (resp) {
                if (resp.returnCode == 1) {
                    hidePopupAddBTS();
                    showPopupMessage("success", resp.returnMessage);
                    var tramBTS = $.parseJSON(resp.data);
                    tramBTSList.push(tramBTS);
                    initMarkerClusterer();
                    setTimeout(function () {
                        showMarker(tramBTS.MaSo);
                    }, 1500)
                } else {
                    showErrorMessage(resp.returnMessage);
                }
            })
}

function  handlePopupSubmitUpdate() {
    $.ajax({
        type: "post",
        url: contextPath + '/ajax/update-bts',
        data: {
            MaSo: $("#MaSo").val(),
            TenTram: $("#TenTram").val(),
            NgayLapDat: $("#NgayLapDat").val(),
            TinhThanhLD: $("#TinhThanhLD").val(),
            QuanHuyenLD: $("#QuanHuyenLD").val(),
            PhuongXaLD: $("#PhuongXaLD").val(),
            DiaChiLapDat: $("#DiaChiLapDat").val(),
            TrangThai: $("#TrangThai").val(),
            ToaDoKD: $("#ToaDoKD").val(),
            ToaDoVD: $("#ToaDoVD").val(),
            DonViThue: $("#DonViThue").val(),
            TenDVQL: $("#TenDVQL").val(),
        },
        dataType: "json"
    })
            .done(function (resp) {
                if (resp.returnCode == 1) {
                    hidePopupAddBTS();
                    showPopupMessage("success", resp.returnMessage);
                    var tramBTS = $.parseJSON(resp.data);
                    for (var i = 0; i < tramBTSList.length; i++) {
                        if (tramBTSList[i].MaSo == tramBTS.MaSo) {
                            tramBTSList[i] = tramBTS;
                            break;
                        }
                    }
                    initMarkerClusterer();
                    setTimeout(function () {
                        showMarker(tramBTS.MaSo);
                    }, 1500)
                } else {
                    showErrorMessage(resp.returnMessage);
                }
            })
}


function showSuccessMessage(message) {
    $("#message").removeClass("alert-danger").addClass("alert-success");
    $("#message").text(message).show();
}
function showErrorMessage(message) {
    $("#message").addClass("alert-danger").removeClass("alert-success");
    $("#message").text(message).show();
}
function hideMessage() {
    $("#message").text("&nbsp;").show();
}

function showPopupConfirmDeleteTramBTS() {
    showPopupConfirm("Xác nhận xóa trạm",
            "Bạn có muốn xóa trạm '" + $("#TenTram").val() + "'",
            "Hủy",
            "Đồng ý",
            handlePopupSubmitDelete);
    $("#popup-confirm").show();
}
function  handlePopupSubmitDelete() {
    $.ajax({
        type: "post",
        url: contextPath + '/ajax/delete-bts',
        data: {
            MaSo: $("#MaSo").val(),
        },
        dataType: "json"
    })
            .done(function (resp) {
                if (resp.returnCode == 1) {
                    showPopupMessage("success", resp.returnMessage);
                    var MaSo = $("#MaSo").val();
                    for (var i = 0; i < tramBTSList.length; i++) {
                        var tramBTS = tramBTSList[i];
                        var key = tramBTS.MaSo;
                        if (key == MaSo) {
                            tramBTS.marker.setMap(null);
                            tramBTSList.splice(i, 1);
                            break;
                        }
                    }
                    initMarkerClusterer();

                } else {
                    showPopupMessage("danger", resp.returnMessage);
                }
            })
}


