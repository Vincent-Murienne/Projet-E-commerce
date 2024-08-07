package com.example.airneis.fragment.product;

import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.bumptech.glide.Glide;
import com.example.airneis.R;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.ImageModel;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ProductSliderFragment extends Fragment {
    private ImageView imageView;
    private ArrayList<ImageModel> imageModelList;
    private int currentIndex = 0;
    private Handler handler;
    private Runnable runnable;
    private Button prevButton, nextButton;
    private int productId;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_slider, container, false);
        imageModelList = new ArrayList<>();

        imageView = view.findViewById(R.id.sliderImageView);
        prevButton = view.findViewById(R.id.prevSliderButton);
        nextButton = view.findViewById(R.id.nextSliderButton);

        if (getArguments() != null) {
            productId = getArguments().getInt("productId");
        }

        fetchSliderImages();
        setupAutoSlider();

        prevButton.setOnClickListener(v -> showPreviousImage());
        nextButton.setOnClickListener(v -> showNextImage());

        return view;
    }

    private void fetchSliderImages() {
        APIManager apiManager = new APIManager(getContext());

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
                        JSONArray products = response.getJSONArray("data");
                        for (int i = 0; i < products.length(); i++) {
                            JSONObject product = products.getJSONObject(i);
                            String imageName = product.getString("image_name");
                            imageModelList.add(new ImageModel(imageName));
                        }
                        showCurrentImage();
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    Log.e("JSON Error", e.getMessage());
                    Toast.makeText(getContext(), "Erreur lors de la lecture de la réponse API.", Toast.LENGTH_SHORT).show();
                }
            }
        };

        try {
            apiManager.apiCall("product", "getProductDetail", data, listener);
        } catch (JSONException e) {
            Log.e("API Call Error", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    private void setupAutoSlider() {
        handler = new Handler();
        runnable = new Runnable() {
            @Override
            public void run() {
                showNextImage();
                handler.postDelayed(this, 5000);
            }
        };
        handler.postDelayed(runnable, 5000);
    }

    private void showPreviousImage() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = imageModelList.size() - 1;
        }
        showCurrentImage();
    }

    private void showNextImage() {
        if (currentIndex < imageModelList.size() - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        showCurrentImage();
    }

    private void showCurrentImage() {
        if (!imageModelList.isEmpty()) {
            String imageName = imageModelList.get(currentIndex).getImage();
            int imageResId = getResources().getIdentifier(imageName.split("\\.")[0], "drawable", getContext().getPackageName());

            if (imageResId != 0) {
                Glide.with(getContext())
                        .load(imageResId)
                        .into(imageView);
            } else {
                imageView.setImageDrawable(null);
                Log.d("Image Load", "Image resource not found for " + imageName);
            }
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (handler != null && runnable != null) {
            handler.removeCallbacks(runnable);
        }
    }
}
