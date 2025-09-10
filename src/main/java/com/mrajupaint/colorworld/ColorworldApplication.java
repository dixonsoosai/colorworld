package com.mrajupaint.colorworld;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;

import com.mrajupaint.colorworld.service.InvoiceService;

import lombok.RequiredArgsConstructor;

@EnableAsync
@EnableRetry
@SpringBootApplication
@RequiredArgsConstructor
public class ColorworldApplication implements ApplicationRunner {

	private final InvoiceService invoiceService;
	
	public static void main(String[] args) {
		SpringApplication.run(ColorworldApplication.class, args);		
	}

	@Override
	public void run(ApplicationArguments args) throws Exception {
		invoiceService.refreshInvoiceSummary();
	}

}
