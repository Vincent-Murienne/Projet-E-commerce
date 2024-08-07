package com.example.airneis.fragment.categories;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.airneis.R;
import com.example.airneis.adapter.ProductsListAdapter;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.ProductModel;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class CategoryDetailFragment extends Fragment {
    private RecyclerView recyclerView;
    private ImageView categoryImageView;
    private TextView categoryNameTextView;
    private ProductsListAdapter productsListAdapter;
    private ArrayList<ProductModel> produitsList;
    private int categoryId;


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_categories_details, container, false);
        recyclerView = view.findViewById(R.id.recyclerView);
        produitsList = new ArrayList<>();

        // Get productId from arguments
        if (getArguments() != null) {
            categoryId = getArguments().getInt("categoryId");
        }

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false));
        productsListAdapter = new ProductsListAdapter(getActivity(), produitsList);
        recyclerView.setAdapter(productsListAdapter);

        categoryImageView = view.findViewById(R.id.categoryImage);
        categoryNameTextView = view.findViewById(R.id.categoryName);

        fetchProduits();
        return view;
    }

    private void fetchProduits() {
        APIManager apiManager = new APIManager(getContext());

        JSONObject data = new JSONObject();
        try {
            data.put("table", "products");
            data.put("id", categoryId);
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

                        // Set the categoryImage and the categoryName
                        categoryNameTextView.setText("Bienvenue dans la boutique ÀIRNEIS de la catégorie " + products.getJSONObject(0).getString("category_name"));
                        Glide.with(getContext())
                                .load(getContext().getResources().getIdentifier(products.getJSONObject(0).getString("category_image_name").split("\\.")[0], "drawable", getContext().getPackageName()))
                                .into(categoryImageView);

                        for (int i = 0; i < products.length(); i++) {
                            JSONObject product = products.getJSONObject(i);
                            String imageName = product.getString("product_image_name");
                            String productName = product.getString("name");
                            double productPrice = product.getDouble("price");
                            int productId = product.getInt("id");
                            produitsList.add(new ProductModel(productId, productName, imageName, productPrice));
                        }
                        productsListAdapter.notifyDataSetChanged();
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("category", "getCategory", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }
}
