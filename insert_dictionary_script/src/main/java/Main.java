import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import entities.Dictionary;
import entities.MongoConfiguration;
import entities.Word;
import org.bson.Document;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static final String CONFIGURATION_FILE_PATH = "java_scripts/src/main/config/config.json";

    public static void main(String[] args) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        MongoConfiguration configuration = new ObjectMapper()
                .readValue(new File(CONFIGURATION_FILE_PATH), MongoConfiguration.class);

        String mongoDBURL = configuration.getMongoDBURL();
        String dictionaryPath = configuration.getDictionaryPath();
        String dictionaryName = configuration.getDictionaryName();

        MongoClient mongoClient = MongoClients.create(mongoDBURL);
        MongoDatabase database = mongoClient.getDatabase("roscodrom");
        MongoCollection<Document> dictionaryCollection = database.getCollection("dictionaries");

        if (dictionaryCollection.countDocuments(Filters.eq("name", dictionaryName)) == 0) {
            Dictionary dictionary = new Dictionary(dictionaryName);
            Document dictionaryData = Document.parse(mapper.writeValueAsString(dictionary));
            dictionaryCollection.insertOne(dictionaryData);
        }

        File dictionaryFile = new File(dictionaryPath);
        BufferedReader fileReader = new BufferedReader(new FileReader(dictionaryFile));
        List<Document> words = new ArrayList<>();
        String line;
        while ((line = fileReader.readLine()) != null) {
            String wordData = mapper.writeValueAsString(new Word(line, 0, dictionaryName));
            words.add(Document.parse(wordData));
        }
        fileReader.close();

        MongoCollection<Document> wordCollection = database.getCollection("words");
        wordCollection.insertMany(words);

        mongoClient.close();
    }

}


/*
List<entities.Word> words = new ArrayList<>();
        File dictionaryFile = new File(dictionaryPath);
        try (BufferedReader fileReader = new BufferedReader(new FileReader(dictionaryFile))) {
            String line;
            while ((line = fileReader.readLine()) != null) {
                entities.Word word = new entities.Word(line, 0);
                words.add(word);
            }
        }
 */