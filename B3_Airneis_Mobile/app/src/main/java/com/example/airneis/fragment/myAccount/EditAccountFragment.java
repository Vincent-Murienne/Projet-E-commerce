package com.example.airneis.fragment.myAccount;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.airneis.R;
import com.example.airneis.fragment.homePage.HomeFragment;
import com.example.airneis.manager.APIManager;

import org.json.JSONException;
import org.json.JSONObject;

public class EditAccountFragment extends Fragment {
    private APIManager apiManager;
    private int userId;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = (View) inflater.inflate(R.layout.fragment_parametre_compte, container, false);

        apiManager = new APIManager(getContext());

        // Set userId from the phone preferences
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        userId = sharedPref.getInt("userId", -1);

        getAccountData();

        return view;
    }

    private void getAccountData() {
        JSONObject data = new JSONObject();
        try {
            data.put("table", "users");
            data.put("id", userId);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        APIManager.VolleyResponseListener listener = new APIManager.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Log.e("API Error", message);
            }

            @Override
            public void onResponse(JSONObject response) {
                try {
                    if (response.getBoolean("success")) {
                        //editTextUserName.setText(response.getJSONObject("data").getString("full_name"));
                        //editTextUserEmail.setText(response.getJSONObject("data").getString("email"));
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("panelAdmin", "getUserInfo", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }
}