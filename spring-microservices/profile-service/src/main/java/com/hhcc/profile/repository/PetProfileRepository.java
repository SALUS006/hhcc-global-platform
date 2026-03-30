package com.hhcc.profile.repository;

import com.hhcc.profile.model.PetProfile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Types;
import java.util.List;
import java.util.Optional;

@Repository
public class PetProfileRepository {

    private final JdbcTemplate jdbcTemplate;

    public PetProfileRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<PetProfile> rowMapper = (rs, rowNum) -> {
        PetProfile pet = new PetProfile();
        pet.setId(rs.getLong("id"));
        pet.setUserId(rs.getLong("user_id"));
        pet.setPetName(rs.getString("pet_name"));
        pet.setSpecies(rs.getString("species"));
        pet.setBreed(rs.getString("breed"));
        pet.setAgeYears(rs.getObject("age_years") != null ? rs.getInt("age_years") : null);
        pet.setMedicalNotes(rs.getString("medical_notes"));
        pet.setCreatedBy(rs.getLong("created_by"));
        pet.setUpdatedBy(rs.getLong("updated_by"));
        return pet;
    };

    // UC#5 — Get all pets for a specific user
    public List<PetProfile> findAllByUserId(Long userId) {
        return jdbcTemplate.query(
            "SELECT * FROM pet_profile WHERE user_id = ?",
            rowMapper, userId);
    }

    // Get a single pet by id
    public Optional<PetProfile> findById(Long id) {
        List<PetProfile> results = jdbcTemplate.query(
            "SELECT * FROM pet_profile WHERE id = ?",
            rowMapper, id);
        return results.stream().findFirst();
    }

    // UC#5 — Add a pet
    public PetProfile save(PetProfile pet) {
        String sql = "INSERT INTO pet_profile (user_id, pet_name, species, breed, age_years, medical_notes, created_by, updated_by) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, pet.getUserId());
            ps.setString(2, pet.getPetName());
            ps.setString(3, pet.getSpecies());
            ps.setString(4, pet.getBreed());
            if (pet.getAgeYears() != null) {
                ps.setInt(5, pet.getAgeYears());
            } else {
                ps.setNull(5, Types.INTEGER);
            }
            ps.setString(6, pet.getMedicalNotes());
            setNullableLong(ps, 7, pet.getCreatedBy());
            setNullableLong(ps, 8, pet.getUpdatedBy());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            pet.setId(keyHolder.getKey().longValue());
        }
        return pet;
    }

    // UC#6 — Update a pet
    public int update(PetProfile pet) {
        String sql = "UPDATE pet_profile SET pet_name = ?, species = ?, breed = ?, " +
                     "age_years = ?, medical_notes = ?, updated_by = ? WHERE id = ? AND user_id = ?";
        return jdbcTemplate.update(sql,
            pet.getPetName(),
            pet.getSpecies(),
            pet.getBreed(),
            pet.getAgeYears(),
            pet.getMedicalNotes(),
            pet.getUpdatedBy(),
            pet.getId(),
            pet.getUserId()
        );
    }

    // UC#6 — Delete a pet (only if owned by the user)
    public int deleteByIdAndUserId(Long id, Long userId) {
        return jdbcTemplate.update(
            "DELETE FROM pet_profile WHERE id = ? AND user_id = ?", id, userId);
    }

    private void setNullableLong(PreparedStatement ps, int index, Long value) throws java.sql.SQLException {
        if (value != null) {
            ps.setLong(index, value);
        } else {
            ps.setNull(index, Types.BIGINT);
        }
    }
}
