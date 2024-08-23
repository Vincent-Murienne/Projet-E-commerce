package com.example.airneis.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.model.CategoryModel;
import com.example.airneis.model.MaterialModel;

import java.util.ArrayList;

public class SearchFilterMaterialAdapter extends RecyclerView.Adapter<SearchFilterMaterialAdapter.ViewHolder> {

    private ArrayList<MaterialModel> materials;
    private Context context;
    private ArrayList<Integer> selectedMaterials = new ArrayList<>();

    public SearchFilterMaterialAdapter(Context context, ArrayList<MaterialModel> materials) {
        this.context = context;
        this.materials = materials;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.search_item_checkbox, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        MaterialModel material = materials.get(position);
        holder.searchItemTextView.setText(material.getMaterialName());
        holder.searchItemCheckBox.setOnCheckedChangeListener(null);
        holder.searchItemCheckBox.setChecked(selectedMaterials.contains(material.getMaterialId()));
        holder.searchItemCheckBox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                selectedMaterials.add(material.getMaterialId());
            } else {
                selectedMaterials.remove(Integer.valueOf(material.getMaterialId()));
            }
        });
    }

    @Override
    public int getItemCount() {
        return materials.size();
    }public ArrayList<Integer> getSelectedMaterials() {
        return selectedMaterials;
    }

    public void clearData() {
        materials.clear();
        selectedMaterials.clear();
        notifyDataSetChanged();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView searchItemTextView;
        CheckBox searchItemCheckBox;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            searchItemTextView = itemView.findViewById(R.id.searchItemTextView);
            searchItemCheckBox = itemView.findViewById(R.id.searchItemCheckBox);
        }
    }
}