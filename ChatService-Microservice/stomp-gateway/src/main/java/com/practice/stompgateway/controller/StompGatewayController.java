package com.practice.stompgateway.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Slf4j
@RestController
@RequestMapping("/api/stomp")
public class StompGatewayController {
    @Value("${hostIp}")
    String hostIp;

    private final ApplicationContext context;
    private Environment environment;

    public StompGatewayController(ApplicationContext context, Environment environment) {
        this.context = context;
        this.environment = environment;
    }

    @GetMapping("/info")
    public String getInfoHost() throws UnknownHostException {

        String port = getLocalPort();
        // Local address
        String e = InetAddress.getLocalHost().getHostAddress();
        String b = InetAddress.getLocalHost().getHostName();

        log.info("port: {}", port);
        log.info("hostAddress: {}", e);
        log.info("hostName: {}", b);
        log.info(environment.getProperty("server.address"));
        return hostIp + ":" +  port;
    }
    private String getLocalPort() {
        return String.valueOf(((ServletWebServerApplicationContext) context).getWebServer().getPort());
    }
}
