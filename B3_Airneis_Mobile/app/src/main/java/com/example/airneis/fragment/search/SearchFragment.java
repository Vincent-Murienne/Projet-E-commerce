package com.example.airneis.fragment.search;

import static android.content.ContentValues.TAG;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.adapter.SearchFilterCategoryAdapter;
import com.example.airneis.adapter.SearchFilterMaterialAdapter;
import com.example.airneis.adapter.SearchFilterAdapter;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.CategoryModel;
import com.example.airneis.model.MaterialModel;
import com.example.airneis.model.ProductModel;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class SearchFragment extends Fragment {
    private RecyclerView recyclerView;
    private SearchFilterAdapter produitsAdapter;
    private ArrayList<ProductModel> productModelList;
    EditText searchQueryEditText;
    private Button searchFilterBtn;
    private Spinner searchFilterSpinner;
    private String minPrice = "", maxPrice = "";
    private boolean inStock = false;
    private ArrayList<Integer> selectedCategories, selectedMaterials;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_search, container, false);

        selectedCategories = new ArrayList<>();
        selectedMaterials = new ArrayList<>();

        recyclerView = view.findViewById(R.id.productListRecyclerView);
        searchQueryEditText = view.findViewById(R.id.searchQueryEditText);

        productModelList = new ArrayList<>();

        GridLayoutManager gridLayoutManager = new GridLayoutManager(getContext(), 2);
        recyclerView.setLayoutManager(gridLayoutManager);

        produitsAdapter = new SearchFilterAdapter(getActivity(), productModelList);
        recyclerView.setAdapter(produitsAdapter);
        searchFilterSpinner = view.findViewById(R.id.searchFilterSpinner);

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
                getContext(),
                R.array.search_sort,
                android.R.layout.simple_spinner_item
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        searchFilterSpinner.setAdapter(adapter);

        Bundle bundle = getArguments();
        if (bundle != null) {
            String query = bundle.getString("recherche");
            minPrice = bundle.getString("prix_min");
            maxPrice = bundle.getString("prix_max");
            inStock = bundle.getBoolean("en_stock");
            selectedCategories = bundle.getIntegerArrayList("categories");
            selectedMaterials = bundle.getIntegerArrayList("materiaux");
            int orderBySpinnerPosition = bundle.getInt("orderBySpinnerPosition");

            searchQueryEditText.setText(query);
            searchFilterSpinner.setSelection(orderBySpinnerPosition);

            String orderBy = getSortString(searchFilterSpinner.getItemAtPosition(searchFilterSpinner.getSelectedItemPosition()).toString());

            fetchSearchProduits(query, minPrice, maxPrice, inStock, selectedCategories, selectedMaterials, orderBy);
        }

        searchFilterSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selectedSort = parent.getItemAtPosition(position).toString();
                String sortString = getSortString(selectedSort);

                String searchQuery = searchQueryEditText.getText().toString();

                fetchSearchProduits(searchQuery, minPrice, maxPrice, inStock, selectedCategories, selectedMaterials, sortString);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });


        searchFilterBtn = view.findViewById(R.id.searchFilterBtn);

        searchFilterBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Bundle bundle = new Bundle();
                bundle.putString("recherche", searchQueryEditText.getText().toString());
                bundle.putString("prix_min", minPrice);
                bundle.putString("prix_max", maxPrice);
                bundle.putBoolean("en_stock", inStock);
                bundle.putIntegerArrayList("categories", selectedCategories);
                bundle.putIntegerArrayList("materiaux", selectedMaterials);
                bundle.putInt("orderBySpinnerPosition", searchFilterSpinner.getSelectedItemPosition());

                Fragment searchFilterFragment = new SearchFilterFragment();
                searchFilterFragment.setArguments(bundle);

                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                transaction.replace(R.id.frameLayout, searchFilterFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        });

        searchQueryEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                String searchQuery = searchQueryEditText.getText().toString();
                String orderBy = getSortString(searchFilterSpinner.getItemAtPosition(searchFilterSpinner.getSelectedItemPosition()).toString());

                fetchSearchProduits(searchQuery, minPrice, maxPrice, inStock, selectedCategories, selectedMaterials, orderBy);
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });



        return view;
    }

    private String getSortString(String sortItem) {
        switch (sortItem) {
            case "Nom (asc)":
                return "nameAsc";
            case "Nom (desc)":
                return "nameDesc";
            case "Prix (asc)":
                return "priceAsc";
            case "Prix (desc)":
                return "priceDesc";
            case "Quantité en stock (asc)":
                return "quantityInStockAsc";
            case "Quantité en stock (desc)":
                return "quantityInStockDesc";
            default:
                return null;
        }
    }

    private void fetchSearchProduits(String query, String minPrice, String maxPrice, boolean inStock, ArrayList<Integer> categories, ArrayList<Integer> materials, String orderBy) {
        APIManager apiManager = new APIManager(getContext());

        JSONObject data = new JSONObject();
        try {
            data.put("recherche", (query != null && query.isEmpty()) ? JSONObject.NULL : query);
            data.put("prix_min", minPrice.isEmpty() ? JSONObject.NULL : Integer.parseInt(minPrice));
            data.put("prix_max", maxPrice.isEmpty() ? JSONObject.NULL : Integer.parseInt(maxPrice));
            data.put("en_stock", inStock);
            data.put("categories", new JSONArray(categories));
            data.put("materiaux", new JSONArray(materials));
            data.put("orderBy", orderBy != null ? orderBy : JSONObject.NULL);
        } catch (JSONException e) {
            Log.e("SearchFragment", "Error creating JSON object: " + e.getMessage());
            e.printStackTrace();
        }

        APIManager.VolleyResponseListener listener = new APIManager.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Log.e("SearchFragment", "API Error: " + message);
            }
            @Override
            public void onResponse(JSONObject response) {
                try {
                    if (response.getBoolean("success")) {
                        JSONArray products = response.getJSONArray("data");
                        productModelList.clear();
                        for (int i = 0; i < products.length(); i++) {
                            JSONObject product = products.getJSONObject(i);
                            String imageName = product.getString("image_name");
                            String productName = product.getString("produits_nom");
                            double productPrice = product.getDouble("price");
                            int productId = product.getInt("produits_id");
                            productModelList.add(new ProductModel(productId, productName, imageName, productPrice));
                        }
                        produitsAdapter.notifyDataSetChanged();
                    } else {
                        String error = response.getString("error");
                        Log.e("SearchFragment", "API Response Error: " + error);
                        Toast.makeText(getContext(), error, Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    Log.e("SearchFragment", "Error parsing API response: " + e.getMessage());
                    e.printStackTrace();
                }
            }

        };

        try {
            apiManager.apiCall("searchProduct", "getProductByFilter", data, listener);
        } catch (JSONException e) {
            Log.e("SearchFragment", "Error during API call: " + e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

}