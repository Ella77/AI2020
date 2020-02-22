import { MeetingModel, Meeting, Agenda, Record, Entity, Sentiment } from "../model/meeting";
import { UserModel, User } from "../model/user";
import { ObjectId } from "bson";



function getToptenWords(wordlist: any[]){
  const entities = [];
  wordlist.sort((a, b) => a.weight > b.weight ? -1 : a.weight < b.weight ? 1: 0);
  for (let i =0;i<10;i++){
    entities.push(wordlist[i].name);
  }
  return entities;
}

function mergeEntities(entitiesA: Entity[], entitiesB: Entity[]) {
  const resultEntities: Entity[] = entitiesA;
  for (let i = 0 ; i < entitiesB.length ; i ++) {
    const idx = resultEntities.findIndex((existEntity) => existEntity.name === entitiesB[i].name);
    if (idx !== -1) {
      resultEntities[idx].weight = resultEntities[idx].weight + entitiesB[i].weight;
    } else {
      resultEntities.push(entitiesB[i]);
    }
  }
  return resultEntities;
}

//records array를 받아 전체 sentence를 더함.
function concatstring(array: Record[] ){
  let str = '';
  for (let i =0;i<array.length;i++){
    str += array[i].sentence;
  }
}
  
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

export const getAgendaDetail = async (agenda: Agenda) => {
  //모든 record의 sentence를 더한다.
  const wholesentence = concatstring(agenda.records);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const summarize = require('./summarization.js');
  const summarized = summarize.getSummarize(wholesentence);


  let max_sentiment = 'positive';
  if (agenda.sentiment.negative > agenda.sentiment.positive && agenda.sentiment.negative > agenda.sentiment.neutral) {
    max_sentiment = 'negative';
  } else if (agenda.sentiment.neutral > agenda.sentiment.positive && agenda.sentiment.neutral > agenda.sentiment.negative) {
    max_sentiment = 'neutral';
  }

  //TODO 안건별 핵심단어 리스트 반환 (weight순으로 상위 10개)
  const wholeentities = agenda.entities;
  const entities = [];
  const sorted = wholeentities.sort((a, b) => a.weight > b.weight ? -1 : a.weight < b.weight ? 1: 0);
  for (let i =0; i < Math.min(10, sorted.length) ;i++){
    entities.push(sorted[i]);
  }

  const dict = {
    name, 
    summarized,
    max_sentiment,
    entities
  };
  return dict;
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
  if (!meeting) {
    return -1;
  }
  const agendas = meeting.agendas;


  const entireSentiment: Sentiment = {
    positive: 0,
    negative: 0,
    neutral: 0
  };
  let entireEntities: Entity[] = [];
  //각각 안건에 대한 정보를 받아올것임.
  const agendasDetail = [];
  for (let i = 0 ; i < agendas.length ; i ++) {
    const {name,summarized,max_sentiment, entities} = await getAgendaDetail(agendas[i]);
    agendasDetail.push({name,summarized,max_sentiment, entities});
    if (max_sentiment === 'positive') {
      entireSentiment.positive += 1;
    } else if (max_sentiment === 'negative') {
      entireSentiment.negative += 1;
    } else {
      entireSentiment.neutral += 1;
    }
    entireEntities = mergeEntities(entireEntities, entities);
  }
  const sortedEntites = entireEntities.sort((a, b) => a.weight > b.weight ? -1 : a.weight < b.weight ? 1: 0);
  let max_sentiment = 'positive';
  if (entireSentiment.negative > entireSentiment.positive && entireSentiment.negative > entireSentiment.neutral) {
    max_sentiment = 'negative';
  } else if (entireSentiment.neutral > entireSentiment.positive && entireSentiment.neutral > entireSentiment.negative) {
    max_sentiment = 'neutral';
  }
  let allCount: number = 0;
  const talkingRank: {userId: string; nickname: string; count: number }[] = [];
  for (let i = 0 ; i < meeting.agendas.length ; i ++) {
    for (let j = 0 ; j < meeting.agendas[i].records.length ; j ++) {
      const talkerIdx = talkingRank.findIndex((talkerInfo) => talkerInfo.userId === meeting.agendas[i].records[j].userId.toString())
      if (talkerIdx !== -1) {
        talkingRank[talkerIdx].count += 1;
      } else {
        talkingRank.push({
          userId: meeting.agendas[i].records[j].userId.toString(),
          nickname: (await UserModel.findById(meeting.agendas[i].records[j].userId))!.nickname,
          count: 1
        });
      }
      allCount += 1;
    }
  }
  talkingRank.sort((a, b) => a.count > b.count ? -1 : a.count < b.count ? 1: 0);
  //TODO 등장한 딥서치한 (entity type이 person,organization,location) 상위 10개 빈도 엔티티들 어레이

  const dict = {
    agendasDetail,
    max_sentiment,
    maxentities: sortedEntites.slice(0, 10),
    talkingRatio: talkingRank.map((talkerInfo) => {
      return {
        userId: talkerInfo.userId,
        nickname: talkerInfo.nickname,
        ratio: (talkerInfo.count / allCount) * 100
      };
    })
  };
  return dict;
};
