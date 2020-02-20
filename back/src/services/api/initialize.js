var entity = require('./entity.js');
//entity.getLocation('newyork burger'); <- type location

var image = require('./image.js');
//image.getImage('Obama')

var summarize = require('./summarization.js');
//summarize.getSummarize('simple text'); <-

var text = require('./text_analysis.js');

const jsoninputs= { // const sentimentInput = {
    documents: [
        { language: "en", id: "1", text: "I had the best day of my life." },
        {
            language: "en",
            id: "2",
            text: "This was a waste of my time coldwar, worldwar2, election, WWE, OECD, IOC, olymics and independence day . The speaker put me to sleep."
        },
        {
            language: "es",
            id: "3",
            text: "No tengo dinero ni nada que dar..."
        },
        {
            language: "it",
            id: "4",
            text:
                "L'hotel veneziano era meraviglioso. È un bellissimo pezzo di architettura."
        }
    ]
};
text.getEntity(jsoninputs);
text.getKeyphrase(jsoninputs);
text.getSentiment(jsoninputs);



// function RecordInitialize( sentence  ) {
//
//     //common initialize
//
//     //text analysis  -> {entity search (이미지, 안나오면, imagesearch 2개 ) }
//     //return info
//
// }
//
// function getAdditional(entity){
//
// }