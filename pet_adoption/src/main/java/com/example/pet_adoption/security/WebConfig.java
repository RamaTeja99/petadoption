package com.example.pet_adoption.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${image.upload.dir}")
    private String uploadDir;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded images - match with FileUploadUtil return path
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadDir + "/");
                
        // Also serve uploads folder for backward compatibility
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
