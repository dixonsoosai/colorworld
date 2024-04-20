package com.formula.colorworld.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formula.colorworld.common.AppConstants;
import com.formula.colorworld.model.ServiceResponse;

@Aspect
@Component
public class LoggingAspect {

	private static final Logger LOGGER = LogManager.getLogger(LoggingAspect.class);

	ObjectMapper mapper = new ObjectMapper();
	
	@Around(value = "@annotation(com.formula.colorworld.config.LogTime)")
	public Object advice(ProceedingJoinPoint joinPoint) {
		try {
			LOGGER.info("********************************************************");
			LOGGER.info("Entered method {}()", joinPoint.getSignature());
			if(joinPoint.getArgs().length > 0) {
				String params = mapper.writeValueAsString(joinPoint.getArgs());
				LOGGER.info("Parameters: {}", params);
			}
			long start = System.currentTimeMillis();
			var response = joinPoint.proceed();
			long elapsedTime  = System.currentTimeMillis();
			LOGGER.info("Time taken is {} s", (elapsedTime - start)/1000);
			LOGGER.info("Exited method {}()" , joinPoint.getSignature());
			LOGGER.info("********************************************************");
			return response;
		} catch (Throwable e) {
			var errorResponse = new ServiceResponse<ResponseEntity<Object>>();
			errorResponse.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			errorResponse.setData(null);
			errorResponse.setErrorMessage(e.getMessage());
			errorResponse.setStatus(AppConstants.FAILED);
			LOGGER.error("Exception in method {}() {}", joinPoint.getSignature(),e);
			return errorResponse;
		}
	}
}
