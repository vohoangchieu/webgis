function showProcessing() {
    var html = '';
    html += '      <div id="popup_processing_box" class="message_box animated fadeIn fast" align="center" >'
    html += '<div id="popup_processing_box_dim" style="'
    html += 'background: none repeat scroll 0 0 rgba(0, 0, 0, 0.1);'
    html += 'position: absolute; '
    html += 'top: 0px; left: 0px; '
    html += 'height: 100%; '
    html += 'width: 100%;'
    html += 'overflow: auto;"><img src="/img/loading128.gif" style="position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);"></div>'
    html += '</div>'
    html += '</div>'
    $("#popup_processing_box").remove();
    $('body').append(html);
}
function hideProcessing() {
    $("#popup_processing_box").remove();
}
function selectText(containerid) {
    var doc = document
            , text = doc.getElementById(containerid)
            , range, selection
            ;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
function replaceUnicode(input) {
    var signedChars = "àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ";
//    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyaaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy";
    var pattern = new RegExp("[" + signedChars + "]", "g");
    var output = input.replace(pattern, function (m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
    return output;
}
var getDistance = function (p1, p2) {
    var R = 6378137;
    // Earth’s mean radius in meter
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter 
};
function latLngToString(latLng) {
    return "(" + latLng.lat().toFixed(5) + " , " + latLng.lng().toFixed(5) + ")";

}
function getDDMMYYYY() {
    var date = new Date();
    var dateDDMMYYYY = '';
    if (date.getDate() < 10) {
        dateDDMMYYYY += '0' + date.getDate() + '/';
    } else {
        dateDDMMYYYY += date.getDate() + '/';
    }
    if (date.getMonth() + 1 < 10) {
        dateDDMMYYYY += '0' + (date.getMonth() + 1) + '/';
    } else {
        dateDDMMYYYY += (date.getMonth() + 1) + '/';
    }
    dateDDMMYYYY += date.getFullYear();
    return dateDDMMYYYY;
}
function showPopupConfirm(confirmTitle, confirmContent, buttonTextCancel, buttonTextOK, callback) {
    $("#confirm-title").text(confirmTitle);
    $("#confirm-content").text(confirmContent);
    $("#btn-confirm-cancel").text(buttonTextCancel);
    $("#btn-confirm-ok").text(buttonTextOK);
    $("#btn-confirm-ok").unbind("click");
    $("#btn-confirm-ok").click(callback);
}
function hidePopupConfirm() {
    $("#popup-confirm").hide();
}
function showPopupMessage(type, message, callback) {
    $("#show-message-content").text(message);
    $("#btn-confirm-ok").unbind("click");
    if (callback) {
        $("#btn-confirm-ok").click(callback);
    }
    $("#popup-show-message .panel").attr("class", "panel panel-" + type);
    $("#popup-show-message").show();
}
function hidePopupShowMessage() {
    $("#popup-show-message").hide();
}