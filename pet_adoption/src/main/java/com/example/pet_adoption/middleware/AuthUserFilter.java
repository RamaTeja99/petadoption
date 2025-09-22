package com.example.pet_adoption.middleware;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.example.pet_adoption.util.JwtUtil;
import java.io.IOException;
import java.util.Collections;

@Component
public class AuthUserFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        System.out.println("AuthUserFilter: Processing " + requestURI);
        
        // Skip authentication for public endpoints
        if (isPublicEndpoint(requestURI)) {
            System.out.println("AuthUserFilter: Public endpoint, skipping auth");
            filterChain.doFilter(request, response);
            return;
        }
        
        // Check if this is a user endpoint that requires authentication
        if (requestURI.startsWith("/user/") && !isPublicUserEndpoint(requestURI)) {
            System.out.println("AuthUserFilter: User endpoint requiring auth");
            String token = request.getHeader("token");
            
            if (token == null || token.isEmpty()) {
                System.out.println("AuthUserFilter: No token provided");
                sendUnauthorizedResponse(response, "Not Authorized Login Again");
                return;
            }
            
            System.out.println("AuthUserFilter: Validating token: " + token.substring(0, Math.min(token.length(), 20)) + "...");
            
            try {
                if (!jwtUtil.validateToken(token)) {
                    System.out.println("AuthUserFilter: Token validation failed");
                    sendUnauthorizedResponse(response, "Invalid token");
                    return;
                }
                
                if (jwtUtil.isTokenExpired(token)) {
                    System.out.println("AuthUserFilter: Token expired");
                    sendUnauthorizedResponse(response, "Token expired");
                    return;
                }
                
                String userId = jwtUtil.getUserIdFromToken(token);
//                String email = jwtUtil.getEmailFromToken(token);
                request.setAttribute("userId", Long.valueOf(userId));
//                request.setAttribute("userEmail", email);
                
                // **CRITICAL**: Set Spring Security authentication context
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                System.out.println("AuthUserFilter: Token valid, userId: " + userId  + " - Authentication set!");
            } catch (Exception e) {
                System.out.println("AuthUserFilter: Error processing token: " + e.getMessage());
                sendUnauthorizedResponse(response, "Invalid token");
                return;
            }
        }
        
        // Check admin endpoints (future feature)
        if (requestURI.startsWith("/admin/") && !requestURI.contains("/admin/login")) {
            String atoken = request.getHeader("atoken");
            
            if (atoken == null || atoken.isEmpty()) {
                sendUnauthorizedResponse(response, "Admin access required");
                return;
            }
            
            // Simple admin token validation (enhance as needed)
            if (!atoken.startsWith("admin-token-")) {
                sendUnauthorizedResponse(response, "Invalid admin token");
                return;
            }
            
            // Set authentication for admin
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken("admin", null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        // Pet endpoints are currently public - no authentication needed
        
        System.out.println("AuthUserFilter: Proceeding with request");
        filterChain.doFilter(request, response);
    }
    
    private boolean isPublicEndpoint(String uri) {
        return uri.contains("/images/") || 
               uri.equals("/") || 
               uri.contains("/error") ||
               uri.contains("/h2-console");
    }
    
    private boolean isPublicUserEndpoint(String uri) {
        return uri.contains("/user/login") || 
               uri.contains("/user/register");
    }
    
    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(String.format("{\"success\": false, \"message\": \"%s\"}", message));
    }
}