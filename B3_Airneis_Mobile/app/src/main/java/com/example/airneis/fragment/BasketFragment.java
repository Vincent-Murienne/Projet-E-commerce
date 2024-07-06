package com.example.airneis.fragment;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.airneis.R;
import com.example.airneis.manager.APIManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class BasketFragment extends Fragment {

    private APIManager apiManager;
    private LinearLayout productList;
    private TextView totalPrice;
    private TextView tvaPrice;
    private Button checkoutButton;

    private double tva = 0.17;
    private double totalPriceValue = 0.0;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View inf = inflater.inflate(R.layout.fragment_basket, container, false);

        productList = inf.findViewById(R.id.productList);
        totalPrice = inf.findViewById(R.id.totalPrice);
        tvaPrice = inf.findViewById(R.id.tvaPrice);
        checkoutButton = inf.findViewById(R.id.checkoutButton);

        apiManager = new APIManager(getActivity().getApplicationContext());

        loadBasketData();

        checkoutButton.setOnClickListener(v -> handleCheckout());

        return inf;
    }

    private void loadBasketData() {
        APIManager.VolleyResponseListener listener = new APIManager.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                System.out.println(message);
            }

            @Override
            public void onResponse(JSONObject response) {
                try {
                    if (response.getBoolean("success")) {
                        JSONArray products = response.getJSONArray("data");
                        displayProducts(products);
                        calculateTotalPrice(products);
                    } else {
                        System.out.println(response.getString("error"));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        JSONObject data = new JSONObject();
        try {
            // Remplacez "user_id" par l'ID de l'utilisateur actuel
            data.put("user_id", "user_id_value");
            apiManager.apiCall("basket", "getProduct", data, listener);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void displayProducts(JSONArray products) throws JSONException {
        productList.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(getContext());

        for (int i = 0; i < products.length(); i++) {
            JSONObject product = products.getJSONObject(i);
            View productView = inflater.inflate(R.layout.item_product, productList, false);

            TextView productName = productView.findViewById(R.id.productName);
            TextView productDescription = productView.findViewById(R.id.productDescription);
            TextView productQuantity = productView.findViewById(R.id.productQuantity);
            TextView productPrice = productView.findViewById(R.id.productPrice);
            Button deleteButton = productView.findViewById(R.id.deleteButton);

            productName.setText(product.getString("name"));
            productDescription.setText(product.getString("description"));
            productQuantity.setText(getString(R.string.quantity) + ": " + product.getInt("quantity"));
            productPrice.setText(getString(R.string.price) + ": " + product.getDouble("price") + " €");

            deleteButton.setOnClickListener(v -> handleDelete(product.optInt("id")));

            productList.addView(productView);
        }
    }

    private void calculateTotalPrice(JSONArray products) throws JSONException {
        totalPriceValue = 0.0;

        for (int i = 0; i < products.length(); i++) {
            JSONObject product = products.getJSONObject(i);
            totalPriceValue += product.getDouble("price") * product.getInt("quantity");
        }

        totalPrice.setText(getString(R.string.totalPrice) + ": " + String.format("%.2f", totalPriceValue) + " €");
        tvaPrice.setText(getString(R.string.VAT) + ": " + String.format("%.2f", totalPriceValue * tva) + " €");

        checkoutButton.setEnabled(products.length() > 0);
    }

    private void handleDelete(int productId) {
        // Implémentez la logique de suppression ici
    }

    private void handleCheckout() {
        // Implémentez la logique de checkout ici
    }
}

