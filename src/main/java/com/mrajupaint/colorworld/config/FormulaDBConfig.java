package com.mrajupaint.colorworld.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.persistence.EntityManagerFactory;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "formulaEntityManagerFactory",
        transactionManagerRef = "formulaTransactionManager",
        basePackages = { "com.mrajupaint.colorworld.formula.repository" })
public class FormulaDBConfig {

    @Bean
    @ConfigurationProperties(prefix = "formula.datasource")
    DataSource formulaDataSource() {
		return DataSourceBuilder.create().build();
	}
    
    @Bean
    LocalContainerEntityManagerFactoryBean formulaEntityManagerFactory
            (EntityManagerFactoryBuilder builder){

        return builder.dataSource(formulaDataSource())
                .packages("com.mrajupaint.colorworld.formula.entity")
                .build();
    }

    @Bean
    PlatformTransactionManager formulaTransactionManager(
            @Qualifier("formulaEntityManagerFactory") EntityManagerFactory entityManagerFactory) {

        return new JpaTransactionManager(entityManagerFactory);
    }
}
