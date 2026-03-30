package com.hhcc.profile.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PetProfile {
    private Long id;
    private Long userId;
    private String petName;
    private String species;        // Dog, Cat, Bird, Other
    private String breed;
    private Integer ageYears;
    private String medicalNotes;
    private LocalDateTime createdDt;
    private Long createdBy;
    private LocalDateTime updatedDt;
    private Long updatedBy;
}
