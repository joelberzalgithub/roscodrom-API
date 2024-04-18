import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;

public class MongoConfiguration {

    @JsonProperty("mongoPassword")
    private String password;

    @JsonProperty("mongoUser")
    private String user;

    @JsonProperty("mongoIp")
    private String ip;

    @JsonProperty("mongoPort")
    private String port;

    @JsonProperty("dictionaryPath")
    private String dictionaryPath;

    @JsonProperty("dictionaryName")
    private String dictionaryName;

    public MongoConfiguration() {

    }

    public MongoConfiguration(String password, String user, String ip, String port) {
        this.password = password;
        this.user = user;
        this.ip = ip;
        this.port = port;
    }

    public String getMongoDBURL() {
        return "mongodb://" + user + ":" + password + "@" + ip + ":" + port + "/";
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String user) {
        this.user = user;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getDictionaryPath() {
        return dictionaryPath;
    }

    public String getDictionaryName() {
        return dictionaryName;
    }

    @Override
    public String toString() {
        return "MongoConfiguration{" + "password='" + password + '\'' + ", user='" + user + '\'' + ", ip='" + ip + '\'' + ", port='" + port + '\'' + '}';
    }
}
