package com.example.airneis.fragment;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.airneis.R;
import com.example.airneis.databinding.FragmentAProposBinding;

public class AProposFragment extends Fragment {

    private FragmentAProposBinding binding; // Déclaration du binding

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentAProposBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Set click listeners for social media icons
        binding.imageFacebook.setOnClickListener(v -> openUrl("https://www.facebook.com/profile.php?id=61560438473857"));
        binding.imageTwitter.setOnClickListener(v -> openUrl("https://x.com/airneiscommerce"));
        binding.imageInstagram.setOnClickListener(v -> openUrl("https://www.instagram.com/airneis.commerce/"));
        binding.imageLinkedIn.setOnClickListener(v -> openUrl("https://www.linkedin.com/in/%C3%A0irneis-%C3%A0irneis-b16433310/"));
    }

    private void openUrl(String url) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse(url));
        startActivity(intent);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null; // Nullify binding reference to avoid memory leaks
    }
}
