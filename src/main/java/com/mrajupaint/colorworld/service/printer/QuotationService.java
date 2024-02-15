package com.mrajupaint.colorworld.service.printer;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.mrajupaint.colorworld.common.AppUtils;
import com.mrajupaint.colorworld.config.Config;
import com.mrajupaint.colorworld.entity.GSTSummary;
import com.mrajupaint.colorworld.model.TaxInvoice;

import jakarta.annotation.PostConstruct;

@Component(value = "QuotationService")
public class QuotationService implements PrinterService {

	private static final Logger LOGGER = LogManager.getLogger(TaxInvoice2Service.class);

	@Autowired
	private Config config;
	
	@PostConstruct
	public void init() {
		
	}
	
	/***
	 * Steps:
	 * 1. Create PlaceHolder
	 * 2. Read Template File
	 * 3. Replace File Content with Placeholder
	 * 4. Download Content
	 */
	
	@Override
	public String printInvoice(TaxInvoice taxInvoice) {
		Map<String, String> placeholder = createPlaceholder(taxInvoice);
		try {
			InputStream file = new FileInputStream(new File("C:\\Users\\TIAA user\\git\\colorworld\\src\\main\\resources\\templates\\quotation.html"));
			String finalContent = editContent(file, placeholder);
			String outputFilename = config.getTaxInvoiceDirectory() + 
					taxInvoice.getHeader().getTnbillno() +  
					"_" + taxInvoice.getHeader().getTnname() + "_Quotation";
			return downloadContent(finalContent, outputFilename);
			
		} catch (Exception e) {
			LOGGER.error("Exception while generating PDF: {}", e.getMessage(), e);
			return null;
		}
	}
	
	private String downloadContent(String content, String outputFile) {
		try {
			String htmlFile = outputFile + ".html";
			String pdfFile = outputFile + ".pdf";
			Path filePath = Path.of(htmlFile);
			new File(htmlFile).delete();
			Files.writeString(filePath, content, StandardOpenOption.CREATE_NEW);			
			try {
				convertHtmlToPdf(content, pdfFile);
			} catch (Exception e) {
				LOGGER.error("Exception while converting to PDF file: {}", e.getMessage(), e);
			}
			return content;
		} catch (Exception e) {
			LOGGER.error("Exception while writing to HTML file: {}", e.getMessage(), e);
			return null;
		}
	}
	
	private String editContent(InputStream file, Map<String, String> placeholder) {
		String finalContent = "";
		String readLine;
		StringBuilder totalStr = new StringBuilder();
		try (BufferedReader br = new BufferedReader(new InputStreamReader(file))) {
	        while ((readLine = br.readLine()) != null) {
	            totalStr.append(readLine);
	        }
	        finalContent = totalStr.toString();
	        for(var item: placeholder.entrySet()) {
	        	finalContent = finalContent
	        			.replaceAll(item.getKey(), item.getValue());	
	        }   
		}
		catch(Exception e) {
			LOGGER.error("Exception while reading file: {}", e.getMessage(), e);
		}
		
		return finalContent;
	}
	
