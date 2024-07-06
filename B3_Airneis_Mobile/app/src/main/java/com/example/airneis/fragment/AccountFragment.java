package com.example.airneis.fragment;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.airneis.R;
import com.example.airneis.databinding.FragmentAccountBinding;

public class AccountFragment extends Fragment {

    private FragmentAccountBinding binding;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentAccountBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Check login state
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        boolean isLoggedIn = sharedPref.getBoolean("isLoggedIn", false);

        if (isLoggedIn) {
            binding.buttonSeConnecter.setVisibility(View.GONE);
            binding.buttonSinscrire.setVisibility(View.GONE);
            binding.buttonParametreCompte.setVisibility(View.VISIBLE);
            binding.buttonMesCommandes.setVisibility(View.VISIBLE);
            binding.buttonSeDeconnecter.setVisibility(View.VISIBLE);
        } else {
            binding.buttonSeConnecter.setVisibility(View.VISIBLE);
            binding.buttonSinscrire.setVisibility(View.VISIBLE);
            binding.buttonParametreCompte.setVisibility(View.GONE);
            binding.buttonMesCommandes.setVisibility(View.GONE);
            binding.buttonSeDeconnecter.setVisibility(View.GONE);
        }

        binding.buttonPanier.setOnClickListener(v -> openBasketFragment());
        binding.buttonSeConnecter.setOnClickListener(v -> openLoginFragment());
        binding.buttonSeDeconnecter.setOnClickListener(v -> logout());
        binding.buttonSinscrire.setOnClickListener(v -> openRegisterFragment());
        binding.buttonCgu.setOnClickListener(v -> openCguFragment());
        binding.buttonMentionsLegales.setOnClickListener(v -> openMentionsLegalesFragment());
        binding.buttonAPropos.setOnClickListener(v -> openAProposFragment());
        /*binding.buttonParametreCompte.setOnClickListener(v -> openBasketFragment());
        binding.buttonMesCommandes.setOnClickListener(v -> openBasketFragment());*/
    }

    private void openBasketFragment() {
        BasketFragment basketFragment = new BasketFragment();
        FragmentTransaction transaction =  getActivity().getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.frameLayout, basketFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void openLoginFragment() {
        LoginFragment loginFragment = new LoginFragment();
        FragmentTransaction transaction =  getActivity().getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.frameLayout, loginFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void openRegisterFragment() {
        RegisterFragment registerFragment = new RegisterFragment();
        FragmentTransaction transaction =  getActivity().getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.frameLayout, registerFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void openCguFragment() {
        CguFragment cguFragment = new CguFragment();
        FragmentTransaction transaction =  getActivity().getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.frameLayout, cguFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void openMentionsLegalesFragment() {
        MentionsLegalesFragment mentionsLegalesFragment = new MentionsLegalesFragment();
        FragmentTransaction transaction =  getActivity().getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.frameLayout, mentionsLegalesFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void openAProposFragment() {
        AProposFragment aProposFragment = new AProposFragment();
        FragmentTransaction transaction =  getActivity().getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.frameLayout, aProposFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void logout() {
        // Clear login state
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putBoolean("isLoggedIn", false);
        editor.apply();

        // Update UI
        binding.buttonSeConnecter.setVisibility(View.VISIBLE);
        binding.buttonSinscrire.setVisibility(View.VISIBLE);
        binding.buttonSeDeconnecter.setVisibility(View.GONE);

        // Optional: Show logout message
        Toast.makeText(getActivity(), "Déconnexion réussi", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
