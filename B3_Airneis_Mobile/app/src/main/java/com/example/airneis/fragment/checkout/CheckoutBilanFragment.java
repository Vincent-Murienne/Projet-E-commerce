package com.example.airneis.fragment.checkout;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.airneis.R;
import com.example.airneis.fragment.homePage.HomeFragment;
import com.example.airneis.fragment.myAccount.EditAccountFragment;
import com.example.airneis.fragment.myAccount.MyAddressesFragment;
import com.example.airneis.manager.APIManager;
import com.opencsv.CSVWriter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class CheckoutBilanFragment extends Fragment {
    private int orderId;
    private TextView text;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = (View) inflater.inflate(R.layout.fragment_checkout_confirmer, container, false);

        text = view.findViewById(R.id.tv_order_id);

        if (getArguments() != null) {
            orderId = getArguments().getInt("orderId");
        }

        text.setText("Votre commande a bien été enregistrée sous le numéro " + orderId + ". Vous pouvez suivre son état depuis votre espace client.");

        return view;
    }

}