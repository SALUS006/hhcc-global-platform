package com.hhcc.profile.model;

import lombok.Data;

@Data
public class UserProfile {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String contactNumber;
    private Long createdBy;
    private Long updatedBy;
}
