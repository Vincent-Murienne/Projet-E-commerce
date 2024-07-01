package com.example.airneis.manager;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;
import java.util.Scanner;

public class APIManager {
    public RequestQueue queue;
    private String apiKey = "fizehyvsdbijojiop83Y9049FIEJO:!lI3UFEIHZofez082";
    private String baseURL = "http://10.0.2.2:8000"; // 10.0.2.2 matches localhost from the emulator context

    public APIManager(Context context) throws IOException {
        this.queue = Volley.newRequestQueue(context);

        //SetVariables();

        Properties properties = new Properties();
        properties.load(getClass().getResourceAsStream("./.env"));
        System.out.println(properties.getProperty("API_KEY"));
    }

    public interface VolleyResponseListener {
        void onError(String message);

        void onResponse(JSONObject response);
    }

    public void apiCall(String endpoint, String action, JSONObject data, final VolleyResponseListener listener) throws JSONException {
        String url = String.format("%s/actions/%s/%s.php", baseURL, endpoint, action);

        data.put("apiKey", apiKey);

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, data, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                listener.onResponse(response);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                listener.onError(error.toString());
            }
        });

        queue.add(jsonObjectRequest);
    }

    public void SetVariables() throws IOException {
        /*File file = new File(".env");
        Scanner sc = new Scanner(file);
        System.out.println(sc.next());*/

    }
}
