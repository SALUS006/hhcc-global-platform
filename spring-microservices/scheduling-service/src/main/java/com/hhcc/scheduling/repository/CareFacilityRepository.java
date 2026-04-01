package com.hhcc.scheduling.repository;

import com.hhcc.scheduling.model.CareFacility;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Optional;

/**
 * JDBC repository for the {@code care_facility} table.
 *
 * <p>
 * Provides read-only access to the facility catalog with optional filtering by supported care type using MySQL
 * {@code FIND_IN_SET}.
 * </p>
 *
 * @see com.hhcc.scheduling.model.CareFacility
 */
@Repository
public class CareFacilityRepository {

    private final JdbcTemplate jdbcTemplate;

    public CareFacilityRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<CareFacility> rowMapper = (rs, rowNum) -> {
        CareFacility f = new CareFacility();
        f.setId(rs.getLong("id"));
        f.setFacilityName(rs.getString("facility_name"));
        f.setLocationAddress(rs.getString("location_address"));
        f.setDescription(rs.getString("description"));
        f.setPhotoUrl(rs.getString("photo_url"));
        f.setSupportedCareTypes(rs.getString("supported_care_types"));
        f.setIsActive(rs.getBoolean("is_active"));
        f.setCreatedBy(rs.getLong("created_by"));
        f.setUpdatedBy(rs.getLong("updated_by"));
        return f;
    };

    /**
     * Returns all active facilities, optionally filtered by care type.
     *
     * @param careType
     *            optional filter (CHILDCARE, PET, or ELDERLY); {@code null} returns all
     *
     * @return list of active {@link CareFacility} instances
     */
    public List<CareFacility> findAllActive(String careType) {
        if (StringUtils.isNotBlank(careType)) {
            return jdbcTemplate.query(
                    "SELECT * FROM care_facility WHERE is_active = TRUE AND FIND_IN_SET(?, supported_care_types) > 0",
                    rowMapper, careType);
        }
        return jdbcTemplate.query("SELECT * FROM care_facility WHERE is_active = TRUE", rowMapper);
    }

    /**
     * Finds a single facility by its primary key.
     *
     * @param id
     *            the facility ID
     *
     * @return an {@link Optional} containing the facility, or empty if not found
     */
    public Optional<CareFacility> findById(Long id) {
        List<CareFacility> results = jdbcTemplate.query("SELECT * FROM care_facility WHERE id = ?", rowMapper, id);
        return results.stream().findFirst();
    }
}
