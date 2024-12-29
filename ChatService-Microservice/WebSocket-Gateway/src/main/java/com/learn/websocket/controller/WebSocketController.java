package com.learn.websocket.controller;

import com.hazelcast.core.HazelcastInstance;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.*;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.concurrent.ConcurrentMap;

@RestController
@RequestMapping("/api/ws")
public class WebSocketController {
    private static final Logger log = LoggerFactory.getLogger(WebSocketController.class);

    @Value("${nothing}")
    String hostIp;

    private final ApplicationContext context;
    private final HazelcastInstance hazelcastInstance;
    private Environment environment;

    public WebSocketController(ApplicationContext context, @Qualifier("hazelcastInstanceConfig") HazelcastInstance hazelcastInstance, Environment environment) {
        this.context = context;
        this.hazelcastInstance = hazelcastInstance;
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

    @PostMapping("/addValue")
    public String addValue(@RequestParam String key, @RequestParam String value) {
        retrieveMap().put(key, value);
        return key + " " + value;
    }
    @GetMapping("/getValue")
    public String getValue(@RequestParam String key){
       return retrieveMap().get(key);
    }

    private ConcurrentMap<String, String > retrieveMap(){
        return hazelcastInstance.getMap("map");
    }
}
