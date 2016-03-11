/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.gis;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import hapax.Template;
import hapax.TemplateDataDictionary;
import hapax.TemplateDictionary;
import hapax.TemplateException;
import hapax.TemplateLoader;
import hapax.TemplateResourceLoader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;
import web.gis.config.AppConfig;

/**
 *
 * @author chieuvh
 */
public class IndexServlet extends HttpServlet {

    private static final Logger logger = Logger.getLogger(IndexServlet.class);

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            GsonBuilder gsonBuilder = new GsonBuilder().setDateFormat(AppConfig.dateFormat);
            Gson gson = gsonBuilder.create();
            String maso = request.getParameter("maso");
            if (maso == null) {
                maso = "";
            }
            TemplateDataDictionary dic = TemplateDictionary.create();
            dic.setVariable("maso", maso);
            dic.setVariable("webTitle", AppConfig.webTitle);
            dic.setVariable("contextPath", AppConfig.contextPath);
            dic.setVariable("homeLat", AppConfig.homeLat);
            dic.setVariable("homeLng", AppConfig.homeLng);
            dic.setVariable("defaultZoomLevel", AppConfig.defaultZoomLevel);
            DataAccess dataAccess = new DataAccess(AppConfig.databaseUrl, AppConfig.databaseUser, AppConfig.databasePassword);
            HashMap<Integer, TinhThanhEntity> tinhThanhMap = dataAccess.getTinhThanhMap();
            HashMap<Integer, QuanHuyenEntity> quanHuyenMap = dataAccess.getQuanHuyenMap();
            HashMap<Integer, PhuongXaEntity> phuongXaMap = dataAccess.getPhuongXaMap();
            List<TramBTSEntity> tramBTSList = dataAccess.getAllTramBTS();
            dic.setVariable("tinhThanhMap", gson.toJson(tinhThanhMap));
            dic.setVariable("quanHuyenMap", gson.toJson(quanHuyenMap));
            dic.setVariable("phuongXaMap", gson.toJson(phuongXaMap));
            dic.setVariable("tramBTSList", gson.toJson(tramBTSList));
            dic.setVariable("tinhtrangMap", AppConfig.tinhtrangMap);
            Template template = getCTemplate("index");
            String data = template.renderToString(dic);
            outContent(data, response);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
        }

    }

    protected Template getCTemplate(String tpl) throws TemplateException {
        TemplateLoader templateLoader = TemplateResourceLoader.create("views/");
        Template template = templateLoader.getTemplate(tpl);
        return template;
    }

    protected void outContent(String content, HttpServletResponse response) {

        PrintWriter out = null;
        try {
            response.setContentType("text/html;charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            out = response.getWriter();
            out.print(content);
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
