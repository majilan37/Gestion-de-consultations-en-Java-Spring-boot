package com.example.consultation.services;

import com.example.consultation.models.Doctor;
import com.example.consultation.repositories.DoctorRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        if (doctor.isPresent()) {
            return doctor.get();
        } else {
            throw new RuntimeException("Doctor not found!");
        }
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor doctor) {
        Optional<Doctor> existingDoctor = doctorRepository.findById(id);
        if (existingDoctor.isPresent()) {
            doctor.setId(id);
            return doctorRepository.save(doctor);
        } else {
            throw new RuntimeException("Doctor not found!");
        }
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}