	private Map<String, String> createPlaceholder(TaxInvoice taxInvoice) {
		var header = taxInvoice.getHeader();
		var gstList = getGST(taxInvoice);

		Map<String, String> replaceKeyword = new HashMap<>();
		replaceKeyword.put("@CompanyName", config.getCompanyName());
		replaceKeyword.put("@CompanyAddress1", config.getCompanyAddress1());
		replaceKeyword.put("@CompanyAddress2", config.getCompanyAddress2());
		replaceKeyword.put("@CompanyAddress3", config.getCompanyAddress3());
		replaceKeyword.put("@CompanyContact", config.getCompanyMob());
		replaceKeyword.put("@GST", config.getCompanyGst());
		replaceKeyword.put("@PartyCompany", header.getTnname());
		replaceKeyword.put("@InvoiceNo", AppUtils.rephraseBill(header.getTnbillno()));
		replaceKeyword.put("@InvoiceDate", 
				AppUtils.formatDate(header.getTntime(), "dd-MM-yyyy hh:mm:ss aa"));
		replaceKeyword.put("@AmountInWords", 
				AppUtils.convertToWords((int) Math.round(header.getTntotal()) ));
		GSTSummary totalGst = gstList.get("Total");
		replaceKeyword.put("@AmtB4Tax", AppUtils.formatNum(totalGst.getGntxable()));
		replaceKeyword.put("@TotalCGST", AppUtils.formatNum(totalGst.getGncamt()));
		replaceKeyword.put("@TotalSGST", AppUtils.formatNum(totalGst.getGnsamt()));
		replaceKeyword.put("@RoundingOff", 
				AppUtils.formatNum(Math.round(totalGst.getGntamt()) - totalGst.getGntamt() ));
		replaceKeyword.put("@TAmt", AppUtils.formatNum(totalGst.getGntamt()));
		replaceKeyword.put("@GAmt", AppUtils.formatNum(Math.round(totalGst.getGntamt())));
						
		StringBuilder billBody= new StringBuilder();
		billBody = convertToPages(taxInvoice);
		replaceKeyword.put("@BillBody", billBody.toString());		
		
		//Read Logo File
		try {
            InputStream logoFile = getClass().getClassLoader().getResourceAsStream("templates/logo.jpg");
			byte[] bytes = new byte[logoFile.available()];
			logoFile.read(bytes);            
            String base64Image = "data:image/jpg;base64," + Base64.getEncoder().encodeToString(bytes);
            replaceKeyword.put("@img", base64Image);
        } catch (Exception e) {
            LOGGER.error("Failed to read signature file: {}", e.getMessage(), e);
        }
		return replaceKeyword;
	}
	

	public void convertHtmlToPdf(String htmlContent, String outputPdfFilePath) throws Exception {
        //Replace all single tag
		htmlContent = htmlContent.replaceAll("<br>", "<br></br>");
		File file = new File(outputPdfFilePath);
        try (OutputStream os = new FileOutputStream(file)) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(os, false);
            renderer.finishPDF();
        }
	}
	
	public Map<String, GSTSummary> getGST(TaxInvoice taxInvoice) {
		Map<String, GSTSummary> gst = new LinkedHashMap<>();
		var gstTotal = new GSTSummary();
		for(var bill: taxInvoice.getDetails()) {
			GSTSummary gstDetail;
			if(gst.containsKey(String.valueOf(bill.getTnhsnc()))) {
				gstDetail = gst.get(String.valueOf(bill.getTnhsnc()));
			}
			else {
				gstDetail = new GSTSummary();
				gstDetail.setGnhsnc(String.valueOf(bill.getTnhsnc()));
				gstDetail.setGngstp(String.valueOf(Math.round(bill.getTncgst() + 
						bill.getTnsgst())));	
			}
			gstDetail.setGntxable(gstDetail.getGntxable() + bill.getTntxable());
			gstDetail.setGnsamt(gstDetail.getGnsamt() + bill.getTnsamt());
			gstDetail.setGncamt(gstDetail.getGncamt() + bill.getTncamt());
			gstDetail.setGntamt(gstDetail.getGntamt() + bill.getTntamt());
			
			gstTotal.setGnhsnc("Total");
			gstTotal.setGngstp("-");
			gstTotal.setGntxable(gstTotal.getGntxable() + bill.getTntxable());
			gstTotal.setGnsamt(gstTotal.getGnsamt() + bill.getTnsamt());
			gstTotal.setGncamt(gstTotal.getGncamt() + bill.getTncamt());
			gstTotal.setGntamt(gstTotal.getGntamt() + bill.getTntamt());
			
			gst.put(String.valueOf(bill.getTnhsnc()), gstDetail);
		}
		gst.put(gstTotal.getGnhsnc(), gstTotal);
		return gst;
	}
	
	public StringBuilder convertToPages(TaxInvoice taxInvoice) {
		
		var billBody = new StringBuilder();
		//Step 1: Distribute contents to pages
		for(var bill: taxInvoice.getDetails()) {
			var line = """
					<tr>
					 <td>%s</td>
				     <td>%s</td>
				     <td>%s</td>
					</tr>
					""";
				line = String.format(line, 
						AppUtils.formatDecimal(bill.getTntqty()) + " X " + Math.round(bill.getTnuqty()) + " " +
						bill.getTnunit(),
						bill.getTnscnnm(),
						AppUtils.formatNum(bill.getTntamt()));
				billBody.append(line);
		}
		return billBody;
	}

}
