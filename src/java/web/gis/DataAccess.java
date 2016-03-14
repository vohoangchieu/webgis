/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.gis;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.apache.log4j.Logger;

/**
 *
 * @author chieuvh
 */
public class DataAccess {

    private static final Logger logger = Logger.getLogger(DataAccess.class);
    private Connection conn = null;
    private String host = null;
    private String port = null;
    private String dbname = null;
    private String user = null;
    private String pass = null;
    private String url = null;

    public DataAccess(String host, String port, String dbname, String user, String pass) {
        this.host = host;
        this.port = port;
        this.dbname = dbname;
        this.user = user;
        this.host = host;
        this.pass = pass;
        this.url = "jdbc:mysql://" + host + ":" + port + "/" + dbname + "?useUnicode=true&characterEncoding=UTF-8&";

    }

    public DataAccess(String url, String user, String pass) {
        this.user = user;
        this.pass = pass;
        this.url = url;

    }

    public void getConnection() throws ClassNotFoundException, SQLException {
        String JDBC_DRIVER = "com.mysql.jdbc.Driver";

        Class.forName(JDBC_DRIVER);
//        String url = "jdbc:mysql://" + host + ":" + port + "/" + dbname + "?useUnicode=true&characterEncoding=UTF-8&";
        conn = DriverManager.getConnection(url, user, pass);
    }

    public void closeConnection() {
        try {
            if (conn != null && conn.isClosed() == false) {
                conn.close();
                conn = null;
            }
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
        }
    }

    public HashMap<Integer, TinhThanhEntity> getTinhThanhMap() throws SQLException {
        HashMap<Integer, TinhThanhEntity> result = new HashMap();
        try {
            getConnection();
            String sql = "select *from dmtinhthanh";
            Statement statement = conn.createStatement();
            ResultSet resultSet = statement.executeQuery(sql);
            while (resultSet.next()) {
                TinhThanhEntity tinhThanhEntity = new TinhThanhEntity();
                tinhThanhEntity.Id = resultSet.getInt("Id");
                tinhThanhEntity.MaSo = resultSet.getString("MaSo");
                tinhThanhEntity.Ten = resultSet.getString("Ten");
                tinhThanhEntity.IsActive = resultSet.getInt("IsActive") == 1;
                result.put(tinhThanhEntity.Id, tinhThanhEntity);
            }
        } catch (ClassNotFoundException cnfex) {
            logger.error(cnfex.getMessage(), cnfex);
        } finally {
//            closeConnection();
        }
        return result;
    }

    public HashMap<Integer, QuanHuyenEntity> getQuanHuyenMap() throws SQLException {
        HashMap<Integer, QuanHuyenEntity> result = new HashMap();
        try {
            getConnection();
            String sql = "select *from dmquanhuyen";
            Statement statement = conn.createStatement();
            ResultSet resultSet = statement.executeQuery(sql);
            while (resultSet.next()) {
                QuanHuyenEntity quanHuyen = new QuanHuyenEntity();
                quanHuyen.Id = resultSet.getInt("Id");
                quanHuyen.MaSo = resultSet.getString("MaSo");
                quanHuyen.Ten = resultSet.getString("Ten");
                quanHuyen.ThuocTinhThanh = resultSet.getInt("ThuocTinhThanh");
                quanHuyen.IsActive = resultSet.getInt("IsActive") == 1;
                result.put(quanHuyen.Id, quanHuyen);
            }
        } catch (ClassNotFoundException cnfex) {
            logger.error(cnfex.getMessage(), cnfex);
        } finally {
//            closeConnection();
        }
        return result;
    }

    public HashMap<Integer, PhuongXaEntity> getPhuongXaMap() throws SQLException {
        HashMap<Integer, PhuongXaEntity> result = new HashMap();
        try {
            getConnection();
            String sql = "select *from dmphuongxa";
            Statement statement = conn.createStatement();
            ResultSet resultSet = statement.executeQuery(sql);
            while (resultSet.next()) {
                PhuongXaEntity phuongXa = new PhuongXaEntity();
                phuongXa.Id = resultSet.getInt("Id");
                phuongXa.MaSo = resultSet.getString("MaSo");
                phuongXa.Ten = resultSet.getString("Ten");
                phuongXa.ThuocQuanHuyen = resultSet.getInt("ThuocQuanHuyen");
                phuongXa.IsActive = resultSet.getInt("IsActive") == 1;
                result.put(phuongXa.Id, phuongXa);
            }
        } catch (ClassNotFoundException cnfex) {
            logger.error(cnfex.getMessage(), cnfex);
        } finally {
//            closeConnection();
        }
        return result;
    }

