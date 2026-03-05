package com.example.inventory.controller;

import com.example.inventory.model.Sale;
import com.example.inventory.service.SaleService;
import com.example.inventory.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @Autowired
    private PdfService pdfService;

    @PostMapping
    public Sale createSale(@RequestParam Long productId, @RequestParam int quantity, @RequestParam(defaultValue = "0") double discount) {
        return saleService.createSale(productId, quantity, discount);
    }

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {
        Sale sale = saleService.getAllSales().stream().filter(s -> s.getId().equals(id)).findFirst().orElse(null);
        if (sale == null) {
            return ResponseEntity.notFound().build();
        }
        byte[] pdf = pdfService.generateInvoice(sale);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice_" + id + ".pdf");
        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}