import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Dictionary {

    @JsonProperty("language")
    private final String language;

    public Dictionary(String language) {
        this.language = language;
    }

}
