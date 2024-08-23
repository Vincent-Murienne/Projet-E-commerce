package com.example.airneis.fragment.search;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.adapter.SearchFilterCategoryAdapter;
import com.example.airneis.adapter.SearchFilterMaterialAdapter;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.CategoryModel;
import com.example.airneis.model.MaterialModel;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class SearchFilterFragment extends Fragment {

    private Button exitButton;
    private Button applyButton;
    private EditText searchQueryFilterEditText;
    private EditText minPriceEditText;
    private EditText maxPriceEditText;
    private CheckBox inStockCheckBox;
    private Button resetButton;

    private RecyclerView categoriesRecyclerView;
    private SearchFilterCategoryAdapter searchFilterCategoryAdapter;
    private ArrayList<CategoryModel> categoryModelList = new ArrayList<>();
    private RecyclerView materialsRecyclerView;
    private SearchFilterMaterialAdapter searchFilterMaterialAdapter;
    private ArrayList<MaterialModel> materialModelList = new ArrayList<>();


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_search_filter, container, false);

        searchQueryFilterEditText = view.findViewById(R.id.searchQueryFilterEditText);
        minPriceEditText = view.findViewById(R.id.minPriceEditText);
        maxPriceEditText = view.findViewById(R.id.maxPriceEditText);
        inStockCheckBox = view.findViewById(R.id.inStockCheckBox);

        if (getArguments() != null) {
            String query = getArguments().getString("recherche");
            String minPrice = getArguments().getString("prix_min");
            String maxPrice = getArguments().getString("prix_max");
            boolean inStock = getArguments().getBoolean("en_stock");

            Log.d("SearchFilterFragment", "Received from Bundle - Query: " + query + ", MinPrice: " + minPrice + ", MaxPrice: " + maxPrice + ", InStock: " + inStock);

            searchQueryFilterEditText.setText(query);
            minPriceEditText.setText(minPrice);
            maxPriceEditText.setText(maxPrice);
            inStockCheckBox.setChecked(inStock);
        }

        exitButton = view.findViewById(R.id.exitButton);
        applyButton = view.findViewById(R.id.applyButton);
        searchQueryFilterEditText = view.findViewById(R.id.searchQueryFilterEditText);
        minPriceEditText = view.findViewById(R.id.minPriceEditText);
        maxPriceEditText = view.findViewById(R.id.maxPriceEditText);
        inStockCheckBox = view.findViewById(R.id.inStockCheckBox);
        resetButton = view.findViewById(R.id.resetButton);

        categoriesRecyclerView = view.findViewById(R.id.searchCategoriesRecyclerView);
        categoriesRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        searchFilterCategoryAdapter = new SearchFilterCategoryAdapter(getContext(), categoryModelList);
        categoriesRecyclerView.setAdapter(searchFilterCategoryAdapter);

        materialsRecyclerView = view.findViewById(R.id.searchMaterialsRecyclerView);
        materialsRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        searchFilterMaterialAdapter = new SearchFilterMaterialAdapter(getContext(), materialModelList);
        materialsRecyclerView.setAdapter(searchFilterMaterialAdapter);

        if (getArguments() != null) {
            String query = getArguments().getString("recherche");
            searchQueryFilterEditText.setText(query);
        }

        applyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String query = searchQueryFilterEditText.getText().toString();
                String minPrice = minPriceEditText.getText().toString();
                String maxPrice = maxPriceEditText.getText().toString();
                boolean inStock = inStockCheckBox.isChecked();

                Log.d("SearchFilterFragment", "Applying filters - Query: " + query + ", MinPrice: " + minPrice + ", MaxPrice: " + maxPrice + ", InStock: " + inStock);

                ArrayList<Integer> selectedCategories = searchFilterCategoryAdapter.getSelectedCategories();
                ArrayList<Integer> selectedMaterials = searchFilterMaterialAdapter.getSelectedMaterials();

                Bundle bundle = new Bundle();
                bundle.putString("recherche", query);
                bundle.putString("prix_min", minPrice);
                bundle.putString("prix_max", maxPrice);
                bundle.putBoolean("en_stock", inStock);
                bundle.putIntegerArrayList("categories", selectedCategories);
                bundle.putIntegerArrayList("materiaux", selectedMaterials);

                Fragment searchFragment = new SearchFragment();
                searchFragment.setArguments(bundle);

                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                transaction.replace(R.id.frameLayout, searchFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        });

        exitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navigateToSearchFragment();
            }
        });

        resetButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                resetFilterFields();
            }
        });

        fetchCategories();
        fetchMaterials();

        return view;
    }

    private void fetchCategories() {
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
                try {if (response.getBoolean("success")) {
                    categoryModelList.clear();
                    JSONArray categories = response.getJSONArray("data");
                    for (int i = 0; i < categories.length(); i++) {
                        JSONObject category = categories.getJSONObject(i);
                        int categoryId = category.getInt("id");
                        String categoryName = category.getString("name");
                        categoryModelList.add(new CategoryModel(categoryId, categoryName, ""));
                    }
                    searchFilterCategoryAdapter.notifyDataSetChanged();
                } else {
                    Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("panelAdmin", "getAllFromTable", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    private void fetchMaterials() {
        APIManager apiManager = new APIManager(getContext());

        JSONObject data = new JSONObject();
        try {
            data.put("table", "materials_list");
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
                try {if (response.getBoolean("success")) {
                    materialModelList.clear();
                    JSONArray materials = response.getJSONArray("data");
                    for (int i = 0; i < materials.length(); i++) {
                        JSONObject material = materials.getJSONObject(i);
                        int materialId = material.getInt("id");
                        String materialName = material.getString("name");
                        materialModelList.add(new MaterialModel(materialId, materialName));
                    }
                    searchFilterMaterialAdapter.notifyDataSetChanged();
                } else {
                    Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("panelAdmin", "getAllFromTable", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    private void resetFilterFields() {
        searchQueryFilterEditText.setText(null);
        minPriceEditText.setText(null);
        maxPriceEditText.setText(null);
        inStockCheckBox.setChecked(false);

        searchFilterMaterialAdapter.clearData();
        searchFilterCategoryAdapter.clearData();
    }

    private void navigateToSearchFragment() {
        Fragment searchFragment = new SearchFragment();

        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.frameLayout, searchFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

}