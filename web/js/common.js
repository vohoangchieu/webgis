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
    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    var pattern = new RegExp("[" + signedChars + "]", "g");
    var output = input.replace(pattern, function (m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
    return output;
}