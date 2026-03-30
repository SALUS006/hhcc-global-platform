package com.hhcc.profile.repository;

import com.hhcc.profile.model.UserProfile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class UserProfileRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserProfileRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<UserProfile> rowMapper = (rs, rowNum) -> {
        UserProfile profile = new UserProfile();
        profile.setId(rs.getLong("id"));
        profile.setFullName(rs.getString("full_name"));
        profile.setEmail(rs.getString("email"));
        profile.setRole(rs.getString("role"));
        profile.setContactNumber(rs.getString("contact_number"));
        profile.setCreatedBy(rs.getLong("created_by"));
        profile.setUpdatedBy(rs.getLong("updated_by"));
        return profile;
    };

    public List<UserProfile> findAll() {
        return jdbcTemplate.query("SELECT * FROM user_profile", rowMapper);
    }

    public void checkDbConnection() {
        jdbcTemplate.execute("SELECT 1");
    }

    public UserProfile save(UserProfile profile) {
        String sql = "INSERT INTO user_profile (full_name, email, role, contact_number, created_by, updated_by) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, profile.getFullName());
            ps.setString(2, profile.getEmail());
            ps.setString(3, profile.getRole());
            ps.setString(4, profile.getContactNumber());
            
            if (profile.getCreatedBy() != null) {
                ps.setLong(5, profile.getCreatedBy());
            } else {
                ps.setNull(5, java.sql.Types.BIGINT);
            }
            
            if (profile.getUpdatedBy() != null) {
                ps.setLong(6, profile.getUpdatedBy());
            } else {
                ps.setNull(6, java.sql.Types.BIGINT);
            }
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            profile.setId(keyHolder.getKey().longValue());
        }
        return profile;
    }
}
