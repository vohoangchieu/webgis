/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.gis;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import web.gis.config.AppConfig;

/**
 *
 * @author chieuvh
 */
public class AjaxUpdateBtsServlet extends BaseServlet {

    private static final Logger logger = Logger.getLogger(AjaxUpdateBtsServlet.class);

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        DataAccess dataAccess = null;
        AjaxResponse responseObject = new AjaxResponse();
        try {
            handle(request, responseObject, dataAccess);
            outContent(responseObject.toJsonString(), response);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
        } finally {
            if (dataAccess != null) {
                dataAccess.closeConnection();
            }
        }

    }

    private void handle(HttpServletRequest request, AjaxResponse responseObject, DataAccess dataAccess) throws Exception {
        GsonBuilder gsonBuilder = new GsonBuilder().setDateFormat(AppConfig.dateFormat);
        Gson gson = gsonBuilder.create();
        String MaSo = Util.getParameter(request, "MaSo");
        if (StringUtils.isEmpty(MaSo)) {
            responseObject.returnMessage = "Mã số trạm không hợp lệ";
            return;
        }
        String TenTram = Util.getParameter(request, "TenTram");
        if (StringUtils.isEmpty(TenTram)) {
            responseObject.returnMessage = "Vui lòng nhập tên trạm";
            return;
        }
        String NgayLapDat = Util.getParameter(request, "NgayLapDat");
        if (StringUtils.isEmpty(NgayLapDat)) {
            responseObject.returnMessage = "Vui lòng chọn ngày lắp đặt";
            return;
        }
        String TinhThanhLD = Util.getParameter(request, "TinhThanhLD");
        if (StringUtils.isEmpty(TinhThanhLD)) {
            responseObject.returnMessage = "Vui lòng chọn tỉnh thành lắp đặt";
            return;
        }
        String QuanHuyenLD = Util.getParameter(request, "QuanHuyenLD");
        if (StringUtils.isEmpty(QuanHuyenLD)) {
            responseObject.returnMessage = "Vui lòng chọn quận huyện lắp đặt";
            return;
        }
        String PhuongXaLD = Util.getParameter(request, "PhuongXaLD");
        if (StringUtils.isEmpty(PhuongXaLD)) {
            responseObject.returnMessage = "Vui lòng chọn phường xã lắp đặt";
            return;
        }
        String DiaChiLapDat = Util.getParameter(request, "DiaChiLapDat");
        if (StringUtils.isEmpty(DiaChiLapDat)) {
            responseObject.returnMessage = "Vui lòng chọn địa chỉ lắp đặt";
            return;
        }
        String ToaDoKD = Util.getParameter(request, "ToaDoKD");
        if (StringUtils.isEmpty(ToaDoKD)) {
            responseObject.returnMessage = "Vui lòng nhập tọa độ kinh độ";
            return;
        }
        String ToaDoVD = Util.getParameter(request, "ToaDoVD");
        if (StringUtils.isEmpty(ToaDoVD)) {
            responseObject.returnMessage = "Vui lòng nhập tọa độ vĩ độ";
            return;
        }
        String DonViThue = Util.getParameter(request, "DonViThue");
        String TenDVQL = Util.getParameter(request, "TenDVQL");
        if (StringUtils.isEmpty(ToaDoVD)) {
            responseObject.returnMessage = "Vui lòng nhập tên đơn vị quản lý";
            return;
        }
        String TrangThai = Util.getParameter(request, "TrangThai");
        if (StringUtils.isEmpty(TrangThai)) {
            responseObject.returnMessage = "Vui lòng chọn trạng thái";
            return;
        }
        dataAccess = new DataAccess(AppConfig.databaseUrl, AppConfig.databaseUser, AppConfig.databasePassword);
        dataAccess.getConnection();
        HashMap<Integer, TinhThanhEntity> tinhThanhMap = dataAccess.getTinhThanhMap();
        HashMap<Integer, QuanHuyenEntity> quanHuyenMap = dataAccess.getQuanHuyenMap();
        HashMap<Integer, PhuongXaEntity> phuongXaMap = dataAccess.getPhuongXaMap();
        int tinhthanhLapDat = 0, quanhuyenLapDat = 0, phuongxaLapDat = 0;
        try {
            tinhthanhLapDat = Integer.parseInt(TinhThanhLD);
            if (tinhThanhMap.containsKey(tinhthanhLapDat) == false) {
                responseObject.returnMessage = "Thông tin tỉnh thành không hợp lệ";
                return;
            }
        } catch (Exception ex) {
            responseObject.returnMessage = "Vui lòng chọn tỉnh thành lắp đặt";
            return;
        }
        try {
            quanhuyenLapDat = Integer.parseInt(QuanHuyenLD);
            if (quanHuyenMap.containsKey(quanhuyenLapDat) == false) {
                responseObject.returnMessage = "Thông tin quận huyện không hợp lệ";
                return;
            }
        } catch (Exception ex) {
            responseObject.returnMessage = "Vui lòng chọn quận huyện lắp đặt";
            return;
        }
        try {
            phuongxaLapDat = Integer.parseInt(PhuongXaLD);
            if (phuongXaMap.containsKey(phuongxaLapDat) == false) {
                responseObject.returnMessage = "Thông tin phường xã không hợp lệ";
                return;
            }
        } catch (Exception ex) {
            responseObject.returnMessage = "Vui lòng chọn phường xã lắp đặt";
            return;
        }
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(AppConfig.dateFormat);
        Date ngayLapDat = null;
        try {
            ngayLapDat = simpleDateFormat.parse(NgayLapDat);
        } catch (Exception ex) {
            responseObject.returnMessage = "Ngày lắp đặt không hợp lệ";
            return;
        }
        float toadoKinhDo = 0, toadoViDo = 0;
        try {
            toadoKinhDo = Float.parseFloat(ToaDoKD);
        } catch (Exception ex) {
            responseObject.returnMessage = "Tọa độ kinh độ không hợp lệ";
            return;
        }
        try {
            toadoViDo = Float.parseFloat(ToaDoVD);
        } catch (Exception ex) {
            responseObject.returnMessage = "Tọa độ vĩ độ không hợp lệ";
            return;
        }
        int trangthai = 0;
        try {
            trangthai = Integer.parseInt(TrangThai);
            if (trangthai < 1) {
                responseObject.returnMessage = "Trạng thái không hợp lệ";
                return;
            }
        } catch (Exception ex) {
            responseObject.returnMessage = "Trạng thái không hợp lệ";
            return;
        }
        int maso = 0;
        try {
            maso = Integer.parseInt(MaSo);
            if (maso < 1) {
                responseObject.returnMessage = "Mã số trạm không hợp lệ";
                return;
            }
        } catch (Exception ex) {
            responseObject.returnMessage = "Mã số trạm không hợp lệ";
            return;
        }
        TramBTSEntity entity = new TramBTSEntity();
        entity.MaSo=maso;
        entity.TenTram = TenTram;
        entity.NgayLapDat = ngayLapDat;
        entity.TinhThanhLD = tinhthanhLapDat;
        entity.QuanHuyenLD = quanhuyenLapDat;
        entity.PhuongXaLD = phuongxaLapDat;
        entity.DiaChiLapDat = DiaChiLapDat;
        entity.TenDVQL = TenDVQL;
        entity.DonViThue = DonViThue;
        entity.ToaDoKD = toadoKinhDo;
        entity.ToaDoVD = toadoViDo;
        entity.TrangThai = trangthai;
        int row = dataAccess.updateTramBTS(entity);
        if (row >= 0) {
            responseObject.data = entity.toJsonString();
            responseObject.returnCode = 1;
            responseObject.returnMessage = "Cập nhật trạm thành công";
        } else {
            responseObject.returnMessage = "Lỗi hệ thống, vui lòng thử lại sau";
        }

    }

   

}
