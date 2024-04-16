package com.mrajupaint.colorworld.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.persistence.EntityManagerFactory;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "colorWorldEntityManagerFactory",
        transactionManagerRef = "colorWorldTransactionManager",
        basePackages = { "com.mrajupaint.colorworld.repository" })
public class DBConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    @Primary
    DataSource colorWorldDataSource() {
    	return DataSourceBuilder.create().build();
    }

    @Bean
    @Primary
    LocalContainerEntityManagerFactoryBean colorWorldEntityManagerFactory(EntityManagerFactoryBuilder builder){
    	 return builder
                 .dataSource(colorWorldDataSource())
                 .packages("com.mrajupaint.colorworld.entity")
                 .build();
    }

    @Bean
    @Primary
    PlatformTransactionManager colorWorldTransactionManager(
            @Qualifier("colorWorldEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}
