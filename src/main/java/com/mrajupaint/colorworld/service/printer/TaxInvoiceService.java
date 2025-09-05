package com.mrajupaint.colorworld.service.printer;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.mrajupaint.colorworld.common.AppUtils;
import com.mrajupaint.colorworld.config.Config;
import com.mrajupaint.colorworld.entity.SSGNJNP;
import com.mrajupaint.colorworld.model.TaxInvoice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component(value = "TaxInvoiceService")
@RequiredArgsConstructor
public class TaxInvoiceService implements PrinterService {

	private final Config config;
	
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
			InputStream file = getClass().getClassLoader().getResourceAsStream("templates/invoice_template.html");
			String finalContent = editContent(file, placeholder);
			String outputFilename = config.getTaxInvoiceDirectory() + 
					taxInvoice.getHeader().getTnbillno() +  
					"_" + taxInvoice.getHeader().getTnname() + "_Tax Invoice";
			return downloadContent(finalContent, outputFilename);
			
		} catch (Exception e) {
			log.error("Exception while generating PDF: {}", e.getMessage(), e);
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
				log.error("Exception while converting to PDF file: {}", e.getMessage(), e);
			}
			return content;
		} catch (Exception e) {
			log.error("Exception while writing to HTML file: {}", e.getMessage(), e);
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
			log.error("Exception while reading file: {}", e.getMessage(), e);
		}
		
		return finalContent;
	}
	
	private Map<String, String> createPlaceholder(TaxInvoice taxInvoice) {
		var header = taxInvoice.getHeader();
		var gstList = getGST(taxInvoice);

		Map<String, String> replaceKeyword = new HashMap<>();
		replaceKeyword.put("@CompanyName", config.getCompanyName());
		replaceKeyword.put("@CompanyDescription", config.getCompanyDescription());
		replaceKeyword.put("@CompanyAddress", config.getCompanyAddress());
		replaceKeyword.put("@CompanyContact&GST", config.getCompanyContact());
		replaceKeyword.put("@CompanyAccountDetails", config.getAccountDetails());
		replaceKeyword.put("@PartyCompany", header.getTnname());
		replaceKeyword.put("@PartyGST", header.getTnpgst());
		replaceKeyword.put("@InvoiceNo", AppUtils.rephraseBill(header.getTnbillno()));
		replaceKeyword.put("@Comments", header.getTntext().trim());
		replaceKeyword.put("@InvoiceDate", 
				AppUtils.formatDate(header.getTntime(), "dd-MM-yyyy"));
		replaceKeyword.put("@AmountInWords", 
				AppUtils.convertToWords((int) Math.round(header.getTntotal()) ));
		if(header.getTnbilltype().equals("T")) {
			replaceKeyword.put("@BillType", "Tax Invoice");
		}
		else {
			replaceKeyword.put("@BillType", "Proforma Invoice");
		}
		SSGNJNP totalGst = gstList.get("Total");
		replaceKeyword.put("@AmtB4Tax", AppUtils.formatNum(totalGst.getGntxable()));
		replaceKeyword.put("@TotalCGST", AppUtils.formatNum(totalGst.getGncamt()));
		replaceKeyword.put("@TotalSGST", AppUtils.formatNum(totalGst.getGnsamt()));
		replaceKeyword.put("@RoundingOff", 
				AppUtils.formatNum(Math.round(totalGst.getGntamt()) - totalGst.getGntamt() ));
		replaceKeyword.put("@TotalAmount", AppUtils.formatNum(Math.round(totalGst.getGntamt())));
						
		StringBuilder billBody= new StringBuilder();
		StringBuilder gstBody = new StringBuilder();
		
		int lastPageCount = config.getOverflowLimit() + 3 - gstList.size();
		billBody = convertToPages(taxInvoice, lastPageCount, AppUtils.formatNum(totalGst.getGntxable()));
		gstBody = convertGSTToHTMLTags(gstList);
		replaceKeyword.put("@BillBody", billBody.toString());		
		replaceKeyword.put("@GSTBody", gstBody.toString());
		
		//Read Signature File
		try {
            InputStream signFile = getClass().getClassLoader().getResourceAsStream("templates/sign.jpg");
			byte[] bytes = new byte[signFile.available()];
			signFile.read(bytes);            
            String base64Image = "data:image/jpg;base64," + Base64.getEncoder().encodeToString(bytes);
            replaceKeyword.put("@img", base64Image);
        } catch (Exception e) {
        	log.error("Failed to read signature file: {}", e.getMessage(), e);
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
	
	public Map<String, SSGNJNP> getGST(TaxInvoice taxInvoice) {
		Map<String, SSGNJNP> gst = new LinkedHashMap<>();
		for(var bill: taxInvoice.getGst()) {	
			gst.put(String.valueOf(bill.getGngstp()), bill);
		}
		return gst;
	}
	
	private StringBuilder convertGSTToHTMLTags(Map<String, SSGNJNP> gstList) {
		StringBuilder gstBody = new StringBuilder();
		for(var gst: gstList.values()) {
			var line = """
				<tr>
					<td>%s</td>
					<td>%s</td>
					<td>%s</td>
					<td>%s</td>
					<td>%s</td>
				</tr>
				""";
			line = String.format(line, 
					gst.getGngstp(), 
					AppUtils.formatNum(gst.getGntxable()),
					AppUtils.formatNum(gst.getGncamt()), 
					AppUtils.formatNum(gst.getGnsamt()), 
					AppUtils.formatNum(gst.getGntamt()));
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
		return gstBody;
	}
	
	public StringBuilder convertToPages(TaxInvoice taxInvoice, int lastPageCount, String finalTotal) {
		
		int pageCount = 0, pageSize = 20;
		var pages = new HashMap<Integer, List<String>>();
		pages.put(pageCount, new ArrayList<String>());
		
		//Step 1: Distribute contents to pages
		for(var bill: taxInvoice.getDetails()) {
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
				     <td>%s</td>
					</tr>
					""";
				line = String.format(line, 
						bill.getTnchallan(),
						AppUtils.formatDecimal(bill.getTntqty()) + " X " + Math.round(bill.getTnuqty()) + " " +  
						bill.getTnunit(),
						bill.getTnscnnm(),
						bill.getTnhsnc(),
						AppUtils.formatNum(bill.getTnprice()),
						AppUtils.formatNum(bill.getTndisc()),
						AppUtils.formatNum(bill.getTntxable()),
						AppUtils.formatNum(bill.getTncgst()),
						AppUtils.formatNum(bill.getTncamt()),
						AppUtils.formatNum(bill.getTnsgst()),
						AppUtils.formatNum(bill.getTnsamt()),
						AppUtils.formatNum(bill.getTntamt()));
				if(pages.get(pageCount).size() >= pageSize) {
					pages.put(++pageCount, new ArrayList<String>());
				}
				pages.get(pageCount).add(line);
		}
		
		//Step 2: Add Offset to each pages
		for(Integer i=0; i < pages.size() - 1; i++) {
			int offset = pageSize - pages.get(i).size();
			for(int j=0; j< offset; j++) {
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
						     <td></td>
						</tr>
						""";
				pages.get(i).add(line);
			}
		}
		
		//Step 3: Add Offset to last Page & check for additional page
		int addOffset = 0;
		boolean newPage = false;
		if(pages.get(pageCount).size() <= lastPageCount) {
			addOffset = lastPageCount - pages.get(pageCount).size(); 
		} 
		else {
			addOffset = pageSize - pages.get(pageCount).size();
			newPage = true;
		}
		for(int i=0; i< addOffset; i++) {
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
					     <td></td>
					</tr>
					""";
			pages.get(pageCount).add(line);
		}
		//Added new Page
		if(newPage) {
			pages.put(++pageCount, new ArrayList<String>());
			var totalLine = """
					<tr>
					 <td></td>
				     <td></td>
				     <td style=\"text-align:right;font-weight:bold\">%s</td>
				     <td></td>
				     <td></td>
				     <td></td>
				     <td></td>
				     <td></td>
				     <td></td>
				     <td></td>
				     <td></td>
				     <td style=\"text-align:right;font-weight:bold\">%s</td>
					</tr>
					""";
			totalLine = String.format(totalLine, "Total :", finalTotal);
			pages.get(pageCount).add(totalLine);
			
			for(int i = 0; i< lastPageCount - 1; i++) {
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
						     <td></td>
						</tr>
						""";
				pages.get(pageCount).add(line);
			}
		}
		
		//Convert pages to List & add page break
		var gstBody = new StringBuilder();
		String pageBreak = """
		        <tr>
		    		<td colspan=\"8\" class=\"page-break\">Page %s</td>
		    	</tr>
		""";
		for(int i=0; i< pages.size(); i++) {
			for(var page: pages.get(i)) {
				gstBody.append(page);
			}
			if(i < pages.size() - 1) {
				gstBody.append(String.format(pageBreak, i+1));
			}
		}
		return gstBody;
	}
}
