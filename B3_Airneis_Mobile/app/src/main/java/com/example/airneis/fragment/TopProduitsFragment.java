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
import com.example.airneis.adapter.TopProduitsAdapter;
import com.example.airneis.model.TopProduitsData;
import com.example.airneis.manager.APIManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class TopProduitsFragment extends Fragment {
    private RecyclerView recyclerView;
    private TopProduitsAdapter produitsAdapter;
    private ArrayList<TopProduitsData> topProduitsList;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_top_produits, container, false);
        recyclerView = view.findViewById(R.id.recyclerView);
        topProduitsList = new ArrayList<>();

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        produitsAdapter = new TopProduitsAdapter(topProduitsList);
        recyclerView.setAdapter(produitsAdapter);

        fetchTopProduits();
        return view;
    }

    private void fetchTopProduits() {
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
                            int productId = product.getInt("product_id");
                            topProduitsList.add(new TopProduitsData(productId, productName, imageName));
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
            apiManager.apiCall("panelAdmin", "getTop", data, listener);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
