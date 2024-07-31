package com.example.airneis.adapter;

import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.airneis.R;
import com.example.airneis.model.BasketData;

import java.util.ArrayList;

public class BasketAdapter extends RecyclerView.Adapter<BasketAdapter.BasketViewHolder> {

    private ArrayList<BasketData> basketList;
    private OnItemClickListener listener;

    public interface OnItemClickListener {
        void onDeleteClick(int position);

        void onQuantityChange(int position, int quantity);
    }

    public BasketAdapter(ArrayList<BasketData> basketList, OnItemClickListener listener) {
        this.basketList = basketList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public BasketViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.basket_item, parent, false);
        return new BasketViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull final BasketViewHolder holder, int position) {
        final BasketData currentItem = basketList.get(position);

        holder.productName.setText(currentItem.getName());
        holder.productDescription.setText(currentItem.getDescription());
        holder.productPrice.setText(String.format("%.2f €", currentItem.getPrice()));
        holder.productQuantity.setText(String.valueOf(currentItem.getQuantity()));
        Glide.with(holder.itemView.getContext())
                .load(holder.itemView.getContext().getResources().getIdentifier(currentItem.getImageName().split("\\.")[0], "drawable", holder.itemView.getContext().getPackageName()))
                .into(holder.productImage);

        if (currentItem.getStock() == 0) {
            holder.itemView.setAlpha(0.5f);
            holder.outOfStock.setVisibility(View.VISIBLE);
            holder.productQuantity.setEnabled(false);
            holder.deleteButton.setEnabled(true);
            holder.productQuantity.setText("0");
        } else if (currentItem.getQuantity() > currentItem.getStock()) {
            holder.productQuantity.setText(String.valueOf(currentItem.getStock()));
        }

        holder.productQuantity.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void afterTextChanged(Editable editable) {
                int quantity = 1;
                try {
                    quantity = Integer.parseInt(editable.toString());
                } catch (NumberFormatException e) {
                }
                if (quantity < 1) {
                    quantity = 1;
                    holder.productQuantity.setText(String.valueOf(quantity));
                } else if (quantity > currentItem.getStock() && currentItem.getStock() != 0) {
                    quantity = currentItem.getStock();
                    holder.productQuantity.setText(String.valueOf(quantity));
                }
                listener.onQuantityChange(holder.getAdapterPosition(), quantity);
            }
        });

        holder.deleteButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                listener.onDeleteClick(holder.getAdapterPosition());
            }
        });
    }


    @Override
    public int getItemCount() {
        return basketList.size();
    }

    public static class BasketViewHolder extends RecyclerView.ViewHolder {
        public ImageView productImage;
        public TextView productName;
        public TextView productDescription;
        public TextView productPrice;
        public EditText productQuantity;
        public Button deleteButton;
        public TextView outOfStock;

        public BasketViewHolder(@NonNull View itemView) {
            super(itemView);
            productImage = itemView.findViewById(R.id.productImage);
            productName = itemView.findViewById(R.id.productName);
            productDescription = itemView.findViewById(R.id.productDescription);
            productPrice = itemView.findViewById(R.id.productPrice);
            productQuantity = itemView.findViewById(R.id.productQuantity);
            deleteButton = itemView.findViewById(R.id.deleteButton);
            outOfStock = itemView.findViewById(R.id.outOfStock);
        }
    }
}

