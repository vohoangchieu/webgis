/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.gis;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Enumeration;
import java.util.Properties;
import java.util.logging.Level;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.log4j.Logger;
import web.gis.config.AppConfig;

/**
 *
 * @author chieuvh
 */
public class AppContextListener implements ServletContextListener {

    private static final Logger logger = Logger.getLogger(AppContextListener.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        logger.info("contextInitialized");
        AppConfig.contextPath = sce.getServletContext().getContextPath();
        Properties config = new Properties();
        try {
            String fileName = "WEB-INF/classes/jdbc.properties";
            InputStream input = sce.getServletContext().getResourceAsStream(fileName);
            config.load(input);
        } catch (IOException ex) {
            logger.info(ex.getMessage());
        } catch (Exception ex) {
            logger.info(ex.getMessage());
        }
        
        Enumeration en = config.keys();

        // System.out.println("********** System configuration **********");
        while (en.hasMoreElements()) {
            String key = (String) en.nextElement();
            String value = (String) config.get(key);
            logger.info(key + " => " + value);
            
        }
        String host = "127.0.0.1";
        String port = "3306";
        String dbname = "chuyennganhso4t";
        String JDBC_DRIVER = "com.mysql.jdbc.Driver";        
        try {
            Class.forName(JDBC_DRIVER);
            String url = "jdbc:mysql://" + host + ":" + port + "/" + dbname + "?useUnicode=true&characterEncoding=UTF-8&";
            Connection conn = DriverManager.getConnection(url, "gisuser", "gispas");
            conn.createStatement();
            conn.close();
        } catch (Exception ex) {
            logger.error(ex.getMessage(), ex);
        }
        
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        logger.info("contextDestroyed");
    }
    
}
