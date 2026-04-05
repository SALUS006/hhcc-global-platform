package com.hhcc.scheduling.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public class CareChargesRepository {
    private final JdbcTemplate jdbcTemplate;

    public CareChargesRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public BigDecimal findCharge(Long facilityId, String careType) {
        String sql = "SELECT amount FROM care_charges WHERE care_facility_id = ? AND supported_care_type = ?";
        try {
            return jdbcTemplate.queryForObject(sql, BigDecimal.class, facilityId, careType);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            // No charge found for the given facility and care type
            return null;
        }
    }
}
