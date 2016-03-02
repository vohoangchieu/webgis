/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.gis;

import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.Properties;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.log4j.Logger;

/**
 *
 * @author chieuvh
 */
public class AppContextListener implements ServletContextListener {
    private static final Logger logger = Logger.getLogger(AppContextListener.class);
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        logger.info("contextInitialized");
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
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        logger.info("contextDestroyed");
    }

}
