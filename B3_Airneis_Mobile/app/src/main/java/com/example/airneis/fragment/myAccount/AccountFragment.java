package com.example.airneis.fragment.myAccount;

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
import com.example.airneis.fragment.myAccount.loginRegister.LoginFragment;
import com.example.airneis.fragment.myAccount.loginRegister.RegisterFragment;
import com.example.airneis.fragment.myAccount.orders.OrdersFragment;
import com.example.airneis.fragment.myAccount.reglementation.AProposFragment;
import com.example.airneis.fragment.myAccount.reglementation.CguFragment;
import com.example.airneis.fragment.myAccount.reglementation.ContactFragment;
import com.example.airneis.fragment.myAccount.reglementation.MentionsLegalesFragment;

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

        reloadUI();
        binding.buttonMesCommandes.setOnClickListener(v -> openFragment("mesCommandes"));
        binding.buttonContact.setOnClickListener(v -> openFragment("contact"));
        binding.buttonSeConnecter.setOnClickListener(v -> openFragment("login"));
        binding.buttonSeDeconnecter.setOnClickListener(v -> logout());
        binding.buttonSinscrire.setOnClickListener(v -> openFragment("register"));
        binding.buttonCgu.setOnClickListener(v -> openFragment("cgu"));
        binding.buttonMentionsLegales.setOnClickListener(v -> openFragment("mentionsLegales"));
        binding.buttonAPropos.setOnClickListener(v -> openFragment("aPropos"));
        binding.buttonParametresCompte.setOnClickListener(v -> openFragment("parametreCompte"));
    }

    private void reloadUI() {
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        boolean isConnected = sharedPref.getBoolean("isConnected", false);

        if (isConnected) {
            binding.buttonSeConnecter.setVisibility(View.GONE);
            binding.buttonSinscrire.setVisibility(View.GONE);
            binding.buttonParametresCompte.setVisibility(View.VISIBLE);
            binding.buttonMesCommandes.setVisibility(View.VISIBLE);
            binding.buttonSeDeconnecter.setVisibility(View.VISIBLE);
        } else {
            binding.buttonSeConnecter.setVisibility(View.VISIBLE);
            binding.buttonSinscrire.setVisibility(View.VISIBLE);
            binding.buttonParametresCompte.setVisibility(View.GONE);
            binding.buttonMesCommandes.setVisibility(View.GONE);
            binding.buttonSeDeconnecter.setVisibility(View.GONE);
        }
    }

    private void openFragment(String page) {
        Fragment fragment = null;

        switch(page){
            case "mesCommandes":
                fragment = new OrdersFragment();
                break;
            case "contact":
                fragment = new ContactFragment();
                break;
            case "cgu":
                fragment = new CguFragment();
                break;
            case "login":
                fragment = new LoginFragment();
                break;
            case "register":
                fragment = new RegisterFragment();
                break;
            case "mentionsLegales":
                fragment = new MentionsLegalesFragment();
                break;
            case "aPropos":
                fragment = new AProposFragment();
                break;
            case "parametreCompte":
                fragment = new ParametreCompteFragment();
                break;
        }

        if (fragment != null) {
            FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
            transaction.replace(R.id.frameLayout, fragment);
            transaction.addToBackStack(null);
            transaction.commit();
        }
    }

    private void logout() {
        // Clear login state
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putBoolean("isConnected", false);
        editor.apply();

        reloadUI();

        Toast.makeText(getActivity(), "Déconnexion réussie", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
