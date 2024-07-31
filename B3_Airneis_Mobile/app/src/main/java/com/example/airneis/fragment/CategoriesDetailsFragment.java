package com.example.airneis.fragment;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.adapter.ProduitsAdapter;
import com.example.airneis.adapter.TopProduitsAdapter;
import com.example.airneis.model.ProduitsData;
import com.example.airneis.model.TopProduitsData;
import com.example.airneis.manager.APIManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class CategoriesDetailsFragment extends Fragment {
    private RecyclerView recyclerView;
    private ProduitsAdapter produitsAdapter;
    private ArrayList<ProduitsData> produitsList;
    private int productId;


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_categories_details, container, false);
        recyclerView = view.findViewById(R.id.recyclerView);
        produitsList = new ArrayList<>();

        // Get productId from arguments
        if (getArguments() != null) {
            productId = getArguments().getInt("productId");
        }

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        produitsAdapter = new ProduitsAdapter(produitsList);
        recyclerView.setAdapter(produitsAdapter);

        fetchProduits();
        return view;
    }

    private void fetchProduits() {
        APIManager apiManager = new APIManager(getContext());

        JSONObject data = new JSONObject();
        try {
            data.put("table", "products");
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
                Log.d("API Response", response.toString());
                try {
                    if (response.getBoolean("success")) {
                        JSONArray products = response.getJSONArray("data");
                        for (int i = 0; i < products.length(); i++) {
                            JSONObject product = products.getJSONObject(i);
                            String imageName = product.getString("image_name");
                            String productName = product.getString("product_name");
                            Double productPrice = product.getDouble("product_price");
                            int productId = product.getInt("product_id");
                            produitsList.add(new ProduitsData(productId, productName, imageName, productPrice));
                        }
                        produitsAdapter.notifyDataSetChanged();
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("category", "getAllCategories", data, listener);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