    public int insert(TramBTSEntity tramBTSEntity) throws SQLException {
        String sql = "INSERT INTO `thongtin_trambts` ("
                + "`MaSo`, `TenTram`, `NgayLapDat`, `DiaChiLapDat`, `TinhThanhLD`, "
                + "`QuanHuyenLD`, `PhuongXaLD`, `TrangThai`, `TinhTrang`, `DonViThue`,"
                + " `ToaDoKD`, `ToaDoVD`, `LoaiTram`, `LoaiCotAT`, `ChieuCao`,"
                + " `DTSanLap`, `TenDVQL`, `DiaChiDVQL`, `DienThoaiDVQL`, `SoVBTT`,"
                + " `NgayVBTT`, `CoQuanVBTT`, `TapTinVBTT`, `ThueDDTuNgay`, `ThueDDDenNgay`, "
                + "`NgayDuaVaoSuDung`, `DaKiemDinh`, `DaCapGiayCN`, `SoGiayCN`, `TapTinKD`,"
                + " `DaKiemTra`, `NgayKT`, `TapTinKT`, `GhiChu`, `IsActive`, "
                + "`CreatedDate`, `CreatedByUserID`, `ModifiedByUserID`, `ModifiedDate`) "
                + "VALUES ("
                + ":MaSo,  :TenTram,  :NgayLapDat,  :DiaChiLapDat,  :TinhThanhLD,  "
                + ":QuanHuyenLD,  :PhuongXaLD,  :TrangThai,  :TinhTrang,  :DonViThue, "
                + " :ToaDoKD,  :ToaDoVD,  :LoaiTram,  :LoaiCotAT,  :ChieuCao, "
                + " :DTSanLap,  :TenDVQL,  :DiaChiDVQL,  :DienThoaiDVQL,  :SoVBTT, "
                + " :NgayVBTT,  :CoQuanVBTT,  :TapTinVBTT,  :ThueDDTuNgay,  :ThueDDDenNgay,  "
                + ":NgayDuaVaoSuDung,  :DaKiemDinh,  :DaCapGiayCN,  :SoGiayCN,  :TapTinKD, "
                + " :DaKiemTra,  :NgayKT,  :TapTinKT,  :GhiChu,  :IsActive,  "
                + ":CreatedDate,  :CreatedByUserID,  :ModifiedByUserID,  :ModifiedDate"
                + ") ";
        int row = 0;
        try {
            getConnection();

            NamedParameterStatement statement = new NamedParameterStatement(conn, sql);
//              + "`MaSo`, `TenTram`, `NgayLapDat`, `DiaChiLapDat`, `TinhThanhLD`, "
            statement.setInt("MaSo", tramBTSEntity.MaSo);
            statement.setString("TenTram", tramBTSEntity.TenTram);
            statement.setTimestamp("NgayLapDat", new Timestamp(tramBTSEntity.NgayLapDat.getTime()));
            statement.setString("DiaChiLapDat", tramBTSEntity.DiaChiLapDat);
            statement.setInt("TinhThanhLD", tramBTSEntity.TinhThanhLD);
//            + "`QuanHuyenLD`, `PhuongXaLD`, `TrangThai`, `TinhTrang`, `DonViThue`,"
            statement.setInt("QuanHuyenLD", tramBTSEntity.QuanHuyenLD);
            statement.setInt("PhuongXaLD", tramBTSEntity.PhuongXaLD);
            statement.setInt("TrangThai", tramBTSEntity.TrangThai);
            statement.setInt("TinhTrang", tramBTSEntity.TinhTrang);
            statement.setString("DonViThue", tramBTSEntity.DonViThue);
            statement.setFloat("ToaDoKD", tramBTSEntity.ToaDoKD);
            statement.setFloat("ToaDoVD", tramBTSEntity.ToaDoVD);
            statement.setInt("LoaiTram", tramBTSEntity.LoaiTram);
            statement.setString("LoaiCotAT", tramBTSEntity.LoaiCotAT);
            statement.setFloat("ChieuCao", tramBTSEntity.ChieuCao);
            statement.setFloat("DTSanLap", tramBTSEntity.DTSanLap);
            statement.setString("TenDVQL", tramBTSEntity.TenDVQL);
            statement.setString("DiaChiDVQL", tramBTSEntity.DiaChiDVQL);
            statement.setString("DienThoaiDVQL", tramBTSEntity.DienThoaiDVQL);
            statement.setString("SoVBTT", tramBTSEntity.SoVBTT);
            statement.setTimestamp("NgayVBTT", new Timestamp(tramBTSEntity.NgayVBTT.getTime()));
            statement.setString("CoQuanVBTT", tramBTSEntity.CoQuanVBTT);
            statement.setString("TapTinVBTT", tramBTSEntity.TapTinVBTT);
            statement.setTimestamp("ThueDDTuNgay", new Timestamp(tramBTSEntity.ThueDDTuNgay.getTime()));
            statement.setTimestamp("ThueDDDenNgay", new Timestamp(tramBTSEntity.ThueDDDenNgay.getTime()));
//        + "`NgayDuaVaoSuDung,  :DaKiemDinh,  :DaCapGiayCN,  :SoGiayCN,  :TapTinKD, "
//            + " `DaKiemTra,  :NgayKT,  :TapTinKT,  :GhiChu,  :IsActive,  "
//            + "`CreatedDate,  :CreatedByUserID,  :ModifiedByUserID,  :ModifiedDate`"

            statement.setTimestamp("NgayDuaVaoSuDung", new Timestamp(tramBTSEntity.NgayDuaVaoSuDung.getTime()));
            statement.setInt("DaKiemDinh", tramBTSEntity.DaKiemDinh ? 1 : 0);
            statement.setInt("DaCapGiayCN", tramBTSEntity.DaCapGiayCN ? 1 : 0);
            statement.setString("SoGiayCN", tramBTSEntity.SoGiayCN);
            statement.setString("TapTinKD", tramBTSEntity.TapTinKD);
            statement.setInt("DaKiemTra", tramBTSEntity.DaKiemTra ? 1 : 0);
            statement.setTimestamp("NgayKT", new Timestamp(tramBTSEntity.NgayKT.getTime()));
            statement.setString("TapTinKT", tramBTSEntity.TapTinKT);
            statement.setString("GhiChu", tramBTSEntity.GhiChu);
            statement.setInt("IsActive", tramBTSEntity.IsActive ? 1 : 0);
            statement.setTimestamp("CreatedDate", new Timestamp(tramBTSEntity.CreatedDate.getTime()));
            statement.setInt("CreatedByUserID", tramBTSEntity.CreatedByUserID);
            statement.setInt("ModifiedByUserID", tramBTSEntity.ModifiedByUserID);
            statement.setTimestamp("ModifiedDate", new Timestamp(tramBTSEntity.ModifiedDate.getTime()));
            logger.info(statement.toString());
            row = statement.executeUpdate();
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
        } finally {
//            closeConnection();
        }
        return row;
    }

