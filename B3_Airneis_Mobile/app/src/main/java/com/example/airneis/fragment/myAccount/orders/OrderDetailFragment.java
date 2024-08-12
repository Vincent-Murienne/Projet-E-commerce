package com.example.airneis.fragment.myAccount.orders;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.airneis.R;
import com.example.airneis.manager.APIManager;

import org.json.JSONException;
import org.json.JSONObject;

public class OrderDetailFragment extends Fragment {

    private APIManager apiManager;
    private int orderId;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_orders, container, false);

        apiManager = new APIManager(getContext());
        loadOrderData();

        return root;
    }

    private void loadOrderData() {
        if (getArguments() != null) {
            orderId = getArguments().getInt("orderId");
        }

        JSONObject data = new JSONObject();
        try {
            data.put("order_id", orderId);

            apiManager.apiCall("orders", "getOrderDetails", data, new APIManager.VolleyResponseListener() {
                @Override
                public void onError(String message) {
                    Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onResponse(JSONObject response) {
                    Log.d("debug", response.toString());
                    try {
                        if (response.getBoolean("success")) {

                        } else {
                            Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        Toast.makeText(getContext(), "Une erreur s'est produite", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
            Toast.makeText(getContext(), "Une erreur s'est produite", Toast.LENGTH_SHORT).show();
        }
    }
}
