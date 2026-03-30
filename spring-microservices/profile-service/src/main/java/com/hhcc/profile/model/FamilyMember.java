package com.hhcc.profile.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FamilyMember {
    private Long id;
    private Long userId;
    private String fullName;
    private String relationship;   // Child, Spouse, Parent, Sibling, Other
    private LocalDate dateOfBirth;
    private String careType;       // CHILDCARE, ELDERLY
    private String medicalNotes;
    private LocalDateTime createdDt;
    private Long createdBy;
    private LocalDateTime updatedDt;
    private Long updatedBy;
}
