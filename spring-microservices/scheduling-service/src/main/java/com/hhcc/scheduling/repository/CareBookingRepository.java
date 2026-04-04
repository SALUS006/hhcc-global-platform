package com.hhcc.scheduling.repository;

import com.hhcc.scheduling.model.CareBooking;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import org.apache.commons.lang3.StringUtils;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.sql.Types;
import java.util.List;
import java.util.Optional;

/**
 * JDBC repository for the {@code care_booking} table.
 *
 * <p>
 * Supports creating, querying, and cancelling care bookings for both family members and pets (UC#7, UC#8).
 * </p>
 *
 * @see com.hhcc.scheduling.model.CareBooking
 */
@Repository
public class CareBookingRepository {

    private final JdbcTemplate jdbcTemplate;

    public CareBookingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<CareBooking> rowMapper = (rs, rowNum) -> {
        CareBooking b = new CareBooking();
        b.setId(rs.getLong("id"));
        b.setUserId(rs.getLong("user_id"));
        b.setFacilityId(rs.getLong("facility_id"));
        b.setCareType(rs.getString("care_type"));
        b.setDependentType(rs.getString("dependent_type"));
        b.setDependentId(rs.getLong("dependent_id"));
        b.setPickupTime(rs.getTimestamp("pickup_time").toLocalDateTime());
        b.setDropoffTime(rs.getTimestamp("dropoff_time").toLocalDateTime());
        b.setStatus(rs.getString("status"));
        b.setNotes(rs.getString("notes"));
        b.setCreatedBy(rs.getLong("created_by"));
        b.setUpdatedBy(rs.getLong("updated_by"));
        return b;
    };

    /**
     * Returns all bookings for a user, optionally filtered by status.
     *
     * @param userId
     *            the account owner's ID
     * @param status
     *            optional filter (PENDING, CONFIRMED, COMPLETED, CANCELLED); {@code null} returns all
     *
     * @return list of {@link CareBooking} instances
     */
    public List<CareBooking> findAllByUserId(Long userId, String status) {
        if (StringUtils.isNotBlank(status)) {
            return jdbcTemplate.query("SELECT * FROM care_booking WHERE user_id = ? AND status = ?", rowMapper, userId,
                    status);
        }
        return jdbcTemplate.query("SELECT * FROM care_booking WHERE user_id = ?", rowMapper, userId);
    }

    /**
     * Returns all bookings, optionally filtered by status.
     *
     * @param status optional filter (PENDING, CONFIRMED, COMPLETED, CANCELLED); {@code null} returns all
     * @return list of {@link CareBooking} instances
     */
    public List<CareBooking> findAll(String status) {
        if (StringUtils.isNotBlank(status)) {
            return jdbcTemplate.query("SELECT * FROM care_booking WHERE status = ?", rowMapper, status);
        }
        return jdbcTemplate.query("SELECT * FROM care_booking", rowMapper);
    }

    /**
     * Finds a single booking by ID, scoped to the owning user.
     *
     * @param id
     *            the booking ID
     * @param userId
     *            the account owner's ID
     *
     * @return an {@link Optional} containing the booking, or empty if not found
     */
    public Optional<CareBooking> findByIdAndUserId(Long id, Long userId) {
        List<CareBooking> results = jdbcTemplate.query("SELECT * FROM care_booking WHERE id = ? AND user_id = ?",
                rowMapper, id, userId);
        return results.stream().findFirst();
    }

    /**
     * Persists a new booking and populates the generated ID on the returned object.
     *
     * @param b
     *            the booking to insert (ID is ignored; status defaults to PENDING)
     *
     * @return the saved {@link CareBooking} with its generated ID
     */
    public CareBooking save(CareBooking b) {
        String sql = "INSERT INTO care_booking (user_id, facility_id, care_type, dependent_type, "
                + "dependent_id, pickup_time, dropoff_time, status, notes, created_by, updated_by) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, b.getUserId());
            ps.setLong(2, b.getFacilityId());
            ps.setString(3, b.getCareType());
            ps.setString(4, b.getDependentType());
            ps.setLong(5, b.getDependentId());
            ps.setTimestamp(6, Timestamp.valueOf(b.getPickupTime()));
            ps.setTimestamp(7, Timestamp.valueOf(b.getDropoffTime()));
            ps.setString(8, b.getStatus() != null ? b.getStatus() : "PENDING");
            ps.setString(9, b.getNotes());
            setNullableLong(ps, 10, b.getCreatedBy());
            setNullableLong(ps, 11, b.getUpdatedBy());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            b.setId(keyHolder.getKey().longValue());
        }
        return b;
    }

    /**
     * Soft-cancels a booking by setting its status to {@code CANCELLED}.
     *
     * @param id
     *            the booking ID
     * @param userId
     *            the account owner's ID (ownership check)
     * @param updatedBy
     *            the user performing the cancellation
     *
     * @return the number of rows updated (0 if not found or not owned)
     */
    public int cancelByIdAndUserId(Long id, Long userId, Long updatedBy) {
        return jdbcTemplate.update(
                "UPDATE care_booking SET status = 'CANCELLED', updated_by = ? WHERE id = ? AND user_id = ?", updatedBy,
                id, userId);
    }

    private void setNullableLong(PreparedStatement ps, int index, Long value) throws java.sql.SQLException {
        if (value != null) {
            ps.setLong(index, value);
        } else {
            ps.setNull(index, Types.BIGINT);
        }
    }
}
