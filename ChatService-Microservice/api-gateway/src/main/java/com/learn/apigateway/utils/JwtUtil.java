package com.learn.apigateway.utils;

import com.learn.apigateway.exception.IdMismatchException;
import com.learn.apigateway.exception.ResourceNotFoundException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import io.jsonwebtoken.security.UnsupportedKeyException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);
    @Value("${secure-key}")
    private String secureKey;
    @Value("${jwt-time-expire}")
    private long jwtTimeExpire;

    public String getUsername(String token) {
        if(!validateToken(token)){
            return null;
        }
        return Jwts.parser().verifyWith((SecretKey) key()).build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String generateToken(String username) {
        Date expirationDate = new Date(System.currentTimeMillis() + jwtTimeExpire);

        String token = Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(expirationDate)
                .signWith(key())
                .compact();
        log.info("token generated: {}", token);
        return token;
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secureKey));
    }

    public Boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build().parse(token);
            return true;
        }catch(SignatureException e){
            throw new IdMismatchException(HttpStatus.BAD_REQUEST, "Invalid JWT Token");
        } catch (MalformedJwtException e) {
            throw new IdMismatchException(HttpStatus.BAD_REQUEST, "Invalid JWT Token");
        } catch (ExpiredJwtException e) {
            throw new ResourceNotFoundException(HttpStatus.BAD_REQUEST, "Expired JWT Token");
        } catch (UnsupportedKeyException e) {
            throw new ResourceNotFoundException(HttpStatus.BAD_REQUEST, "Unsupported JWT Token");
        } catch (IllegalArgumentException e) {
            throw new IdMismatchException(HttpStatus.BAD_REQUEST, "Jwt claims string is null or empty"); }
    }

}