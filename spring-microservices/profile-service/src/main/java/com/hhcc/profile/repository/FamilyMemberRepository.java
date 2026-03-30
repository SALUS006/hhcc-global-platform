package com.hhcc.profile.repository;

import com.hhcc.profile.model.FamilyMember;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Types;
import java.util.List;
import java.util.Optional;

@Repository
public class FamilyMemberRepository {

    private final JdbcTemplate jdbcTemplate;

    public FamilyMemberRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<FamilyMember> rowMapper = (rs, rowNum) -> {
        FamilyMember fm = new FamilyMember();
        fm.setId(rs.getLong("id"));
        fm.setUserId(rs.getLong("user_id"));
        fm.setFullName(rs.getString("full_name"));
        fm.setRelationship(rs.getString("relationship"));
        fm.setDateOfBirth(rs.getDate("date_of_birth") != null ? rs.getDate("date_of_birth").toLocalDate() : null);
        fm.setCareType(rs.getString("care_type"));
        fm.setMedicalNotes(rs.getString("medical_notes"));
        fm.setCreatedBy(rs.getLong("created_by"));
        fm.setUpdatedBy(rs.getLong("updated_by"));
        return fm;
    };

    // UC#3 — Get all family members for a specific user
    public List<FamilyMember> findAllByUserId(Long userId) {
        return jdbcTemplate.query(
            "SELECT * FROM family_member WHERE user_id = ?",
            rowMapper, userId);
    }

    // Get a single family member by id (validates user ownership at controller)
    public Optional<FamilyMember> findById(Long id) {
        List<FamilyMember> results = jdbcTemplate.query(
            "SELECT * FROM family_member WHERE id = ?",
            rowMapper, id);
        return results.stream().findFirst();
    }

    // UC#3 — Add a family member
    public FamilyMember save(FamilyMember fm) {
        String sql = "INSERT INTO family_member (user_id, full_name, relationship, date_of_birth, care_type, medical_notes, created_by, updated_by) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, fm.getUserId());
            ps.setString(2, fm.getFullName());
            ps.setString(3, fm.getRelationship());
            if (fm.getDateOfBirth() != null) {
                ps.setDate(4, Date.valueOf(fm.getDateOfBirth()));
            } else {
                ps.setNull(4, Types.DATE);
            }
            ps.setString(5, fm.getCareType());
            ps.setString(6, fm.getMedicalNotes());
            setNullableLong(ps, 7, fm.getCreatedBy());
            setNullableLong(ps, 8, fm.getUpdatedBy());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            fm.setId(keyHolder.getKey().longValue());
        }
        return fm;
    }

    // UC#4 — Update a family member
    public int update(FamilyMember fm) {
        String sql = "UPDATE family_member SET full_name = ?, relationship = ?, date_of_birth = ?, " +
                     "care_type = ?, medical_notes = ?, updated_by = ? WHERE id = ? AND user_id = ?";
        return jdbcTemplate.update(sql,
            fm.getFullName(),
            fm.getRelationship(),
            fm.getDateOfBirth() != null ? Date.valueOf(fm.getDateOfBirth()) : null,
            fm.getCareType(),
            fm.getMedicalNotes(),
            fm.getUpdatedBy(),
            fm.getId(),
            fm.getUserId()
        );
    }

    // UC#4 — Delete a family member (only if owned by the user)
    public int deleteByIdAndUserId(Long id, Long userId) {
        return jdbcTemplate.update(
            "DELETE FROM family_member WHERE id = ? AND user_id = ?", id, userId);
    }

    private void setNullableLong(PreparedStatement ps, int index, Long value) throws java.sql.SQLException {
        if (value != null) {
            ps.setLong(index, value);
        } else {
            ps.setNull(index, Types.BIGINT);
        }
    }
}
