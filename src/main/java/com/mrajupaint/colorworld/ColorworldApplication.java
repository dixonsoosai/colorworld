package com.mrajupaint.colorworld;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@EnableRetry
public class ColorworldApplication {

	public static void main(String[] args) {
		SpringApplication.run(ColorworldApplication.class, args);
	}

}
