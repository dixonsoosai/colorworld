package com.mrajupaint.colorworld.service;

import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.logging.log4j.util.Strings;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mrajupaint.colorworld.common.AppConstants;
import com.mrajupaint.colorworld.common.AppUtils;
import com.mrajupaint.colorworld.config.Config;
import com.mrajupaint.colorworld.entity.SPRequest;
import com.mrajupaint.colorworld.entity.SSACRGP;
import com.mrajupaint.colorworld.exception.ColorWorldException;
import com.mrajupaint.colorworld.model.ServiceResponse;
import com.mrajupaint.colorworld.repository.SSACRGPRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountRegisterService {

	private final SSACRGPRepository sSACRGPRepository;
	
	private final Config config;
		
	public List<SSACRGP> getAllBills(){
		return sSACRGPRepository.findAllByOrderByArdateDesc();
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
	
	@Transactional
	@Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000))
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
	
	@Transactional(rollbackFor = ColorWorldException.class)
	@Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000))
	public String deleteBillByBillNo(String billNo, String companyName) throws ColorWorldException{
		int count = sSACRGPRepository.deleteByArbillnoAndArname(billNo, companyName);
		if(count > 1) {
			throw new ColorWorldException("Exception while deleting bill");
		}
		return "Bill deleted successfully";
	}
	
	@SuppressWarnings("deprecation")
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
            for(int i=0; i< config.getSalesHeader().size(); i++) {
            	Cell headerCell = headerRow.createCell(i);
                headerCell.setCellValue(config.getSalesHeader().get(i));
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
            
            for(int i = 0; i< config.getSalesHeader().size(); i++) {
            	sheet.autoSizeColumn(i);
            }
            
            String filename = config.getAccountsDirectory() + "Sales History_" 
            		+ AppUtils.formatDate(LocalDateTime.now(), "yyyyMMdd") + ".xlsx";
            try (FileOutputStream outputStream = new FileOutputStream(filename)) {
                workbook.write(outputStream);
                log.info("Excel file created successfully.");
            }
            return new FileSystemResource(filename);
            
        } catch (Exception e) {
        	log.error("Exception while generating excel: {}", e.getMessage(), e);
        }
		return null;

	}
}
