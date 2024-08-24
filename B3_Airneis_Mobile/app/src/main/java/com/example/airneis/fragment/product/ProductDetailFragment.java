package com.example.airneis.fragment.product;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.example.airneis.R;
import com.example.airneis.adapter.ProductsListAdapter;
import com.example.airneis.fragment.homePage.SliderFragment;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.ProductModel;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;


public class ProductDetailFragment extends Fragment {
    private TextView productNameTv, productPriceTv, stockStatusTv, productDescriptionTv, productMaterialTv;
    private EditText productQuantityEt;
    private Button addToCartButton;
    private RecyclerView recyclerView;
    private ArrayList<ProductModel> productModelList;
    private ProductsListAdapter productsListAdapter;
    private APIManager apiManager;
    private int productId = -1;
    private int userId, productQuantity, currentQuantity;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = (View) inflater.inflate(R.layout.fragment_product_detail, container, false);

        productNameTv = view.findViewById(R.id.productName);
        productPriceTv = view.findViewById(R.id.productPrice);
        stockStatusTv = view.findViewById(R.id.stockStatus);
        productDescriptionTv = view.findViewById(R.id.productDescription);
        productMaterialTv = view.findViewById(R.id.productMaterial);
        productQuantityEt = view.findViewById(R.id.productQuantity);
        addToCartButton = view.findViewById(R.id.addToCartButton);
        recyclerView = view.findViewById(R.id.similarProductsRecyclerView);
        productModelList = new ArrayList<>();

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false));
        productsListAdapter = new ProductsListAdapter(getActivity(), productModelList);
        recyclerView.setAdapter(productsListAdapter);

        apiManager = new APIManager(getContext());

        if (getArguments() != null) {
            productId = getArguments().getInt("productId");
        }

        // Load ProductSlider
        Fragment productSliderFragment = new ProductSliderFragment();

        Bundle args = new Bundle();
        args.putInt("productId", productId);
        productSliderFragment.setArguments(args);

        FragmentManager fragmentManager = getChildFragmentManager();
        FragmentTransaction transaction = fragmentManager.beginTransaction();
        transaction.replace(R.id.slider_container, productSliderFragment);
        transaction.commit();

        // Load product details data
        getProductDetails();

        addToCartButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(currentQuantity == 0) {
                    Toast.makeText(getContext(), "Vous ne pouvez pas ajouter 0 quantité de ce produits dans votre panier.", Toast.LENGTH_SHORT).show();
                } else {
                    // Check if user is connected
                    SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
                    boolean isConnected = sharedPref.getBoolean("isConnected", false);
                    if(isConnected) {
                        userId = sharedPref.getInt("userId", -1);
                        addProductToCart();
                    } else {
                        Toast.makeText(getContext(), "Vous devez être connecté afin de pouvoir ajouter un produit dans votre panier.", Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });

        return view;
    }

    private void getProductDetails() {
        JSONObject data = new JSONObject();
        try {
            data.put("table", "products");
            data.put("id", productId);
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
                try {
                    if (response.getBoolean("success")) {
                        JSONObject product = response.getJSONArray("data").getJSONObject(0);

                        productNameTv.setText(product.getString("name"));
                        productPriceTv.setText(product.getDouble("price") + " €");
                        productQuantity = product.getInt("quantity");
                        stockStatusTv.setText(productQuantity > 0 ? "En stock" : "Hors stock");
                        productDescriptionTv.setText(product.getString("description"));

                        String material = product.getString("material");
                        if(!material.equals("null")) {
                            productMaterialTv.setVisibility(View.VISIBLE);
                            productMaterialTv.setText("Conçu avec des matériaux de qualité supérieur, fait de " + material);
                        } else {
                            productMaterialTv.setVisibility(View.GONE);
                        }

                        // We configure the edit text of the quantity
                        if (productQuantity == 0) {
                            addToCartButton.setEnabled(false);
                            productQuantityEt.setEnabled(false);
                            productQuantityEt.setText("0");
                            currentQuantity = 0;
                        } else {
                            addToCartButton.setEnabled(true);
                            productQuantityEt.setEnabled(true);
                            productQuantityEt.setText("1");
                            currentQuantity = 1;
                        }

                        productQuantityEt.addTextChangedListener(new TextWatcher() {
                            @Override
                            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                            }

                            @Override
                            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                            }

                            @Override
                            public void afterTextChanged(Editable editable) {
                                int quantity = 1;
                                try {
                                    quantity = Integer.parseInt(editable.toString());
                                } catch (NumberFormatException e) {
                                }
                                if (quantity < 1) {
                                    quantity = 1;
                                    productQuantityEt.setText(String.valueOf(quantity));
                                } else if (quantity > productQuantity && productQuantity != 0) {
                                    quantity = productQuantity;
                                    productQuantityEt.setText(String.valueOf(quantity));
                                }

                                currentQuantity = quantity;
                            }
                        });

                        // We perform a new API Call to get similar products
                        int categoryId = product.getInt("category_id");
                        getSimilarProduct(categoryId);
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("product", "getProductDetail", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    private void getSimilarProduct(int categoryId) {
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
                try {
                    if (response.getBoolean("success")) {
                        JSONArray products = response.getJSONArray("data");

                        for (int i = 0; i < products.length(); i++) {
                            JSONObject product = products.getJSONObject(i);
                            String imageName = product.getString("product_image_name");
                            String productName = product.getString("name");
                            double productPrice = product.getDouble("price");
                            int product_id = product.getInt("id");
                            if(product_id != productId) {
                                productModelList.add(new ProductModel(product_id, productName, imageName, productPrice));
                            }
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
            apiManager.apiCall("product", "getProductSimilaire", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    private void addProductToCart() {
        JSONObject data = new JSONObject();
        try {
            data.put("user_id", userId);
            data.put("product_id", productId);
            data.put("quantity", currentQuantity);
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
                        Toast.makeText(getContext(), "L'élément a bien été ajouté au panier.", Toast.LENGTH_SHORT).show();
                        currentQuantity = 1;
                        productQuantityEt.setText("1");
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("basket", "insertBasket", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }
}