package com.neuralsoftai.controller;

import com.neuralsoftai.dto.ApiResponse;
import com.neuralsoftai.dto.ContactRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse> handleContactForm(
            @Valid @RequestBody ContactRequest contactRequest,
            BindingResult bindingResult) {

        logger.info("Received contact form submission: {}", contactRequest);

        // Check for validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            
            logger.warn("Contact form validation failed: {}", errors);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Validation failed", errors));
        }

        try {
            // Log the contact request (in production, you would save to database and send email)
            logger.info("Contact form received from {} ({})", 
                    contactRequest.getName(), contactRequest.getEmail());
            
            if (contactRequest.getSubject() != null && !contactRequest.getSubject().isEmpty()) {
                logger.info("Subject: {}", contactRequest.getSubject());
            }
            
            logger.info("Message: {}", contactRequest.getMessage());
            
            // Simulate processing delay
            Thread.sleep(1000);
            
            // In a real application, you would:
            // 1. Save to database
            // 2. Send email notification
            // 3. Maybe send confirmation email to the user
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("timestamp", LocalDateTime.now());
            responseData.put("referenceId", generateReferenceId());
            responseData.put("name", contactRequest.getName());
            responseData.put("email", contactRequest.getEmail());
            
            logger.info("Contact form processed successfully for {}", contactRequest.getEmail());
            
            return ResponseEntity.ok(ApiResponse.success(
                "Thank you for your message! We'll get back to you soon.",
                responseData
            ));
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("Contact form processing interrupted", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Processing interrupted. Please try again."));
        } catch (Exception e) {
            logger.error("Error processing contact form", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("An error occurred while processing your request. Please try again."));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse> healthCheck() {
        Map<String, Object> healthData = new HashMap<>();
        healthData.put("status", "UP");
        healthData.put("timestamp", LocalDateTime.now());
        healthData.put("service", "NeuralSoft AI Backend");
        healthData.put("version", "1.0.0");
        
        return ResponseEntity.ok(ApiResponse.success("Service is healthy", healthData));
    }

    @GetMapping("/info")
    public ResponseEntity<ApiResponse> getServiceInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("service", "NeuralSoft AI Contact API");
        info.put("description", "Backend service for handling contact form submissions");
        info.put("version", "1.0.0");
        info.put("endpoints", Map.of(
            "POST /api/contact", "Submit contact form",
            "GET /api/health", "Health check endpoint",
            "GET /api/info", "Service information"
        ));
        
        return ResponseEntity.ok(ApiResponse.success("Service information", info));
    }

    private String generateReferenceId() {
        return "NS-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
    }
}
