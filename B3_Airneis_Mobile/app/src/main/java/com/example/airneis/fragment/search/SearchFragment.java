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
    private EditText minPriceEditText;
    private EditText maxPriceEditText;
    private CheckBox inStockCheckBox;

    private Button searchFilterBtn;
    private Spinner searchFilterSpinner;

    private SearchFilterCategoryAdapter searchFilterCategoryAdapter;
    private SearchFilterMaterialAdapter searchFilterMaterialAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_search, container, false);
        View searchFilterView = inflater.inflate(R.layout.fragment_search_filter, container, false);

        Bundle bundle = getArguments();
        if (bundle != null) {
            String query = bundle.getString("recherche");
            String minPrice = bundle.getString("prix_min");
            String maxPrice = bundle.getString("prix_max");
            boolean inStock = bundle.getBoolean("en_stock");
            ArrayList<Integer> selectedCategories = bundle.getIntegerArrayList("categories");
            ArrayList<Integer> selectedMaterials = bundle.getIntegerArrayList("materiaux");

            Log.d("SearchFragment", "Received from Bundle - Query: " + query + ", MinPrice: " + minPrice + ", MaxPrice: " + maxPrice + ", InStock: " + inStock);
            fetchSearchProduits(query, minPrice, maxPrice, inStock, selectedCategories, selectedMaterials); //, selectedCategories, selectedMaterials);
        }

        recyclerView = view.findViewById(R.id.productListRecyclerView);
        searchQueryEditText = view.findViewById(R.id.searchQueryEditText);


        minPriceEditText = searchFilterView.findViewById(R.id.minPriceEditText);
        maxPriceEditText = searchFilterView.findViewById(R.id.maxPriceEditText);
        inStockCheckBox = searchFilterView.findViewById(R.id.inStockCheckBox);
        RecyclerView categoryRecyclerView = searchFilterView.findViewById(R.id.searchCategoriesRecyclerView);
        RecyclerView materialRecyclerView = searchFilterView.findViewById(R.id.searchMaterialsRecyclerView);

        ArrayList<CategoryModel> categoryList = new ArrayList<>();
        searchFilterCategoryAdapter = new SearchFilterCategoryAdapter(getContext(), categoryList);
        categoryRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        categoryRecyclerView.setAdapter(searchFilterCategoryAdapter);

        ArrayList<MaterialModel> materialList = new ArrayList<>();
        searchFilterMaterialAdapter = new SearchFilterMaterialAdapter(getContext(), materialList);
        materialRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        materialRecyclerView.setAdapter(searchFilterMaterialAdapter);


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

        searchFilterSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selectedSort = parent.getItemAtPosition(position).toString();
                Log.d(TAG, "Selected sort order: " + selectedSort);
                sortProducts(selectedSort);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                Log.d(TAG, "No sort order selected");
                // Aucun tri
            }
        });


        searchFilterBtn = view.findViewById(R.id.searchFilterBtn);

        searchFilterBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Bundle bundle = new Bundle();
                bundle.putString("recherche", searchQueryEditText.getText().toString());
                bundle.putString("prix_min", minPriceEditText.getText().toString());
                bundle.putString("prix_max", maxPriceEditText.getText().toString());
                bundle.putBoolean("en_stock", inStockCheckBox.isChecked());
                bundle.putIntegerArrayList("categories", new ArrayList<>());
                bundle.putIntegerArrayList("materiaux", new ArrayList<>());

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
                Log.d("SearchFragment", "Search query: " + s.toString());
                String searchQuery = searchQueryEditText.getText().toString();
                String minPrice = minPriceEditText.getText().toString();
                String maxPrice = maxPriceEditText.getText().toString();
                boolean inStock = inStockCheckBox.isChecked();
                ArrayList<Integer> selectedCategories = searchFilterCategoryAdapter.getSelectedCategories();
                ArrayList<Integer> selectedMaterials = searchFilterMaterialAdapter.getSelectedMaterials();

                fetchSearchProduits(searchQuery, minPrice, maxPrice, inStock, selectedCategories, selectedMaterials);
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });



        return view;
    }

    private void sortProducts(String sortOrder) {
        Log.d(TAG, "Sorting products by: " + sortOrder);
        switch (sortOrder) {
            case "nameAsc":
                productModelList.sort((p1, p2) -> p1.getProductName().compareTo(p2.getProductName()));
                break;
            case "nameDesc":
                productModelList.sort((p1, p2) -> p2.getProductName().compareTo(p1.getProductName()));
                break;
            case "priceAsc":
                productModelList.sort((p1, p2) -> Double.compare(p1.getProductPrice(), p2.getProductPrice()));
                break;
            case "priceDesc":
                productModelList.sort((p1, p2) -> Double.compare(p2.getProductPrice(), p1.getProductPrice()));
                break;
            case "quantityInStockAsc":
                productModelList.sort((p1, p2) -> Integer.compare(p1.getProductQuantity(), p2.getProductQuantity()));
                break;
            case "quantityInStockDesc":
                productModelList.sort((p1, p2) -> Integer.compare(p2.getProductQuantity(), p1.getProductQuantity()));
                break;
            default:
                Log.d(TAG, "No sorting applied");
                break; // Aucun tri
        }
        produitsAdapter.notifyDataSetChanged(); // Notifier l'adaptateur que les données ont changé
        Log.d(TAG, "Products sorted. Total products: " + productModelList.size());
    }

    private void fetchSearchProduits(String query, String minPrice, String maxPrice, boolean inStock, ArrayList<Integer> categories, ArrayList<Integer> materials) {
        Log.d("SearchFragment", "Fetching products for query: " + query);

        APIManager apiManager = new APIManager(getContext());

        query = (query != null && query.isEmpty()) ? null : query;
        minPrice = minPrice.isEmpty() ? null : minPrice;
        maxPrice = maxPrice.isEmpty() ? null : maxPrice;

        JSONObject data = new JSONObject();
        try {
            data.put("recherche", query);
            data.put("prix_min", minPrice);
            data.put("prix_max", maxPrice);
            data.put("en_stock", inStock);
            data.put("categories", new JSONArray(categories));
            data.put("materiaux", new JSONArray(materials));
            Log.d("SearchFragment", "Data sent to API: " + data.toString());
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
                    Log.d("SearchFragment", "API Response: " + response.toString());

                    if (response.getBoolean("success")) {
                        Log.d("debug", "API Response Success");
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
                        Log.d("SearchFragment", "Products list updated, total: " + productModelList.size());
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