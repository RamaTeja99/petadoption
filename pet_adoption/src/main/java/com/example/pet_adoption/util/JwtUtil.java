package com.example.pet_adoption.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    
    private final String SECRET_KEY = "a33d41d1c744044c4c4b7467e018385d23db926d1a76d11b14b94f0d290d1c50a32205ec1acc298803a13a93f8e967894d7843aeec3e9e81eea223a5a459a0a8";
    private final int JWT_TOKEN_VALIDITY = 24 * 60 * 60; // 24 hours in seconds
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
    
    // Generate token with user details
    public String generateToken(Long userId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);
        return createToken(claims, email);
    }
    
    // Create JWT token
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000L))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    // Extract username from token
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
    
    // Extract user ID from token
    public String getUserIdFromToken(String token) {
        final Claims claims = getAllClaimsFromToken(token);
        return claims.get("userId").toString();
    }
    
    // Extract email from token
    public String getEmailFromToken(String token) {
        final Claims claims = getAllClaimsFromToken(token);
        return claims.get("email").toString();
    }
    
    // Extract expiration date from token
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }
    
    // Extract any claim from token
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
    
    // Extract all claims from token
    private Claims getAllClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("JWT parsing failed: " + e.getMessage());
            throw e;
        }
    }
    
    // Check if token is expired
    public Boolean isTokenExpired(String token) {
        try {
            final Date expiration = getExpirationDateFromToken(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            System.out.println("Token expiration check failed: " + e.getMessage());
            return true; // Treat invalid tokens as expired
        }
    }
    
    // Validate token
    public Boolean validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                System.out.println("Token is null or empty");
                return false;
            }
            
            // Parse the token - this will throw exception if invalid
            getAllClaimsFromToken(token);
            
            // Check if expired
            if (isTokenExpired(token)) {
                System.out.println("Token is expired");
                return false;
            }
            
            System.out.println("Token validation successful");
            return true;
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("JWT validation failed: " + e.getMessage());
        }
        return false;
    }
}