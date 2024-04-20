package com.formula.colorworld.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.formula.colorworld.entity.Car;

@Repository
public interface CarRepository extends JpaRepository<Car, String> {

}
