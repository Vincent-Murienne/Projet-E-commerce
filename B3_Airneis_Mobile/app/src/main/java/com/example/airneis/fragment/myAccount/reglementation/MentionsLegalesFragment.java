package com.example.airneis.fragment.myAccount.reglementation;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.airneis.R;

public class MentionsLegalesFragment extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View inf = (View) inflater.inflate(R.layout.fragment_mentions_legales, container, false);

        return inf;
    }
}