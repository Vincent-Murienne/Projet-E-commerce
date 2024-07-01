package com.example.airneis.fragment;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.airneis.R;
import com.example.airneis.manager.APIManager;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileNotFoundException;
import java.io.IOException;

public class HomeFragment extends Fragment {
    private APIManager apiManager;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View inf = (View) inflater.inflate(R.layout.fragment_home, container, false);

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

        apiManager = new APIManager(getActivity().getApplicationContext());
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

        return inf;
    }
}