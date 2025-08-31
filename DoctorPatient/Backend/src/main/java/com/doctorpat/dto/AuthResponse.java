package com.doctorpat.dto;

import com.doctorpat.entity.User;

public class AuthResponse {
    
    private String token;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserDto user;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, String refreshToken, Long expiresIn, User user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = new UserDto(user);
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public Long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
    
    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
        this.user = user;
    }
    
    // Inner UserDto class
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String phoneNumber;
        private String profileImage;
        private String specialization;
        private String address;
        private String dateOfBirth;
        private String gender;
        
        public UserDto() {}
        
        public UserDto(User user) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.role = user.getRole().name();
            this.phoneNumber = user.getPhoneNumber();
            this.profileImage = user.getProfileImage();
            this.specialization = user.getSpecialization();
            this.address = user.getAddress();
            this.dateOfBirth = user.getDateOfBirth();
            this.gender = user.getGender() != null ? user.getGender().name() : null;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
        
        public String getPhoneNumber() {
            return phoneNumber;
        }
        
        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        
        public String getProfileImage() {
            return profileImage;
        }
        
        public void setProfileImage(String profileImage) {
            this.profileImage = profileImage;
        }
        
        public String getSpecialization() {
            return specialization;
        }
        
        public void setSpecialization(String specialization) {
            this.specialization = specialization;
        }
        
        public String getAddress() {
            return address;
        }
        
        public void setAddress(String address) {
            this.address = address;
        }
        
        public String getDateOfBirth() {
            return dateOfBirth;
        }
        
        public void setDateOfBirth(String dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
        }
        
        public String getGender() {
            return gender;
        }
        
        public void setGender(String gender) {
            this.gender = gender;
        }
    }
}
