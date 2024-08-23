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
import java.util.ArrayList;

public class SearchFilterCategoryAdapter extends RecyclerView.Adapter<SearchFilterCategoryAdapter.ViewHolder> {

    private ArrayList<CategoryModel> categories;
    private Context context;
    private ArrayList<Integer> selectedCategories = new ArrayList<>();

    public SearchFilterCategoryAdapter(Context context, ArrayList<CategoryModel> categories) {
        this.context = context;
        this.categories = categories;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.search_item_checkbox, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        CategoryModel category = categories.get(position);
        holder.searchItemTextView.setText(category.getCategoryName());
        holder.searchItemCheckBox.setOnCheckedChangeListener(null);
        holder.searchItemCheckBox.setChecked(selectedCategories.contains(category.getCategoryId()));
        holder.searchItemCheckBox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                selectedCategories.add(category.getCategoryId());
            } else {
                selectedCategories.remove(Integer.valueOf(category.getCategoryId()));
            }
        });
    }

    @Override
    public int getItemCount() {
        return categories.size();
    }public ArrayList<Integer> getSelectedCategories() {
        return selectedCategories;
    }

    public void clearData() {
        categories.clear();
        selectedCategories.clear();
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