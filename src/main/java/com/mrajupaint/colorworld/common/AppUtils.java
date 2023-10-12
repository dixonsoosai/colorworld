package com.mrajupaint.colorworld.common;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

import com.mrajupaint.colorworld.exception.ColorWorldException;

public class AppUtils {

	public static boolean isBlank(String inputString) {
		return Objects.isNull(inputString) || inputString.length() == 0;
	}
	
	public static int getFinancialYear(Timestamp inputDate) {
		LocalDateTime date = inputDate.toLocalDateTime();
		return date.getMonthValue() <=3 ? date.getYear() - 1 : date.getYear();
	}
	
	public static Timestamp getStartFYear(Timestamp inputDate) {
		LocalDateTime date = inputDate.toLocalDateTime();
		int month = date.getMonthValue();
		int year =  month >=1 && month <=3 ? date.getYear() - 1 : date.getYear();
		return Timestamp.valueOf(LocalDateTime.of(year, 4, 1,0,0,0));
	}
	
	public static Timestamp getEndFYear(Timestamp inputDate) {
		LocalDateTime date = inputDate.toLocalDateTime();
		int month = date.getMonthValue();
		int year =  month >=1 && month <=3 ? date.getYear() : date.getYear() + 1;
		return Timestamp.valueOf(LocalDateTime.of(year, 3, 31, 23, 59, 59));
	}
	
	public static boolean checkNull(Object ...args) {
		for(var arg: args) {
			if(arg == null) {
				return true;
			}
		}
		return false;
	}
	
	public static String formatDate(Timestamp date, String pattern) {
		return new SimpleDateFormat(pattern).format(date);
	}

	public static String formatDate(LocalDateTime date, String pattern) {
		return DateTimeFormatter.ofPattern(pattern).format(date);
	}
	
	public static String convertToWords(int num) {
		return "Seventy seven thousand seven hundred and seventy seven";
	}
	
	public static String rephraseBill(int billnum) {
		String bill = String.valueOf(billnum);
		if(billnum <= 2000000) {
			return bill;
		}
		int year = Integer.parseInt(bill.substring(0, 4));
		return bill.substring(4,7) + "/" + year + "-" + (year + 1);
	}
	
	AppUtils() throws ColorWorldException {
		throw new ColorWorldException("Cannot create instance");
	}
}
