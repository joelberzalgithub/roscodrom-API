package entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.exc.IgnoredPropertyException;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Word {

    @JsonProperty("word")
    private final String word;

    @JsonProperty("guessCount")
    private final long guessCount;

    @JsonProperty("dictionaryName")
    private final String dictionaryname;

    public Word(String word, long guessCount, String dictionaryname) {
        this.word = word;
        this.guessCount = guessCount;
        this.dictionaryname = dictionaryname;
    }
}
