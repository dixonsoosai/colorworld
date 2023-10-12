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
import java.text.NumberFormat;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.mrajupaint.colorworld.common.AppUtils;
import com.mrajupaint.colorworld.entity.SSGNJNP;
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
	
	
	@PostConstruct
	private void init() {
		if(!taxInvoiceDirectory.endsWith(File.separator)) {
			taxInvoiceDirectory += File.separator;
		}
	}
	
	public void generatePDF(int billnum) {
		var invoice = new TaxInvoice();
		invoice.setHeader(headerRepository.getByTnbillno(billnum));
		invoice.setGst(gstRepository.getByGnbill(billnum));
		invoice.setDetails(transactionRepository.getTransaction(billnum));
		generatePDF(invoice);
	}
	
	public void generatePDF(TaxInvoice taxInvoice) {
		Map<String, String> placeholder = createPlaceholder(taxInvoice);
		try {
			File file = new File("C:\\Users\\Tiaa user\\Documents\\colorworld\\src\\main\\resources\\templates\\invoice_template.html");
					//ResourceUtils.getFile("classpath:templates/invoice_template1.html");
			
			String finalContent = editContent(file, placeholder);
			String outputFile = taxInvoiceDirectory + 
					taxInvoice.getHeader().getTnbillno() +  "_Tax Invoice.pdf";
			downloadContent(finalContent, outputFile);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private void downloadContent(String content, String outputFile) {
		try {
			new File("C:\\Logs\\sample.html").delete();
			Files.writeString(Path.of("C:\\Logs\\sample.html"), content, StandardOpenOption.CREATE_NEW);
		} catch (IOException e) {
			e.printStackTrace();
		}
		try(OutputStream fileOutputStream = new FileOutputStream(outputFile)) {
			ConverterProperties converterProperties = new ConverterProperties();
			converterProperties.setImmediateFlush(false);
			Document doc = HtmlConverter.convertToDocument(content, 
					new PdfWriter(fileOutputStream), converterProperties);
			doc.setMargins(10, 10, 10, 10);
			doc.relayout();
			doc.close();
		}
		catch (Exception e) {
			LOGGER.error("Exception while converting: {}", e.getMessage(), e);
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
		NumberFormat df = NumberFormat.getInstance();
		df.setMaximumFractionDigits(2);
		return df.format(num);
	}
	
	private Map<String, String> createPlaceholder(TaxInvoice taxInvoice) {
		var header = taxInvoice.getHeader();
		var gstList = taxInvoice.getGst();
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
				AppUtils.formatDate(header.getTntime(), "yyyy-MM-dd"));
		replaceKeyword.put("@AmountInWords", 
				AppUtils.convertToWords((int) header.getTntotal()));
		List<SSGNJNP> totalGst = gstList.stream()
				.filter(s -> s.getGngstp().equals("Total"))
				.toList();
		replaceKeyword.put("@AmtB4Tax", formatNum(totalGst.get(0).getGntxable()));
		replaceKeyword.put("@TotalCGST", formatNum(totalGst.get(0).getGncamt()));
		replaceKeyword.put("@TotalSGST", formatNum(totalGst.get(0).getGnsamt()));
		replaceKeyword.put("@RoundingOff", 
				formatNum(totalGst.get(0).getGntamt()));
		replaceKeyword.put("@TotalAmount", formatNum(totalGst.get(0).getGntxable()));
						
		StringBuilder billBody= new StringBuilder();
		StringBuilder gstBody = new StringBuilder();
		
		for(var gst: gstList) {
			var line = """
				<tr>
					<td>%s</td>
					<td>%s</td>
					<td>%s</td>
					<td>%s</td>
					<td>%s</td>
				</tr>
				""";
			line = String.format(line, gst.getGngstp(), 
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
			     <td>%s</td>
			     <td>%s</td>
			     <td>%s</td>
				</tr>
				""";
			line = String.format(line, 
					bill.getTnchallan(),
					formatNum(bill.getTntqty()) + " X " + bill.getTnuqty() + " " +  
					bill.getTnunit(),
					bill.getTnscnnm(),
					bill.getTnhsnc(),
					formatNum(bill.getTnprice()),
					formatNum(bill.getTnprice()),
					bill.getTncgst(),
					formatNum(bill.getTncamt()),
					bill.getTnsgst(),
					formatNum(bill.getTnsamt()),
					formatNum(bill.getTntamt()));
			billBody.append(line);
		}
		
		for(int i = billList.size(); i<= 75 ; i++) {
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
		//TODO: Replace line
		String filePath = "C:\\Users\\Tiaa user\\Documents\\colorworld\\src\\main\\resources\\templates\\sign.jpeg";
			//ResourceUtils.getFile("classpath:templates/sign.jpeg");		
		try {
            File signFile = new File(filePath);
            String ext = filePath.substring(filePath.indexOf(".") + 1);
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
}
