import { MeetingModel, Meeting, Agenda } from "../model/meeting";
import { UserModel, User } from "../model/user";
import { ObjectId } from "bson";

/**
 * @description 회의가 끝나고 안건별로 분석
 * @param meetingId 조회할 회의 Id
 * @param agendaIndex 조회할 안건 index number
 * @return 아래의 내용을 담고 있는 dict
   {name:name,summarized:summarized,max_sentiment:max_sentiment, entities:entities};

 - 안건 제목 :name
 - 속기록 : 요약내용(summarized)
 - 안건별 긍정 부정 분석해서 제일 빈도수 많은 감정 반환
    max_sentiment : 'positive'
    max_sentiment : 'negative
    max_sentiment : 'neutral'
 - 안건별 핵심단어(entities)

 */

export const getAgendaDetail = async (meetingId: ObjectId, agendaIndex: number) => {
    const meeting = await MeetingModel.findById(meetingId);
    //TODO get specific agenda
    const agenda = meeting.agendas[agendaIndex];
    //TODO 내용요약
    //모든 record의 sentence를 더한다.
    var wholesentence = concatstring(agenda.records);
    var summarize = require('./summarization.js');
    var summarized = summarize.getSummarize(wholesentence);

    //TODO 안건제목
    const name = agenda.name;

    //TODO 긍정 부정 분석
    var sentiment = agenda.sentiment;
    //either positive,negative,or neutral
    var max_sentiment = Object.keys(sentiment).reduce(function(a,b){ return sentiment[a] > sentiment[b]? a:b});

    //TODO 안건별 핵심단어 리스트 반환 (weight순으로 상위 10개)
    var wholeentities = agenda.entities;
    var entities = [];
    object.sort((a, b) => a.weight > b.weight ? -1 : a.weight < b.weight ? 1: 0);
    for (let i =0;i<10;i++){
        entities.push(object[i].name);
    }

    var dict = {name:name,summarized:summarized,max_sentiment:max_sentiment, entities:entities};
    return dict
};

/**
 * @description 회의별로 분석
 * @param meetingId meeting Id
 * @return 아래의 내용을 담고 있는 array type
 - 회의 분위기 : 긍정 부정 분석 계산 maxsentiment
 - 회의 키워드 분석 :  핵심단어(keyphrase) maxentities
 - 회의 전체 발화량 : record length를 유저별로 계산 {userid:40%,userid:50%,... }
 - 회의 web search 내역: 등장한 딥서치한 (entity들)

 */
export const getEntireDetail = async (meetingId: ObjectId) => {
    const meeting = await MeetingModel.findById(meetingId);
    const agendas = meeting.agendas;

    var max_sentiment = [];
    var entities = [];
    //각각 안건에 대한 정보를 받아올것임.
    for (let i=0;i<agendas.length;i++){
        const [name,summarized,max_sentiment,entitites] = await getAgendaDetail(meetingId, i);
        max_sentiment.push(max_sentiment);
        entities.push(entities);
    }

    //TODO 긍정 부정 분석
    //{positive:2, negative:1, ..}
    var sentimentobject = _.countBy(max_sentiment);
    var maxsentiment = computeMaxindex(sentimentobject);

    //TODO 핵심 단어 리스트 (comeup 순으로 상위 10개)
    var entitiesobject = [_.countBy(entities)];
    //top ten weight entities
    var maxentities = getToptenWords(entitiesobject);

    //TODO user id record갯수로 문장 갯수 판단
    //TODO {userid1:20%, 2:30%,3:40%} 등장 단어 갯수로 user id별 발화 비율 반환

    //TODO 등장한 딥서치한 (entity type이 person,organization,location) 상위 10개 빈도 엔티티들 어레이

    var dict = {maxsentiment:maxsentiment, maxentities:maxentities};
    return dict
};



function computeMaxindex (sentiment: Object){
    //TODO
    return Object.keys(sentiment).reduce(function(a,b){ return sentiment[a] > sentiment[b]? a:b});


}



function getToptenWords(wordlist: Array){
    var entities = [];
    wordlist.sort((a, b) => a.weight > b.weight ? -1 : a.weight < b.weight ? 1: 0);
    for (let i =0;i<10;i++){
        entities.push(wordlist[i].name);
    }
    return entities
}
//records array를 받아 전체 sentence를 더함.
function concatstring(array : Array ){
    var str = '';
    for (let i =0;i<array.length;i++){
        str += array[i].sentence;
    }
}