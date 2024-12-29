package com.learn.apigateway.config;

import com.learn.apigateway.filter.JwtRequestFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
   private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http.csrf(AbstractHttpConfigurer::disable).authorizeHttpRequests(auth ->{
                auth.requestMatchers(HttpMethod.POST,
                        "/api/auth/login").permitAll();
               auth.requestMatchers("/ws/**").permitAll() ;
                  auth.requestMatchers(
                          "/api/auth/login",
                          "/api/auth/info",
                          "/api/auth/register",
                          "/oauth2/**",
                          "/eureka/web",
                          "/eureka/**",
                          "/api/public","/swagger-ui/**", "/v3/api-docs/**", "/v3/api-docs.yaml", "/aggregate/**"

                  ).permitAll();
                  auth.anyRequest().authenticated();
              })
              .sessionManagement(sessionManager -> sessionManager.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
      http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
      return http.build();
   }
}
