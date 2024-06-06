package com.example.airneis;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.airneis.manager.APIManager;

import org.json.JSONException;
import org.json.JSONObject;

public class Main2Activity extends AppCompatActivity {
    private APIManager apiManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main2);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        System.out.println("début");

        APIManager.VolleyResponseListener listener = new APIManager.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                System.out.println(message);
            }

            @Override
            public void onResponse(JSONObject response) {
                System.out.println(response);
            }
        };

        apiManager = new APIManager(getApplicationContext());
        JSONObject data = new JSONObject();
        try {
            data.put("table", "categories");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }


        try {
            apiManager.apiCall("panelAdmin", "getTop", data, listener);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        System.out.println("fin");
    }
}