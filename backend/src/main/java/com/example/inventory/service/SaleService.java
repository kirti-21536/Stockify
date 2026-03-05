package com.example.inventory.service;

import com.example.inventory.model.Product;
import com.example.inventory.model.Sale;
import com.example.inventory.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductService productService;

    public Sale createSale(Long productId, int quantity, double discountPercent) {
        Product product = productService.getProductById(productId).orElseThrow();
        double unitPrice = product.getPrice();
        double subtotal = unitPrice * quantity;
        double discount = subtotal * (discountPercent / 100);
        double taxableAmount = subtotal - discount;
        double tax = taxableAmount * 0.1; // 10% tax
        double totalPrice = taxableAmount + tax;
        Sale sale = new Sale(product, quantity, unitPrice, tax, discount, totalPrice, LocalDateTime.now());
        productService.updateStock(productId, quantity);
        return saleRepository.save(sale);
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }
}