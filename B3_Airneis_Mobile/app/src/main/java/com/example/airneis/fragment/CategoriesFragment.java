package com.example.airneis.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.Category;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class CategoriesFragment extends Fragment {

    private RecyclerView recyclerView;
    private CategoriesAdapter adapter;
    private List<Category> categories;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_categories, container, false);

        recyclerView = view.findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        categories = new ArrayList<>();
        adapter = new CategoriesAdapter(categories);
        recyclerView.setAdapter(adapter);

        fetchCategories();

        return view;
    }

    private void fetchCategories() {
        APIManager apiManager = new APIManager(getContext());
        try {
            apiManager.apiCall("category", "getAllCategories", new JSONObject(), new APIManager.VolleyResponseListener() {
                @Override
                public void onError(String message) {
                    Toast.makeText(getContext(), "Erreur : " + message, Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onResponse(JSONObject response) {
                    try {
                        if (response.getBoolean("success")) {
                            JSONArray data = response.getJSONArray("data");
                            for (int i = 0; i < data.length(); i++) {
                                JSONObject categoryJson = data.getJSONObject(i);
                                Category category = new Category(
                                        categoryJson.getInt("category_id"),
                                        categoryJson.getString("category_name"),
                                        categoryJson.getString("image_name")
                                );
                                categories.add(category);
                            }
                            adapter.notifyDataSetChanged();
                        } else {
                            Toast.makeText(getContext(), "Erreur : " + response.getString("error"), Toast.LENGTH_SHORT).show();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
