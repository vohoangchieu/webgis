/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.gis;

import com.google.gson.Gson;

/**
 *
 * @author chieuvh
 */
public class BaseEntity {
    public String toJsonString() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}
