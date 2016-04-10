/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.gis;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import web.gis.config.AppConfig;

/**
 *
 * @author chieuvh
 */
public class BaseEntity {
    public String toJsonString() {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setDateFormat(AppConfig.dateFormat);
        Gson gson = gsonBuilder.create();
        return gson.toJson(this);
    }
}
