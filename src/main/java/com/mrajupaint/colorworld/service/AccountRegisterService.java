package com.mrajupaint.colorworld.service;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.util.Strings;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.mrajupaint.colorworld.common.AppConstants;
import com.mrajupaint.colorworld.common.AppUtils;
import com.mrajupaint.colorworld.entity.SPRequest;
import com.mrajupaint.colorworld.entity.SSACRGP;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.repository.SSACRGPRepository;

import jakarta.annotation.PostConstruct;

@Service
public class AccountRegisterService {

	private static final Logger LOGGER = LogManager.getLogger(AccountRegisterService.class);
	
	@Value("${sales.header}")
	private List<String> salesHeader;
	
	@Value("${account.registry.directory}")
	private String accountsDirectory;
	
	@Autowired
	SSACRGPRepository sSACRGPRepository;
	
	@PostConstruct
	public void init() {
		//Create Directory if not exists
		File directory = new File(accountsDirectory);
		if(directory.mkdirs()) {
			LOGGER.info("Accounts Directory created");
		}
		if(!accountsDirectory.endsWith(File.separator)) {
			accountsDirectory += File.separator;
		}
	}
	
	public List<SSACRGP> getAllBills(){
		return sSACRGPRepository.findAll();
	}
	
	public List<SSACRGP> getBills(SPRequest request){
		if(!request.getBillnum().isBlank() && !request.getCompanyName().isBlank() && 
				!AppUtils.checkNull(request.getStartDate(), request.getEndDate())) {
			return sSACRGPRepository.findByArbillnoAndArnameAndArdateBetween(
					request.getBillnum(), request.getCompanyName(), 
					request.getStartDate(), request.getEndDate());
		}
		else if(!request.getBillnum().isBlank() && request.getCompanyName().isBlank() && 
				!AppUtils.checkNull(request.getStartDate(), request.getEndDate())) {
			return sSACRGPRepository.findByArbillnoAndArdateBetween(request.getBillnum(),
					request.getStartDate(), request.getEndDate());
		}
		else if(request.getBillnum().isBlank() && !request.getCompanyName().isBlank() && 
				!AppUtils.checkNull(request.getStartDate(), request.getEndDate())) {
			return sSACRGPRepository.findByArnameAndArdateBetween(request.getCompanyName(),
					request.getStartDate(), request.getEndDate());
		}
		else if(!request.getBillnum().isBlank() && !request.getCompanyName().isBlank() && 
				AppUtils.checkNull(request.getStartDate(), request.getEndDate())) {
			return sSACRGPRepository.findByArbillnoAndArname(request.getBillnum(), 
					request.getCompanyName());
		}
		else if(!AppUtils.checkNull(request.getStartDate(), request.getEndDate())) {
			return sSACRGPRepository.findByArdateBetween(request.getStartDate(), request.getEndDate());	
		}
		else if(!request.getCompanyName().isBlank()) {
			return sSACRGPRepository.findByArname(request.getCompanyName());
		}
		else if(!request.getBillnum().isBlank()) {
			return sSACRGPRepository.findByArbillno(request.getBillnum());			
		}
		return new ArrayList<>();
	}
	
	public ServiceResponse<Object> addBillDetails(SSACRGP accountDetails){
		//Validation
		var response = new ServiceResponse<Object>();
		
		var errorMessage = new HashMap<String, String>();
		if(!errorMessage.isEmpty()) {
			response.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			response.setErrorMessage(AppConstants.VALIDATION_ERROR);
			response.setData(errorMessage);
			return response;
		}
		
		sSACRGPRepository.save(accountDetails);
		response.setCode(HttpStatus.OK.value());
		response.setStatus(AppConstants.SUCCESS);
		response.setErrorMessage(Strings.EMPTY);
		response.setData("Bill added successfully");
		return response;
	}
	
	public String deleteBillByBillNo(String billNo) throws ColorWorldException{
		int count = sSACRGPRepository.deleteByArbillno(billNo);
		if(count >= 1) {
			throw new ColorWorldException("Exception while deleting bill");
		}
		return "Bill deleted successfully";
	}
	
	public Resource downloadBills(SPRequest request) {
		List<SSACRGP> bills = getBills(request);
		if(bills.isEmpty()) {
			return null;
		}
		//Write the data in Excel
		try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("SalesBill");
            int index = 0;
            
            // Create a header row
            Row headerRow = sheet.createRow(index);
            for(int i=0; i< salesHeader.size(); i++) {
            	Cell headerCell = headerRow.createCell(i);
                headerCell.setCellValue(salesHeader.get(i));
            }
            
            // Add data rows
            for (var bill: bills) {
            	Row dataRow = sheet.createRow(++index);
                int colIndex = 0;
            	Cell dataCell = dataRow.createCell(colIndex++);
            	dataCell.setCellType(CellType.STRING);
                dataCell.setCellValue(bill.getArbillno());
                
                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(AppUtils.formatDate(bill.getArdate(), "yyyy-MM-dd"));
                
                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(bill.getArname());
                
                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(bill.getArgstno());

                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(bill.getArnamt());

                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(bill.getArcgst());

                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(bill.getArsgst());

                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(bill.getArtamt());

                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellType(CellType.STRING);
                dataCell.setCellValue(bill.getArchqdte());

                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellType(CellType.STRING);
                dataCell.setCellValue(bill.getArchqno());

                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(bill.getArchqamt());

                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(bill.getArbname());

                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(bill.getArtext());

                dataCell = dataRow.createCell(colIndex++);
                dataCell.setCellValue(bill.getArtype());
            }
            
            for(int i = 0; i< salesHeader.size(); i++) {
            	sheet.autoSizeColumn(i);
            }
            
            String filename = accountsDirectory + "Sales History_" 
            		+ AppUtils.formatDate(LocalDateTime.now(), "yyyyMMdd") + ".xlsx";
            try (FileOutputStream outputStream = new FileOutputStream(filename)) {
                workbook.write(outputStream);
                LOGGER.info("Excel file created successfully.");
            }
            return new FileSystemResource(filename);
            
        } catch (Exception e) {
        	LOGGER.error("Exception while generating excel: {}", e.getMessage(), e);
        }
		return null;

	}
}
