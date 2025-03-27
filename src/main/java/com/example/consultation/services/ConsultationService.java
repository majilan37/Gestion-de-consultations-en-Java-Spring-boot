package com.example.consultation.services;

import com.example.consultation.models.Consultation;
import com.example.consultation.repositories.ConsultationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultationService {
    private final ConsultationRepository consultationRepository;

    public ConsultationService(ConsultationRepository consultationRepository) {
        this.consultationRepository = consultationRepository;
    }

    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public Consultation createConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    public Consultation updateConsultation(Long id, Consultation consultation) {
        Optional<Consultation> existingConsultation = consultationRepository.findById(id);
        if (existingConsultation.isPresent()) {
            consultation.setId(id);
            return consultationRepository.save(consultation);
        } else {
            throw new RuntimeException("Consultation not found!");
        }
    }

    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }
}

