import {
  User,
  Event,
  Class,
  Student,
  Registration,
  Schedule,
  Result,
  CertificateTemplate,
  Certificate,
  MeetInfo,
  ClassScore,
  OperationLog,
} from '@/types';

// 存储键名常量
const STORAGE_KEYS = {
  USERS: 'meet_users',
  EVENTS: 'meet_events',
  CLASSES: 'meet_classes',
  STUDENTS: 'meet_students',
  REGISTRATIONS: 'meet_registrations',
  SCHEDULES: 'meet_schedules',
  RESULTS: 'meet_results',
  CERTIFICATE_TEMPLATES: 'meet_certificate_templates',
  CERTIFICATES: 'meet_certificates',
  MEET_INFO: 'meet_info',
  LOGS: 'meet_logs',
  CURRENT_USER: 'meet_current_user',
} as const;

// 通用存储操作类
class LocalStorage {
  // 获取数据
  private get<T>(key: string): T[] | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  // 保存数据
  private save(key: string, data: any[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }

  // 生成唯一ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============ 用户管理 ============
  getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS) || [];
  }

  saveUsers(users: User[]): void {
    this.save(STORAGE_KEYS.USERS, users);
  }

  addUser(user: Omit<User, 'id'>): User {
    const users = this.getUsers();
    const newUser: User = { ...user, id: this.generateId() };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users[index] = { ...users[index], ...updates };
    this.saveUsers(users);
    return true;
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    this.saveUsers(filtered);
    return true;
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userId) return null;
    const users = this.getUsers();
    return users.find(u => u.id === userId) || null;
  }

  setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, user?.id || '');
  }

  // ============ 运动会信息 ============
  getMeetInfo(): MeetInfo | null {
    const infos = this.get(STORAGE_KEYS.MEET_INFO);
    return infos && infos.length > 0 ? infos[0] : null;
  }

  saveMeetInfo(info: MeetInfo): void {
    this.save(STORAGE_KEYS.MEET_INFO, [info]);
  }

  // ============ 班级管理 ============
  getClasses(): Class[] {
    return this.get<Class[]>(STORAGE_KEYS.CLASSES) || [];
  }

  saveClasses(classes: Class[]): void {
    this.save(STORAGE_KEYS.CLASSES, classes);
  }

  addClass(classData: Omit<Class, 'id'>): Class {
    const classes = this.getClasses();
    const newClass: Class = { ...classData, id: this.generateId() };
    classes.push(newClass);
    this.saveClasses(classes);
    return newClass;
  }

  updateClass(id: string, updates: Partial<Class>): boolean {
    const classes = this.getClasses();
    const index = classes.findIndex(c => c.id === id);
    if (index === -1) return false;
    classes[index] = { ...classes[index], ...updates };
    this.saveClasses(classes);
    return true;
  }

  deleteClass(id: string): boolean {
    const classes = this.getClasses();
    const filtered = classes.filter(c => c.id !== id);
    if (filtered.length === classes.length) return false;
    this.saveClasses(filtered);
    return true;
  }

  // ============ 项目管理 ============
  getEvents(): Event[] {
    return this.get<Event[]>(STORAGE_KEYS.EVENTS) || [];
  }

  saveEvents(events: Event[]): void {
    this.save(STORAGE_KEYS.EVENTS, events);
  }

  addEvent(event: Omit<Event, 'id'>): Event {
    const events = this.getEvents();
    const newEvent: Event = { ...event, id: this.generateId() };
    events.push(newEvent);
    this.saveEvents(events);
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<Event>): boolean {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return false;
    events[index] = { ...events[index], ...updates };
    this.saveEvents(events);
    return true;
  }

  deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter(e => e.id !== id);
    if (filtered.length === events.length) return false;
    this.saveEvents(filtered);
    return true;
  }

  // ============ 学生管理 ============
  getStudents(): Student[] {
    return this.get<Student[]>(STORAGE_KEYS.STUDENTS) || [];
  }

  saveStudents(students: Student[]): void {
    this.save(STORAGE_KEYS.STUDENTS, students);
  }

  addStudent(student: Omit<Student, 'id'>): Student {
    const students = this.getStudents();
    const newStudent: Student = { ...student, id: this.generateId() };
    students.push(newStudent);
    this.saveStudents(students);
    return newStudent;
  }

  updateStudent(id: string, updates: Partial<Student>): boolean {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return false;
    students[index] = { ...students[index], ...updates };
    this.saveStudents(students);
    return true;
  }

  deleteStudent(id: string): boolean {
    const students = this.getStudents();
    const filtered = students.filter(s => s.id !== id);
    if (filtered.length === students.length) return false;
    this.saveStudents(filtered);
    return true;
  }

  getStudentsByClass(classId: string): Student[] {
    return this.getStudents().filter(s => s.classId === classId);
  }

  // ============ 报名管理 ============
  getRegistrations(): Registration[] {
    return this.get<Registration[]>(STORAGE_KEYS.REGISTRATIONS) || [];
  }

  saveRegistrations(registrations: Registration[]): void {
    this.save(STORAGE_KEYS.REGISTRATIONS, registrations);
  }

  addRegistration(registration: Omit<Registration, 'id' | 'registrationTime'>): Registration {
    const registrations = this.getRegistrations();
    const newRegistration: Registration = {
      ...registration,
      id: this.generateId(),
      registrationTime: new Date().toISOString(),
    };
    registrations.push(newRegistration);
    this.saveRegistrations(registrations);
    return newRegistration;
  }

  updateRegistration(id: string, updates: Partial<Registration>): boolean {
    const registrations = this.getRegistrations();
    const index = registrations.findIndex(r => r.id === id);
    if (index === -1) return false;
    registrations[index] = { ...registrations[index], ...updates };
    this.saveRegistrations(registrations);
    return true;
  }

  deleteRegistration(id: string): boolean {
    const registrations = this.getRegistrations();
    const filtered = registrations.filter(r => r.id !== id);
    if (filtered.length === registrations.length) return false;
    this.saveRegistrations(filtered);
    return true;
  }

  getRegistrationsByClass(classId: string): Registration[] {
    return this.getRegistrations().filter(r => r.classId === classId);
  }

  getRegistrationsByEvent(eventId: string): Registration[] {
    return this.getRegistrations().filter(r => r.eventId === eventId);
  }

  // ============ 赛程管理 ============
  getSchedules(): Schedule[] {
    return this.get<Schedule[]>(STORAGE_KEYS.SCHEDULES) || [];
  }

  saveSchedules(schedules: Schedule[]): void {
    this.save(STORAGE_KEYS.SCHEDULES, schedules);
  }

  addSchedule(schedule: Omit<Schedule, 'id'>): Schedule {
    const schedules = this.getSchedules();
    const newSchedule: Schedule = { ...schedule, id: this.generateId() };
    schedules.push(newSchedule);
    this.saveSchedules(schedules);
    return newSchedule;
  }

  updateSchedule(id: string, updates: Partial<Schedule>): boolean {
    const schedules = this.getSchedules();
    const index = schedules.findIndex(s => s.id === id);
    if (index === -1) return false;
    schedules[index] = { ...schedules[index], ...updates };
    this.saveSchedules(schedules);
    return true;
  }

  deleteSchedule(id: string): boolean {
    const schedules = this.getSchedules();
    const filtered = schedules.filter(s => s.id !== id);
    if (filtered.length === schedules.length) return false;
    this.saveSchedules(filtered);
    return true;
  }

  // ============ 成绩管理 ============
  getResults(): Result[] {
    return this.get<Result[]>(STORAGE_KEYS.RESULTS) || [];
  }

  saveResults(results: Result[]): void {
    this.save(STORAGE_KEYS.RESULTS, results);
  }

  addResult(result: Omit<Result, 'id' | 'recordedTime'>): Result {
    const results = this.getResults();
    const newResult: Result = {
      ...result,
      id: this.generateId(),
      recordedTime: new Date().toISOString(),
    };
    results.push(newResult);
    this.saveResults(results);
    return newResult;
  }

  updateResult(id: string, updates: Partial<Result>): boolean {
    const results = this.getResults();
    const index = results.findIndex(r => r.id === id);
    if (index === -1) return false;
    results[index] = { ...results[index], ...updates };
    this.saveResults(results);
    return true;
  }

  deleteResult(id: string): boolean {
    const results = this.getResults();
    const filtered = results.filter(r => r.id !== id);
    if (filtered.length === results.length) return false;
    this.saveResults(filtered);
    return true;
  }

  getResultsByEvent(eventId: string): Result[] {
    return this.getResults().filter(r => r.eventId === eventId);
  }

  getResultsByClass(classId: string): Result[] {
    return this.getResults().filter(r => r.classId === classId);
  }

  // ============ 奖状模板管理 ============
  getCertificateTemplates(): CertificateTemplate[] {
    return this.get<CertificateTemplate[]>(STORAGE_KEYS.CERTIFICATE_TEMPLATES) || [];
  }

  saveCertificateTemplates(templates: CertificateTemplate[]): void {
    this.save(STORAGE_KEYS.CERTIFICATE_TEMPLATES, templates);
  }

  addCertificateTemplate(template: Omit<CertificateTemplate, 'id'>): CertificateTemplate {
    const templates = this.getCertificateTemplates();
    const newTemplate: CertificateTemplate = { ...template, id: this.generateId() };
    templates.push(newTemplate);
    this.saveCertificateTemplates(templates);
    return newTemplate;
  }

  updateCertificateTemplate(id: string, updates: Partial<CertificateTemplate>): boolean {
    const templates = this.getCertificateTemplates();
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) return false;
    templates[index] = { ...templates[index], ...updates };
    this.saveCertificateTemplates(templates);
    return true;
  }

  deleteCertificateTemplate(id: string): boolean {
    const templates = this.getCertificateTemplates();
    const filtered = templates.filter(t => t.id !== id);
    if (filtered.length === templates.length) return false;
    this.saveCertificateTemplates(filtered);
    return true;
  }

  // ============ 奖状管理 ============
  getCertificates(): Certificate[] {
    return this.get<Certificate[]>(STORAGE_KEYS.CERTIFICATES) || [];
  }

  saveCertificates(certificates: Certificate[]): void {
    this.save(STORAGE_KEYS.CERTIFICATES, certificates);
  }

  addCertificate(certificate: Omit<Certificate, 'id' | 'generatedAt'>): Certificate {
    const certificates = this.getCertificates();
    const newCertificate: Certificate = {
      ...certificate,
      id: this.generateId(),
      generatedAt: new Date().toISOString(),
    };
    certificates.push(newCertificate);
    this.saveCertificates(certificates);
    return newCertificate;
  }

  deleteCertificate(id: string): boolean {
    const certificates = this.getCertificates();
    const filtered = certificates.filter(c => c.id !== id);
    if (filtered.length === certificates.length) return false;
    this.saveCertificates(filtered);
    return true;
  }

  getCertificatesByStudent(studentId: string): Certificate[] {
    return this.getCertificates().filter(c => c.studentId === studentId);
  }

  getCertificatesByClass(classId: string): Certificate[] {
    return this.getCertificates().filter(c => c.classId === classId);
  }

  // ============ 操作日志 ============
  getLogs(): OperationLog[] {
    return this.get<OperationLog[]>(STORAGE_KEYS.LOGS) || [];
  }

  saveLogs(logs: OperationLog[]): void {
    this.save(STORAGE_KEYS.LOGS, logs);
  }

  addLog(log: Omit<OperationLog, 'id' | 'timestamp'>): void {
    const logs = this.getLogs();
    const newLog: OperationLog = {
      ...log,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };
    logs.push(newLog);
    this.saveLogs(logs);

    // 保留最近1000条日志
    if (logs.length > 1000) {
      this.saveLogs(logs.slice(-1000));
    }
  }

  // ============ 数据重置 ============
  resetAllData(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // ============ 数据导出 ============
  exportAllData(): Record<string, any> {
    return {
      users: this.getUsers(),
      events: this.getEvents(),
      classes: this.getClasses(),
      students: this.getStudents(),
      registrations: this.getRegistrations(),
      schedules: this.getSchedules(),
      results: this.getResults(),
      certificateTemplates: this.getCertificateTemplates(),
      certificates: this.getCertificates(),
      meetInfo: this.getMeetInfo(),
      logs: this.getLogs(),
      exportTime: new Date().toISOString(),
    };
  }

  // ============ 数据导入 ============
  importAllData(data: Record<string, any>): void {
    if (data.users) this.saveUsers(data.users);
    if (data.events) this.saveEvents(data.events);
    if (data.classes) this.saveClasses(data.classes);
    if (data.students) this.saveStudents(data.students);
    if (data.registrations) this.saveRegistrations(data.registrations);
    if (data.schedules) this.saveSchedules(data.schedules);
    if (data.results) this.saveResults(data.results);
    if (data.certificateTemplates) this.saveCertificateTemplates(data.certificateTemplates);
    if (data.certificates) this.saveCertificates(data.certificates);
    if (data.meetInfo) this.saveMeetInfo(data.meetInfo);
    if (data.logs) this.saveLogs(data.logs);
  }
}

// 导出单例实例
export const storage = new LocalStorage();
