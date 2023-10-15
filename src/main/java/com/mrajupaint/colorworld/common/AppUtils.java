package com.mrajupaint.colorworld.common;


import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
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
		BigDecimal bd = new BigDecimal(num);
        long number = bd.longValue();
        long no = bd.longValue();
        //int decimal = (int) (bd.remainder(BigDecimal.ONE).doubleValue() * 100);
        int digits_length = String.valueOf(no).length();
        int i = 0;
        ArrayList<String> str = new ArrayList<>();
        HashMap<Integer, String> words = new HashMap<>();
        words.put(0, "");
        words.put(1, "One");
        words.put(2, "Two");
        words.put(3, "Three");
        words.put(4, "Four");
        words.put(5, "Five");
        words.put(6, "Six");
        words.put(7, "Seven");
        words.put(8, "Eight");
        words.put(9, "Nine");
        words.put(10, "Ten");
        words.put(11, "Eleven");
        words.put(12, "Twelve");
        words.put(13, "Thirteen");
        words.put(14, "Fourteen");
        words.put(15, "Fifteen");
        words.put(16, "Sixteen");
        words.put(17, "Seventeen");
        words.put(18, "Eighteen");
        words.put(19, "Nineteen");
        words.put(20, "Twenty");
        words.put(30, "Thirty");
        words.put(40, "Forty");
        words.put(50, "Fifty");
        words.put(60, "Sixty");
        words.put(70, "Seventy");
        words.put(80, "Eighty");
        words.put(90, "Ninety");
        String digits[] = {"", "Hundred", "Thousand", "Lakh", "Crore"};
        while (i < digits_length) {
            int divider = (i == 2) ? 10 : 100;
            number = no % divider;
            no = no / divider;
            i += divider == 10 ? 1 : 2;
            if (number > 0) {
                int counter = str.size();
                String plural = (counter > 0 && number > 9) ? "s" : "";
                String tmp = (number < 21) ? words.get(Integer.valueOf((int) number)) + " " + digits[counter] + plural : words.get(Integer.valueOf((int) Math.floor(number / 10) * 10)) + " " + words.get(Integer.valueOf((int) (number % 10))) + " " + digits[counter] + plural;                
                str.add(tmp);
            } else {
                str.add("");
            }
        }
 
        Collections.reverse(str);
        String rupees = String.join(" ", str).trim();
        rupees = rupees.substring(0,1) + rupees.substring(1).toLowerCase();
        //String paise = (decimal) > 0 ? " And Paise " + words.get(Integer.valueOf((int) (decimal - decimal % 10))) + " " + words.get(Integer.valueOf((int) (decimal % 10))) : "";
        return "Rupees " + rupees + " only";
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
