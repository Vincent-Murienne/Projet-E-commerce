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
import com.example.airneis.adapter.TopCategoriesAdapter;
import com.example.airneis.model.TopCategoriesData;
import com.example.airneis.manager.APIManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class TopCategoriesFragment extends Fragment {
    private RecyclerView recyclerView;
    private TopCategoriesAdapter categoriesAdapter;
    private ArrayList<TopCategoriesData> topCategoriesList;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_top_categories, container, false);
        recyclerView = view.findViewById(R.id.recyclerView);
        topCategoriesList = new ArrayList<>();

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        categoriesAdapter = new TopCategoriesAdapter(topCategoriesList);
        recyclerView.setAdapter(categoriesAdapter);

        fetchTopCategories();
        return view;
    }

    private void fetchTopCategories() {
        APIManager apiManager = new APIManager(getContext());

        JSONObject data = new JSONObject();
        try {
            data.put("table", "categories");
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
                        JSONArray categories = response.getJSONArray("data");
                        for (int i = 0; i < categories.length(); i++) {
                            JSONObject category = categories.getJSONObject(i);
                            String imageName = category.getString("image_name");
                            String categoryName = category.getString("category_name");
                            int categoryId = category.getInt("category_id");
                            topCategoriesList.add(new TopCategoriesData(categoryId, categoryName, imageName));
                        }
                        categoriesAdapter.notifyDataSetChanged();
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
