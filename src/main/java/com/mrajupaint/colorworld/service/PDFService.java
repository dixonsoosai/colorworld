package com.mrajupaint.colorworld.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
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
import org.apache.logging.log4j.core.util.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.mrajupaint.colorworld.common.AppUtils;
import com.mrajupaint.colorworld.entity.GSTSummary;
import com.mrajupaint.colorworld.model.TaxInvoice;
import com.mrajupaint.colorworld.repository.SSGNJNPRepository;
import com.mrajupaint.colorworld.repository.SSTNHDPRepository;
import com.mrajupaint.colorworld.repository.TransactionRepository;

import jakarta.annotation.PostConstruct;

@Service
public class PDFService {
	
	private static final Logger LOGGER = LogManager.getLogger(PDFService.class);
	
	@Value("${account.details}")
	private String accountDetails;
	
	@Value("${tax.invoice.directory}")
	private String taxInvoiceDirectory;
	
	@Value("${company.name}")
	private String companyName;

	@Value("${company.description}")
	private String companyDescription;
	
	@Value("${company.address}")
	private String companyAddress;
	
	@Value("${company.contact}")
	private String companyContact;
	
	@Autowired
	private SSTNHDPRepository headerRepository;
	
	@Autowired
	private TransactionRepository transactionRepository;
	
	@Autowired
	private SSGNJNPRepository gstRepository;
	
	private int overflowLimit = 17;
	
	@PostConstruct
	private void init() {
		if(!taxInvoiceDirectory.endsWith(File.separator)) {
			taxInvoiceDirectory += File.separator;
		}
		File taxInvoice = new File(taxInvoiceDirectory);
		if(taxInvoice.mkdir()) {
			LOGGER.info("Tax Invoice Directory created");
		}
	}
	
	public int getOverflowLimit() {
		return overflowLimit;
	}

	public void setOverflowLimit(int overflowLimit) {
		this.overflowLimit = overflowLimit;
	}
	
	public void resetOverflowLimit() {
		setOverflowLimit(17);
	}
	
	public String generateInvoice(int billnum) {
		var invoice = new TaxInvoice();
		invoice.setHeader(headerRepository.getByTnbillno(billnum));
		invoice.setGst(gstRepository.getByGnbill(billnum));
		invoice.setDetails(transactionRepository.getTransaction(billnum));
		return generateInvoice(invoice);
	}
	
