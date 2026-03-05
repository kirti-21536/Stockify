package com.example.inventory.service;

import com.example.inventory.model.Sale;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.stream.Stream;

@Service
public class PdfService {

    public byte[] generateInvoice(Sale sale) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Brand Header
            Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, new BaseColor(99, 102, 241));
            Paragraph brand = new Paragraph("Stockify", brandFont);
            brand.setAlignment(Element.ALIGN_RIGHT);
            document.add(brand);

            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.GRAY);
            Paragraph subHeader = new Paragraph("Professional Shop & Inventory Suite", subHeaderFont);
            subHeader.setAlignment(Element.ALIGN_RIGHT);
            document.add(subHeader);
            document.add(Chunk.NEWLINE);

            // Invoice Title & Info
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("INVOICE", titleFont);
            document.add(title);

            SimpleDateFormat df = new SimpleDateFormat("dd MMM yyyy, HH:mm");
            document.add(new Paragraph("Invoice ID: #" + sale.getId()));
            document.add(new Paragraph("Date: " + df.format(sale.getSaleDate())));
            document.add(Chunk.NEWLINE);

            // Product Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            Stream.of("Product Description", "Qty", "Unit Price", "Total")
                    .forEach(columnTitle -> {
                        PdfPCell header = new PdfPCell();
                        header.setBackgroundColor(new BaseColor(241, 245, 249));
                        header.setBorderWidth(1);
                        header.setPadding(8);
                        header.setPhrase(new Phrase(columnTitle, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
                        table.addCell(header);
                    });

            table.addCell(new Phrase(sale.getProduct().getName()));
            table.addCell(new Phrase(String.valueOf(sale.getQuantity())));
            table.addCell(new Phrase("₹" + String.format("%.2f", sale.getUnitPrice())));
            table.addCell(new Phrase("₹" + String.format("%.2f", sale.getUnitPrice() * sale.getQuantity())));

            document.add(table);

            // Totals Section
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(40);
            totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

            addTotalRow(totalTable, "Subtotal:", "₹" + String.format("%.2f", sale.getUnitPrice() * sale.getQuantity()));
            addTotalRow(totalTable, "Discount (" + sale.getDiscount() + "%):", "-₹"
                    + String.format("%.2f", (sale.getUnitPrice() * sale.getQuantity() * sale.getDiscount() / 100)));
            addTotalRow(totalTable, "Tax (10%):", "+₹" + String.format("%.2f", sale.getTax()));

            PdfPCell totalLabel = new PdfPCell(new Phrase("GRAND TOTAL:",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new BaseColor(99, 102, 241))));
            totalLabel.setBorder(Rectangle.NO_BORDER);
            totalLabel.setPadding(10);
            totalTable.addCell(totalLabel);

            PdfPCell totalVal = new PdfPCell(new Phrase("₹" + String.format("%.2f", sale.getTotalPrice()),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new BaseColor(99, 102, 241))));
            totalVal.setBorder(Rectangle.NO_BORDER);
            totalVal.setPadding(10);
            totalVal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalTable.addCell(totalVal);

            document.add(totalTable);
            document.add(Chunk.NEWLINE);

            Paragraph footer = new Paragraph("Thank you for your business!",
                    FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, BaseColor.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    private void addTotalRow(PdfPTable table, String label, String value) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA, 10)));
        c1.setBorder(Rectangle.NO_BORDER);
        c1.setPadding(5);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value, FontFactory.getFont(FontFactory.HELVETICA, 10)));
        c2.setBorder(Rectangle.NO_BORDER);
        c2.setPadding(5);
        c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(c2);
    }
}