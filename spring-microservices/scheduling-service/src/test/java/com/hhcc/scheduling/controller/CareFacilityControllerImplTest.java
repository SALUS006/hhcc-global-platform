package com.hhcc.scheduling.controller;

import com.hhcc.scheduling.model.CareFacility;
import com.hhcc.scheduling.repository.CareFacilityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for {@link CareFacilityController}.
 *
 * <p>
 * Uses {@link WebMvcTest} to load only the web layer with a mocked {@link CareFacilityRepository}. Covers happy-path
 * and 404 scenarios for the facility listing and detail endpoints.
 * </p>
 */
@WebMvcTest(CareFacilityController.class)
class CareFacilityControllerImplTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CareFacilityRepository repository;

    private CareFacility buildFacility(Long id, String name, String careTypes) {
        CareFacility f = new CareFacility();
        f.setId(id);
        f.setFacilityName(name);
        f.setLocationAddress("123 Main St");
        f.setDescription("Test facility");
        f.setSupportedCareTypes(careTypes);
        f.setIsActive(true);
        f.setCreatedBy(1L);
        f.setUpdatedBy(1L);
        return f;
    }

    @Test
    void getAll_returnsAllActiveFacilities() throws Exception {
        when(repository.findAllActive(null)).thenReturn(List.of(buildFacility(1L, "Sunshine Childcare", "CHILDCARE"),
                buildFacility(2L, "Pet Care Hub", "PET")));

        mockMvc.perform(get("/api/v1/scheduling/facilities")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2))).andExpect(jsonPath("$[0].facilityName", is("Sunshine Childcare")))
                .andExpect(jsonPath("$[1].facilityName", is("Pet Care Hub")));

        verify(repository).findAllActive(null);
    }

    @Test
    void getAll_withCareTypeFilter_passesFilterToRepository() throws Exception {
        when(repository.findAllActive("PET")).thenReturn(List.of(buildFacility(2L, "Pet Care Hub", "PET")));

        mockMvc.perform(get("/api/v1/scheduling/facilities").param("careType", "PET")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1))).andExpect(jsonPath("$[0].supportedCareTypes", is("PET")));

        verify(repository).findAllActive("PET");
    }

    @Test
    void getAll_returnsEmptyList() throws Exception {
        when(repository.findAllActive(null)).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/scheduling/facilities")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getById_returnsFoundFacility() throws Exception {
        when(repository.findById(1L)).thenReturn(Optional.of(buildFacility(1L, "Sunshine Childcare", "CHILDCARE")));

        mockMvc.perform(get("/api/v1/scheduling/facilities/1")).andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1))).andExpect(jsonPath("$.facilityName", is("Sunshine Childcare")));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/scheduling/facilities/999")).andExpect(status().isNotFound());
    }
}