	public String generateInvoice(TaxInvoice taxInvoice) {
		Map<String, String> placeholder = createPlaceholder(taxInvoice);
		try {
			File file = ResourceUtils.getFile("classpath:templates/invoice_template2.html");
			//File file = new File("C:\\Users\\acer\\git\\colorworld\\src\\main\\resources\\templates\\invoice_template2.html");
			String finalContent = editContent(file, placeholder);
			String outputFilename = taxInvoiceDirectory + 
					taxInvoice.getHeader().getTnbillno() +  
					"_" + taxInvoice.getHeader().getTnname() + "_Tax Invoice";
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
	
	private String editContent(File file, Map<String, String> placeholder) {
		String finalContent = "";
		try(FileReader fr = new FileReader(file)) {
			String readLine;
			StringBuilder totalStr = new StringBuilder();
			try (BufferedReader br = new BufferedReader(fr)) {
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
		} catch (Exception ex) {
			LOGGER.error("Exception in file: {}", ex.getMessage(), ex);
		}
		return finalContent;
	}

	private String formatNum(double num) {
		return String.format("%.2f", num);
	}
	
	private Map<String, String> createPlaceholder(TaxInvoice taxInvoice) {
		var header = taxInvoice.getHeader();
		var gstList = getGST(taxInvoice);
		var billList = taxInvoice.getDetails();
	
		Map<String, String> replaceKeyword = new HashMap<>();
		replaceKeyword.put("@CompanyName", companyName);
		replaceKeyword.put("@CompanyDescription", companyDescription);
		replaceKeyword.put("@CompanyAddress", companyAddress);
		replaceKeyword.put("@CompanyContact&GST", companyContact);
		replaceKeyword.put("@CompanyAccountDetails", accountDetails);
		replaceKeyword.put("@PartyCompany", header.getTnname());
		replaceKeyword.put("@PartyGST", header.getTnpgst());
		replaceKeyword.put("@InvoiceNo", 
				AppUtils.rephraseBill(header.getTnbillno()));
		replaceKeyword.put("@InvoiceDate", 
				AppUtils.formatDate(header.getTntime(), "dd-MM-yyyy"));
		replaceKeyword.put("@AmountInWords", 
				AppUtils.convertToWords((int) Math.round(header.getTntotal()) ));
		GSTSummary totalGst = gstList.get("Total");
		replaceKeyword.put("@AmtB4Tax", formatNum(totalGst.getGntxable()));
		replaceKeyword.put("@TotalCGST", formatNum(totalGst.getGncamt()));
		replaceKeyword.put("@TotalSGST", formatNum(totalGst.getGnsamt()));
		replaceKeyword.put("@RoundingOff", 
				formatNum(Math.round(totalGst.getGntamt()) - totalGst.getGntamt() ));
		replaceKeyword.put("@TotalAmount", formatNum(Math.round(totalGst.getGntamt())));
						
		StringBuilder billBody= new StringBuilder();
		StringBuilder gstBody = new StringBuilder();
		
		for(var gst: gstList.values()) {
			var line = """
				<tr>
					<td>%s</td>
					<td>%s</td>
					<td>%s</td>
					<td>%s</td>
					<td>%s</td>
					<td>%s</td>
				</tr>
				""";
			line = String.format(line, 
					gst.getGnhsnc(), 
					gst.getGngstp(), 
					formatNum(gst.getGntxable()),
					formatNum(gst.getGncamt()), 
					formatNum(gst.getGnsamt()), 
					formatNum(gst.getGntamt()));
			gstBody.append(line);
		}	
		for(int i = gstList.size(); i< 3 ; i++) {
			var line = """
					<tr style=\"height: 27.2px;\" class= \"blank-row\">
					     <td></td>
					     <td></td>
					     <td></td>
					     <td></td>
					     <td></td>
					     <td></td>
					</tr>
					""";
			gstBody.append(line);
		}
		for(var bill: billList) {
			var line = """
				<tr>
				 <td>%s</td>
			     <td>%s</td>
			     <td>%s</td>
			     <td>%s</td>
			     <td>%s</td>
			     <td>%s</td>
			     <td>%s</td>
			     <td>%s</td>
				</tr>
				""";
			line = String.format(line, 
					bill.getTnchallan(),
					Math.round(bill.getTntqty()) + " X " + Math.round(bill.getTnuqty()) + " " +  
					bill.getTnunit(),
					bill.getTnscnnm(),
					bill.getTnhsnc(),
					formatNum(bill.getTnprice()),
					formatNum(bill.getTndisc()),
					formatNum(bill.getTntxable()),
					formatNum(bill.getTntamt()));
			billBody.append(line);
		}
		
		for(int i = billList.size(); i<= getOverflowLimit() + 3 - gstList.size(); i++) {
			var line = """
					<tr style=\"height: 27.2px;\">
					     <td></td>
					     <td></td>
					     <td></td>
					     <td></td>
					     <td></td>
					     <td></td>
					     <td></td>
					     <td></td>
					</tr>
					""";
			billBody.append(line);
		}
		replaceKeyword.put("@BillBody", billBody.toString());		
		replaceKeyword.put("@GSTBody", gstBody.toString());
		
		//Read Signature File
		try {
            File signFile = ResourceUtils.getFile("classpath:templates/sign.jpg");
            String ext = FileUtils.getFileExtension(signFile);
            try(FileInputStream fileInputStream = new FileInputStream(signFile)) {
	            byte[] imageData = new byte[(int) signFile.length()];
	            fileInputStream.read(imageData);
	            String base64Image = "data:image/" + ext + ";base64," + 
	            		Base64.getEncoder().encodeToString(imageData);
	            replaceKeyword.put("@img", base64Image);
            }
        } catch (IOException e) {
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
}
