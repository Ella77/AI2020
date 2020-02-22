import { MeetingModel, Meeting, Agenda } from "../model/meeting";
import { UserModel, User } from "../model/user";
import { ObjectId } from "bson";

/**
 * @description 회의가 끝나고 안건별로 분석
 * @param meetingId 조회할 회의 Id
 * @param agenda 조회할 안건 Id
 * @return json
 - 속기록 : 요약내용(summarized)
 - 안건 제목 :
 - 안건별 긍정 부정 분석 계산
 - 안건별 핵심단어(keyphrase)

 */
export const getAgendaDetail = async (meetingId: ObjectId, agenda: Agenda) => {
    const meeting = await MeetingModel.findById(meetingId);
    //TODO get specific agenda

    //TODO 내용요약

    //TODO 안건제목

    //TODO 긍정 부정 분석

    //TODO 안건별 핵심단어 리스트 반환 (comeup순으로 상위 10개)

    var json = [];
    //TODO
    return json
};

/**
 * @description 회의별로 분석
 * @param name meeting 이름
 * @param agendas agendas 안건들
 * @return meeting 생성된 meeting 객체
 - 회의 분위기 : 긍정 부정 분석 계산
 - 회의 키워드 분석 :  핵심단어(keyphrase)
 - 회의 전체 발화량 : record length를 유저별로 계산
 - 회의 web search 내역: 등장한 딥서치한 (entity들)

 */
export const getEntireDetail = async (meetingId: ObjectId) => {
    const meeting = await MeetingModel.findById(meetingId);

    //TODO 긍정 부정 분석

    //TODO 핵심 단어 리스트 (comeup 순으로 상위 10개)

    //TODO {1:20%, 2:30%,3:40%} 등장 단어 갯수로 user id별 발화 비율 반환

    //TODO 안건별 핵심단어 리스트 반환 (comeup 순으로 상위 10개)
    var json = [];
    //TODO
    return json
};
