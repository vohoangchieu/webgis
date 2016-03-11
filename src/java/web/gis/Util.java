/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.gis;

import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author chieuvh
 */
public class Util {

    public static String getParameter(HttpServletRequest req, String paramName) {
        String value = req.getParameter(paramName);
        if (value == null) {
            return "";
        }
        return value.trim();
    }
}
