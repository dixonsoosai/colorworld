package com.mrajupaint.colorworld.config;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AppUtils {

	public Timestamp getStartDate(LocalDate currentDate) {
		
		int year = currentDate.getYear();
		if(currentDate.getMonthValue() <= 3) {
			year--;
		}
		return Timestamp.valueOf(LocalDateTime.of(year, 4, 1, 0, 0, 0, 0));
	}
	
	public Timestamp getEndDate(LocalDate currentDate) {
		int year = currentDate.getYear();
		if(currentDate.getMonthValue() > 3) {
			year++;
		}
		
		return Timestamp.valueOf(LocalDateTime.of(year, 3, 31, 0, 0, 0, 0));
	}
}