    public List<TramBTSEntity> getAllTramBTS() throws SQLException {
        List<TramBTSEntity> result = new ArrayList();
        String sql = "select  "
                + "`MaSo`, `TenTram`, `NgayLapDat`, `DiaChiLapDat`, `TinhThanhLD`, "
                + "`QuanHuyenLD`, `PhuongXaLD`, `TrangThai`, `DonViThue`,"
                + " `ToaDoKD`, `ToaDoVD`, `LoaiTram`, `LoaiCotAT`, `ChieuCao`,"
                + " `DTSanLap`, `DienThoaiDVQL`, "
                + " `ThueDDTuNgay`, `ThueDDDenNgay`, "
                + "`NgayDuaVaoSuDung`, "
                + " `DaKiemTra`,`GhiChu` "
                + " from `thongtin_trambts` where IsActive=1";

        try {
            getConnection();
            NamedParameterStatement statement = new NamedParameterStatement(conn, sql);
            logger.info(statement.toString());
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                TramBTSEntity entity = new TramBTSEntity();
                entity.MaSo = resultSet.getInt("MaSo");
                entity.TenTram = resultSet.getString("TenTram");
                entity.NgayLapDat = resultSet.getTimestamp("NgayLapDat");
                entity.DiaChiLapDat = resultSet.getString("DiaChiLapDat");
                entity.TinhThanhLD = resultSet.getInt("TinhThanhLD");
                entity.QuanHuyenLD = resultSet.getInt("QuanHuyenLD");
                entity.PhuongXaLD = resultSet.getInt("PhuongXaLD");
                entity.TrangThai = resultSet.getInt("TrangThai");
                entity.DonViThue = resultSet.getString("DonViThue");
                entity.ToaDoKD = resultSet.getFloat("ToaDoKD");
                entity.ToaDoVD = resultSet.getFloat("ToaDoVD");
                entity.LoaiTram = resultSet.getInt("LoaiTram");
                entity.LoaiCotAT = resultSet.getString("LoaiCotAT");
                entity.ChieuCao = resultSet.getFloat("ChieuCao");
                entity.DTSanLap = resultSet.getFloat("DTSanLap");
                entity.ThueDDTuNgay = resultSet.getTimestamp("ThueDDTuNgay");
                entity.ThueDDDenNgay = resultSet.getTimestamp("ThueDDDenNgay");
                entity.NgayDuaVaoSuDung = resultSet.getTimestamp("NgayDuaVaoSuDung");
                entity.DaKiemTra = resultSet.getInt("DaKiemTra") == 1;
                entity.GhiChu = resultSet.getString("GhiChu");
                result.add(entity);
            }

        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
        } finally {
//            closeConnection();
        }
        return result;
    }

    public int updateLatLng(TramBTSEntity tramBTSEntity) throws SQLException {
        int row = -1;
        try {
            getConnection();
            String sql = "update thongtin_trambts set ToaDoKD=:ToaDoKD,ToaDoVD=:ToaDoVD where MaSo=:MaSo";
            NamedParameterStatement statement = new NamedParameterStatement(conn, sql);
            statement.setInt("MaSo", tramBTSEntity.MaSo);
            statement.setFloat("ToaDoKD", tramBTSEntity.ToaDoKD);
            statement.setFloat("ToaDoVD", tramBTSEntity.ToaDoVD);
            logger.info(statement.toString());
            row = statement.executeUpdate();
        } catch (ClassNotFoundException cnfex) {
            logger.error(cnfex.getMessage(), cnfex);
        } finally {
//            closeConnection();
        }
        return row;
    }
}
