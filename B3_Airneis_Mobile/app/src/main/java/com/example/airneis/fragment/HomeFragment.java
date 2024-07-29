package com.example.airneis.fragment;

import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import com.example.airneis.R;

public class HomeFragment extends Fragment {
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        // Load Slider
        FragmentManager fragmentManager = getChildFragmentManager();
        FragmentTransaction transaction = fragmentManager.beginTransaction();
        transaction.replace(R.id.slider_container, new SliderFragment());
        transaction.commit();

        // Load Top Categories and Products
        transaction = fragmentManager.beginTransaction();
        transaction.replace(R.id.top_categories_container, new TopCategoriesFragment());
        transaction.replace(R.id.top_produits_container, new TopProduitsFragment());
        transaction.commit();

        return view;
    }
}
