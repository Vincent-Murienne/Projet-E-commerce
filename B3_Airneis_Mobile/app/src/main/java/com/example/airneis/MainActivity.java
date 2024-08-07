package com.example.airneis;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.FrameLayout;

import com.example.airneis.fragment.myAccount.AccountFragment;
import com.example.airneis.fragment.basket.BasketFragment;
import com.example.airneis.fragment.categories.CategoryListFragment;
import com.example.airneis.fragment.homePage.HomeFragment;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.example.airneis.databinding.ActivityMainBinding;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private FrameLayout frameLayout;
    private FloatingActionButton fbSearchBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        frameLayout = findViewById(R.id.frameLayout);

        binding.bottomNavigationView.setBackground(null);

        replaceFragment(new HomeFragment());

        binding.bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.navigation_home) {
                replaceFragment(new HomeFragment());
            } else if (itemId == R.id.navigation_categories) {
                replaceFragment(new CategoryListFragment());
            } else if (itemId == R.id.navigation_basket) {
                replaceFragment(new BasketFragment());
            } else if (itemId == R.id.navigation_account) {
                replaceFragment(new AccountFragment());
            }

            return true;
        });

        fbSearchBtn = findViewById(R.id.fbSearchBtn);
        fbSearchBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent search = new Intent(getApplicationContext(), SearchActivity.class);
                startActivity(search);
            }
        });
    }

    private void replaceFragment(Fragment fragment) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.frameLayout, fragment);
        fragmentTransaction.commit();
    }

}