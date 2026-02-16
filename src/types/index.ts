// 角色类型
export type UserRole = 'super_admin' | 'class_admin' | 'student';

// 用户类型
export interface User {
  id: string;
  username: string;
  password: string; // 实际应用中应该加密
  name: string;
  role: UserRole;
  classId?: string; // 班级管理员关联的班级
  className?: string;
}

// 项目类型
export enum EventType {
  TRACK = 'track', // 径赛（跑）
  FIELD = 'field', // 田赛（跳/投）
  RELAY = 'relay', // 接力
}

export enum ScoringType {
  TIME_ASC = 'time_asc', // 时间越小越好
  TIME_DESC = 'time_desc', // 时间越大越好
  DISTANCE = 'distance', // 距离越大越好
  HEIGHT = 'height', // 高度越大越好
  POINTS = 'points', // 积分越大越好
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  scoringType: ScoringType;
  category: string; // 类别（如：短跑、长跑、跳远等）
  description?: string;
  maxParticipants?: number; // 最大参与人数
  gender: 'male' | 'female' | 'mixed'; // 男子/女子/混合
}

// 班级类型
export interface Class {
  id: string;
  name: string;
  grade: string; // 年级
  teacher?: string; // 班主任
  studentCount?: number;
}

// 学生类型
export interface Student {
  id: string;
  name: string;
  classId: string;
  className: string;
  studentNumber: string; // 学号
  gender: 'male' | 'female';
  age?: number;
}

// 报名记录类型
export interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  eventId: string;
  eventName: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationTime: string;
  rejectedReason?: string;
}

// 赛程类型
export interface Schedule {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string; // 场地
  status: 'scheduled' | 'ongoing' | 'completed';
  sequence: number; // 序号，用于排序
  gender: 'male' | 'female' | 'mixed';
  category: string;
}

// 成绩类型
export interface Result {
  id: string;
  registrationId: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  eventId: string;
  eventName: string;
  score: string; // 成绩值（如：12.5秒、5.2米等）
  rank: number; // 名次
  points: number; // 积分
  recordedBy: string; // 录入人
  recordedTime: string; // 录入时间
  updatedBy?: string; // 修改人
  updatedTime?: string; // 修改时间
}

// 奖状模板类型
export interface CertificateTemplate {
  id: string;
  name: string;
  type: 'first' | 'second' | 'third' | 'excellence' | 'participation';
  category: 'individual' | 'team'; // 个人/集体
  templateImage?: string; // 模板图片（base64）
}

// 奖状类型
export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  eventId: string;
  eventName: string;
  rank: number;
  points: number;
  templateId: string;
  certificateImage: string; // 生成的奖状图片（base64）
  generatedAt: string;
}

// 运动会信息类型
export interface MeetInfo {
  id: string;
  name: string;
  edition: number; // 届数
  startDate: string;
  endDate: string;
  schoolName: string;
  schoolLogo?: string;
  description?: string;
}

// 班级总分统计
export interface ClassScore {
  classId: string;
  className: string;
  totalPoints: number;
  goldMedals: number;
  silverMedals: number;
  bronzeMedals: number;
}

// 操作日志
export interface OperationLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}
