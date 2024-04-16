package com.mrajupaint.colorworld.formula.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mrajupaint.colorworld.formula.entity.Car;

@Repository
public interface CarRepository extends JpaRepository<Car, String> {

}
