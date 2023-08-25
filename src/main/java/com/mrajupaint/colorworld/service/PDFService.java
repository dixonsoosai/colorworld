package com.mrajupaint.colorworld.service;

import java.io.File;
import java.text.NumberFormat;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import com.mrajupaint.colorworld.model.TaxInvoice;

import jakarta.annotation.PostConstruct;

@Service
public class PDFService {
	
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
	
	
	@PostConstruct
	private void init() {
		if(!taxInvoiceDirectory.endsWith(File.separator)) {
			taxInvoiceDirectory += File.separator;
		}
	}
	
	public void generatePDF(int billnum) {
		
	}
	
	public void generatePDF(TaxInvoice taxInvoice) {
		Map<String, String> placeholder = createPlaceholder(taxInvoice);
		//Read HTML File
		try {
			File file = ResourceUtils.getFile("classpath:templates/invoice_template.html");
			String outputFile = taxInvoiceDirectory + "output.pdf";
		} catch (Exception e) {
			e.printStackTrace();
		}
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
		replaceKeyword.put("${CompanyName}", companyName);
		replaceKeyword.put("${CompanyDescription}", companyDescription);
		replaceKeyword.put("${CompanyAddress}", companyAddress);
		replaceKeyword.put("${CompanyContact&GST}", companyContact);
		replaceKeyword.put("${CompanyAccountDetails}", accountDetails);
		replaceKeyword.put("${PartyCompany}", header.getTnname());
		replaceKeyword.put("${PartyGST}", header.getTnpgst());
		replaceKeyword.put("${InvoiceNo}", String.valueOf(header.getTnbillno()));
		replaceKeyword.put("${InvoiceDate}", String.valueOf(header.getTncurdt()));
		
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
					formatNum(bill.getTntqty()),
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
		
		for(int i = billList.size(); i<= 40 ; i++) {
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
		replaceKeyword.put("${BillBody}", billBody.toString());		
		replaceKeyword.put("${GSTBody}", gstBody.toString());
		return replaceKeyword;
	}
}
