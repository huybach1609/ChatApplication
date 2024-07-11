package com.learn.userservice.service;

import com.learn.userservice.model.User;
import com.learn.userservice.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@Slf4j
public class CustomOidcUserService extends OidcUserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) {
        OidcUser oidcUser = super.loadUser(userRequest);
        log.info("loadUser: " + oidcUser);
        return saveToDatabase(oidcUser);
    }

    private OidcUser saveToDatabase(OidcUser oidcUser) {
        Optional<User> userOptional = userRepository.findByEmail(oidcUser.getEmail());

        if(userOptional.isPresent()){
            updateExistingUser(userOptional.get(), oidcUser);
        }else{
            createUser(oidcUser);
        }
        return oidcUser;
    }

    private void  createUser(OidcUser oidcUser) {
        User user = new User();
        user.setId(UUID.nameUUIDFromBytes(oidcUser.getEmail().getBytes()).toString());
        user.setUsername(oidcUser.getEmail());
        user.setEmail(oidcUser.getEmail());
        user.setPicture(oidcUser.getPicture());
        user.setPassword( new BCryptPasswordEncoder().encode("123"));
        log.info("createUser: {}", user);
        userRepository.save(user);
    }

    private void updateExistingUser(User user, OidcUser oidcUser) {
        user.setUsername(oidcUser.getEmail());
        user.setEmail(oidcUser.getEmail());
        user.setPicture(oidcUser.getPicture());
        log.info("updateExistingUser: {}", user);
        userRepository.save(user);
    }

}
