package com.hhcc.scheduling.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hhcc.scheduling.model.CareBooking;
import com.hhcc.scheduling.repository.CareBookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for {@link CareBookingController}.
 *
 * <p>
 * Uses {@link WebMvcTest} to load only the web layer with a mocked {@link CareBookingRepository}. Covers create, list,
 * get-by-id, cancel, status filtering, empty results, and 404 failure scenarios.
 * </p>
 */
@WebMvcTest(CareBookingController.class)
class CareBookingControllerImplTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CareBookingRepository repository;

    private final ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());

    private CareBooking buildBooking(Long id, Long userId) {
        CareBooking b = new CareBooking();
        b.setId(id);
        b.setUserId(userId);
        b.setFacilityId(1L);
        b.setCareType("CHILDCARE");
        b.setDependentType("FAMILY_MEMBER");
        b.setDependentId(1L);
        b.setPickupTime(LocalDateTime.of(2026, 4, 5, 8, 0));
        b.setDropoffTime(LocalDateTime.of(2026, 4, 5, 17, 0));
        b.setStatus("PENDING");
        b.setNotes("Test booking");
        b.setCreatedBy(userId);
        b.setUpdatedBy(userId);
        return b;
    }

    @Test
    void create_returnsCreatedBooking() throws Exception {
        CareBooking input = buildBooking(null, 2L);
        CareBooking saved = buildBooking(10L, 2L);

        when(repository.save(any(CareBooking.class))).thenReturn(saved);

        mockMvc.perform(post("/api/v1/scheduling/bookings").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(input))).andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(10))).andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.careType", is("CHILDCARE")));

        verify(repository).save(any(CareBooking.class));
    }

    @Test
    void getAllByUser_returnsBookings() throws Exception {
        when(repository.findAllByUserId(2L, null)).thenReturn(List.of(buildBooking(1L, 2L), buildBooking(2L, 2L)));

        mockMvc.perform(get("/api/v1/scheduling/bookings/2")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        verify(repository).findAllByUserId(2L, null);
    }

    @Test
    void getAllByUser_withStatusFilter() throws Exception {
        CareBooking confirmed = buildBooking(1L, 2L);
        confirmed.setStatus("CONFIRMED");
        when(repository.findAllByUserId(2L, "CONFIRMED")).thenReturn(List.of(confirmed));

        mockMvc.perform(get("/api/v1/scheduling/bookings/2").param("status", "CONFIRMED")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1))).andExpect(jsonPath("$[0].status", is("CONFIRMED")));

        verify(repository).findAllByUserId(2L, "CONFIRMED");
    }

    @Test
    void getAllByUser_returnsEmptyList() throws Exception {
        when(repository.findAllByUserId(99L, null)).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/scheduling/bookings/99")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getById_returnsBooking() throws Exception {
        when(repository.findByIdAndUserId(1L, 2L)).thenReturn(Optional.of(buildBooking(1L, 2L)));

        mockMvc.perform(get("/api/v1/scheduling/bookings/2/1")).andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1))).andExpect(jsonPath("$.userId", is(2)));
    }

    @Test
    void getById_returns404WhenNotFound() throws Exception {
        when(repository.findByIdAndUserId(999L, 2L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/scheduling/bookings/2/999")).andExpect(status().isNotFound());
    }

    @Test
    void cancel_returns204OnSuccess() throws Exception {
        when(repository.cancelByIdAndUserId(1L, 2L, 2L)).thenReturn(1);

        mockMvc.perform(delete("/api/v1/scheduling/bookings/2/1")).andExpect(status().isNoContent());

        verify(repository).cancelByIdAndUserId(1L, 2L, 2L);
    }

    @Test
    void cancel_returns404WhenNotFound() throws Exception {
        when(repository.cancelByIdAndUserId(999L, 2L, 2L)).thenReturn(0);

        mockMvc.perform(delete("/api/v1/scheduling/bookings/2/999")).andExpect(status().isNotFound());
    }
}
