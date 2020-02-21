"use strict";

// const { TextAnalyticsClient, CognitiveServicesCredentials } = require("@azure/cognitiveservices-textanalytics");

const os = require("os");
const CognitiveServicesCredentials = require("@azure/ms-rest-js");
const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
var config = require("../../config/index.ts");
let subscriptionKey = config.getValue('textKey');
const endpoint = config.getValue('textEndpoint');
const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscriptionKey } });
const textAnalyticsClient = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, endpoint);


async function getSentiment(jsoninput){

   // console.log("This will perform sentiment analysis on the sentences.");
    // const sentimentInput = 'I had the best day of my life.This was a waste of my time. The speaker put me to sleep.'
    //
    const sentimentResult = await textAnalyticsClient.sentiment({
        multiLanguageBatchInput: jsoninput
    });
    //console.log(sentimentResult.documents);
    console.log(os.EOL);
    var pos = 0;
    var neu= 0;
    var neg= 0;
    var json = [];
    sentimentResult.documents.forEach(document => {
        if (document.score>0.6) {
            pos += 1
        }
        else if (document<0.4){
            neg += 1
        }
        else {
            neu +=1
        }
    });
    json.push({positive:pos,negative:neg,neutral:neu});
    console.log(json);
    return json;

}

//
// // <languageDetection>
// async function languageDetection(client) {
//
//     console.log("1. This will detect the languages of the inputs.");
//     const languageInput = {
//         documents: [
//             { id: "1", text: "This is a document written in English." },
//             { id: "2", text: "Este es un document escrito en Español." },
//             { id: "3", text: "这是一个用中文写的文件" }
//         ]
//     };
//
//     const languageResult = await client.detectLanguage({
//         languageBatchInput: languageInput
//     });
//
//     languageResult.documents.forEach(document => {
//         console.log(`ID: ${document.id}`);
//         document.detectedLanguages.forEach(language =>
//             console.log(`\tLanguage ${language.name}`)
//         );
//     });
//     console.log(os.EOL);
// }
// languageDetection(textAnalyticsClient);
// // </languageDetection>

// <keyPhraseExtraction>
async function getKeyphrase(jsoninput){

   // console.log("2. This will extract key phrases from the sentences.");
    // const keyPhrasesInput = {
    //     documents: [
    //         { language: "ja", id: "1", text: "猫は幸せ" },
    //         {
    //             language: "de",
    //             id: "2",
    //             text: "Fahrt nach Stuttgart und dann zum Hotel zu Fu."
    //         },
    //         {
    //             language: "en",
    //             id: "3",
    //             text: "My cat might need to see a veterinarian."
    //         },
    //         { language: "es", id: "4", text: "A mi me encanta el fútbol!" }
    //     ]
    // };

    const keyPhraseResult = await textAnalyticsClient.keyPhrases({
        multiLanguageBatchInput: jsoninput
    });
    console.log(keyPhraseResult.documents);
    console.log(os.EOL);
    return keyPhraseResult.documents;
}
// keyPhraseExtraction();
// </keyPhraseExtraction>



// <entityRecognition>
async function getEntity(jsoninput){
    //console.log("3. This will perform Entity recognition on the sentences.");

    // const entityInputs = {
    //     documents: [
    //         {
    //             language: "en",
    //             id: "1",
    //             text:
    //                 "coldwar, worldwar2, election, WWE, OECD, IOC, olymics and independence day and New York Samsung and Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800"
    //         }
    //     ]
    // };

    const entityResults = await textAnalyticsClient.entities({
        multiLanguageBatchInput: jsoninput
    });

    //console.log(entityResults.documents)
    var json = [];

    entityResults.documents.forEach(document => {

        // console.log(`Document ID: ${document.id}`);

        document.entities.forEach(e => {
            //console.log(`${document.id},${e.name}, ${e.type}`);
            // e.matches.forEach(match =>
            //     console.log(
            //         `\t\tOffset: ${match.offset} Length: ${match.length} Score: ${
            //             match.entityTypeScore
            //             }`
            //     )

            // );
            json.push({name:e.name, type:e.type});


        });
    });
    console.log(json);


    console.log(os.EOL);
}

//getSentiment(jsoninputs);
//entityRecognition(jsoninput);
// </entityRecognition>
exports.getEntity = getEntity;
exports.getKeyphrase = getKeyphrase;
exports.getSentiment = getSentiment;