// -------------------------------------------------------------
// نظام إدارة السكاشن والمجموعات | جامعة برج العرب التكنولوجية
// BATU Direct Section & Group Management System
// اختيار سكشن أو مجموعة + تسجيل سكشن كام ومجموعة كام + تحديد مين مسؤول معاه
// -------------------------------------------------------------

(() => {
  'use strict';

  // إعدادات وتخصيصات Tailwind CSS
  if (typeof tailwind !== 'undefined') {
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            cairo: ['Cairo', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          },
          colors: {
            brand: {
              50: '#f0fdf4',
              100: '#dcfce7',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d'
            }
          }
        }
      }
    };
  }

  // -------------------------------------------------------------
  // DATABASE & STATE
  // -------------------------------------------------------------
  const DB_KEY = 'BATU_DIRECT_UNITS_APP_DB_V2';

  const defaultDatabase = {
    entities: [
      {
        id: 'unit-1',
        type: 'section',             // 'section' أو 'group'
        sectionNumber: '1',          // سكشن كام
        groupNumber: '1',            // مجموعة كام
        name: 'سكشن 1 (مجموعة 1)',   // الاسم الكامل
        code: 'SEC-1-G1',
        leader: {
          name: 'أحمد علي',
          role: 'ليدر السكشن الرئيسي',
          phone: '01011112222'
        },
        coOfficials: [
          {
            id: 'co-1',
            name: 'محمود حسن',
            role: 'نائب ليدر السكشن',
            phone: '01033334444'
          }
        ],
        createdAt: new Date().toISOString()
      }
    ],
    students: [
      { id: 'std-1', entityId: 'unit-1', academicId: '20240101', name: 'أحمد محمد إبراهيم', phone: '01011110001', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-2', entityId: 'unit-1', academicId: '20240102', name: 'مريم محمود إبراهيم', phone: '01011110002', notes: '', hasProblem: true, problemStatus: 'pending', problemType: 'تأخير تسليم شيت / تكليف', problemDetails: 'تأخرت في تسليم شيت العملي لعذر ظرف طارئ', problemDate: '2026-11-01', actionTaken: 'تم إمهالها 24 ساعة للتسليم' },
      { id: 'std-3', entityId: 'unit-1', academicId: '20240103', name: 'يوسف خالد عبد العزيز', phone: '01011110003', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-4', entityId: 'unit-1', academicId: '20240104', name: 'سلمى طارق عبد الرحمن', phone: '01011110004', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-5', entityId: 'unit-1', academicId: '20240105', name: 'عمر شريف فتحي', phone: '01011110005', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-6', entityId: 'unit-1', academicId: '20240106', name: 'نور الدين حسام الدين', phone: '01011110006', notes: '', hasProblem: true, problemStatus: 'pending', problemType: 'مشكلة مالية / رسوم', problemDetails: 'طلب تقسيط رسوم الزيارة العلمية', problemDate: '2026-11-02', actionTaken: 'دفع 50 جنيه ومتبقي 50 جنيه' },
      { id: 'std-7', entityId: 'unit-1', academicId: '20240107', name: 'سارة علي حسن', phone: '01011110007', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-8', entityId: 'unit-1', academicId: '20240108', name: 'عبد الرحمن محمود السيد', phone: '01011110008', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-9', entityId: 'unit-1', academicId: '20240109', name: 'نادين أحمد فاروق', phone: '01011110009', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-10', entityId: 'unit-1', academicId: '20240110', name: 'مصطفى كمال الدين حامد', phone: '01011110010', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-11', entityId: 'unit-1', academicId: '20240111', name: 'زياد إيهاب مصطفى', phone: '01011110011', notes: '', hasProblem: true, problemStatus: 'resolved', problemType: 'غياب بعذر طبي', problemDetails: 'قدم شهادة طبية عن غياب معمل الشبكات', problemDate: '2026-10-28', actionTaken: 'تم قبول العذر وتعويض التجربة' },
      { id: 'std-12', entityId: 'unit-1', academicId: '20240112', name: 'آية محمد سامي', phone: '01011110012', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-13', entityId: 'unit-1', academicId: '20240113', name: 'حمزة شريف النجار', phone: '01011110013', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-14', entityId: 'unit-1', academicId: '20240114', name: 'حبيبة أحمد رضوان', phone: '01011110014', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-15', entityId: 'unit-1', academicId: '20240115', name: 'كريم عادل صبري', phone: '01011110015', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-16', entityId: 'unit-1', academicId: '20240116', name: 'شهد وائل عزت', phone: '01011110016', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-17', entityId: 'unit-1', academicId: '20240117', name: 'خالد وليد عثمان', phone: '01011110017', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-18', entityId: 'unit-1', academicId: '20240118', name: 'ملك أسامة عبد الله', phone: '01011110018', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-19', entityId: 'unit-1', academicId: '20240119', name: 'بلال هاني الديب', phone: '01011110019', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' },
      { id: 'std-20', entityId: 'unit-1', academicId: '20240120', name: 'رنا هيثم جلال', phone: '01011110020', notes: '', hasProblem: false, problemStatus: 'none', problemType: '', problemDetails: '', problemDate: '', actionTaken: '' }
    ],
    customColumns: [],
    customValues: {},
    tasks: [
      {
        id: 'task-1',
        entityId: 'unit-1',
        title: 'تسليم شيت العملي 1',
        description: 'متابعة حل وتسليم مسائل الشيت الأول',
        type: 'status_tri', // تمام / مش تمام / لسه
        requiredAmount: 0,
        maxScore: 10,
        deadline: '2026-11-20',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-2',
        entityId: 'unit-1',
        title: 'استلام روب التخرج والبالطو',
        description: 'تأكيد المقاس والاستلام الفعلي',
        type: 'delivery', // استلم / مستلمش / مش متسجل
        requiredAmount: 0,
        maxScore: 10,
        deadline: '2026-11-25',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-3',
        entityId: 'unit-1',
        title: 'سداد مصاريف المعمل والزيارة العلمية',
        description: 'المبلغ المطلوب 100 جنيه لكل طالب',
        type: 'payment', // دفع / مدفعش / دفع جزئي + المبلغ المدفوع
        requiredAmount: 100,
        maxScore: 10,
        deadline: '2026-11-30',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-4',
        entityId: 'unit-1',
        title: 'حضور ورشة الذكاء الاصطناعي',
        description: 'تأكيد الحضور وإنجاز التاسك المطلوب',
        type: 'checkbox', // ✓ تم / ✗ لم يتم
        requiredAmount: 0,
        maxScore: 10,
        deadline: '2026-11-15',
        createdAt: new Date().toISOString()
      }
    ],
    taskRecords: {
      // تاسك 1: شيت العملي 1 (status_tri: تمام / مش تمام / لسه)
      'task-1_std-1': { status: 'تمام', notes: 'حل ممتاز في الموعد' },
      'task-1_std-2': { status: 'مش تمام', notes: 'ناقص مسألتين برمجة' },
      'task-1_std-3': { status: 'تمام', notes: 'حل كامل' },
      'task-1_std-4': { status: 'تمام', notes: '' },
      'task-1_std-5': { status: 'تمام', notes: 'كود نموذجي' },
      'task-1_std-6': { status: 'مش تمام', notes: 'يحتاج إعادة تسليم' },
      'task-1_std-7': { status: 'تمام', notes: '' },
      'task-1_std-8': { status: 'تمام', notes: '' },
      'task-1_std-9': { status: 'تمام', notes: 'أداء متميز' },
      'task-1_std-10': { status: 'تمام', notes: '' },
      'task-1_std-11': { status: 'تمام', notes: 'تم استلام التعويض' },
      'task-1_std-12': { status: 'تمام', notes: '' },
      'task-1_std-13': { status: 'لسه', notes: 'طلب مهلة للغد' },
      'task-1_std-14': { status: 'تمام', notes: '' },
      'task-1_std-15': { status: 'تمام', notes: '' },
      'task-1_std-16': { status: 'تمام', notes: '' },
      'task-1_std-17': { status: 'مش تمام', notes: 'كود غير مكتمل' },
      'task-1_std-18': { status: 'تمام', notes: '' },
      'task-1_std-19': { status: 'لسه', notes: '' },
      'task-1_std-20': { status: 'تمام', notes: '' },

      // تاسك 2: استلام روب التخرج والبالطو (delivery: استلم / مستلمش / مش متسجل)
      'task-2_std-1': { status: 'استلم', notes: 'مقاس L' },
      'task-2_std-2': { status: 'استلم', notes: 'مقاس M' },
      'task-2_std-3': { status: 'استلم', notes: 'مقاس XL' },
      'task-2_std-4': { status: 'استلم', notes: 'مقاس S' },
      'task-2_std-5': { status: 'استلم', notes: 'مقاس L' },
      'task-2_std-6': { status: 'مستلمش', notes: 'مقاسه غير متوفر حالياً' },
      'task-2_std-7': { status: 'استلم', notes: 'مقاس M' },
      'task-2_std-8': { status: 'استلم', notes: 'مقاس L' },
      'task-2_std-9': { status: 'استلم', notes: 'مقاس S' },
      'task-2_std-10': { status: 'استلم', notes: 'مقاس XL' },
      'task-2_std-11': { status: 'استلم', notes: 'مقاس L' },
      'task-2_std-12': { status: 'استلم', notes: 'مقاس M' },
      'task-2_std-13': { status: 'مستلمش', notes: 'مؤجل للأسبوع القادم' },
      'task-2_std-14': { status: 'استلم', notes: 'مقاس S' },
      'task-2_std-15': { status: 'استلم', notes: 'مقاس L' },
      'task-2_std-16': { status: 'استلم', notes: 'مقاس M' },
      'task-2_std-17': { status: 'مش متسجل', notes: '' },
      'task-2_std-18': { status: 'استلم', notes: 'مقاس S' },
      'task-2_std-19': { status: 'مستلمش', notes: '' },
      'task-2_std-20': { status: 'مش متسجل', notes: '' },

      // تاسك 3: سداد مصاريف المعمل والزيارة العلمية (payment: 100 ج)
      'task-3_std-1': { status: 'دفع', paidAmount: 100, notes: 'سدد كاش بالكامل' },
      'task-3_std-2': { status: 'دفع', paidAmount: 100, notes: 'سدد فودافون كاش' },
      'task-3_std-3': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-4': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-5': { status: 'دفع', paidAmount: 100, notes: 'تم السداد كاش' },
      'task-3_std-6': { status: 'دفع جزئي', paidAmount: 50, notes: 'دفع 50 جنيه ومتبقي 50 جنيه' },
      'task-3_std-7': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-8': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-9': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-10': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-11': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-12': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-13': { status: 'دفع جزئي', paidAmount: 40, notes: 'متبقي 60 جنيه' },
      'task-3_std-14': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-15': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-16': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-17': { status: 'مدفعش', paidAmount: 0, notes: 'وعد بالسداد الأحد' },
      'task-3_std-18': { status: 'دفع', paidAmount: 100, notes: 'تم السداد' },
      'task-3_std-19': { status: 'مدفعش', paidAmount: 0, notes: '' },
      'task-3_std-20': { status: 'دفع جزئي', paidAmount: 50, notes: 'متبقي 50 جنيه' },

      // تاسك 4: حضور ورشة الذكاء الاصطناعي (checkbox: ✓ تم / ✗ لم يتم)
      'task-4_std-1': { done: true, status: 'تم', notes: '' },
      'task-4_std-2': { done: true, status: 'تم', notes: '' },
      'task-4_std-3': { done: true, status: 'تم', notes: '' },
      'task-4_std-4': { done: true, status: 'تم', notes: '' },
      'task-4_std-5': { done: true, status: 'تم', notes: '' },
      'task-4_std-6': { done: false, status: 'لم يتم', notes: 'غياب بعذر' },
      'task-4_std-7': { done: true, status: 'تم', notes: '' },
      'task-4_std-8': { done: true, status: 'تم', notes: '' },
      'task-4_std-9': { done: true, status: 'تم', notes: '' },
      'task-4_std-10': { done: true, status: 'تم', notes: '' },
      'task-4_std-11': { done: true, status: 'تم', notes: '' },
      'task-4_std-12': { done: true, status: 'تم', notes: '' },
      'task-4_std-13': { done: false, status: 'لم يتم', notes: '' },
      'task-4_std-14': { done: true, status: 'تم', notes: '' },
      'task-4_std-15': { done: true, status: 'تم', notes: '' },
      'task-4_std-16': { done: true, status: 'تم', notes: '' },
      'task-4_std-17': { done: false, status: 'لم يتم', notes: '' },
      'task-4_std-18': { done: true, status: 'تم', notes: '' },
      'task-4_std-19': { done: false, status: 'لم يتم', notes: '' },
      'task-4_std-20': { done: true, status: 'تم', notes: '' }
    },
    assignments: [],
    submissions: {},
    attendanceSessions: [
      { id: 'att-1', entityId: 'unit-1', title: 'الأسبوع 1 (مقدمة ومعمل 1)', date: '2026-10-15' },
      { id: 'att-2', entityId: 'unit-1', title: 'الأسبوع 2 (تجربة عملية 1)', date: '2026-10-22' },
      { id: 'att-3', entityId: 'unit-1', title: 'الأسبوع 3 (تسليم شيت 1)', date: '2026-10-29' }
    ],
    attendanceRecords: {
      'att-1_std-1': 'present', 'att-1_std-2': 'present', 'att-1_std-3': 'present', 'att-1_std-4': 'present',
      'att-1_std-5': 'present', 'att-1_std-6': 'excused', 'att-1_std-7': 'present', 'att-1_std-8': 'present',
      'att-1_std-9': 'present', 'att-1_std-10': 'present', 'att-1_std-11': 'present', 'att-1_std-12': 'present',
      'att-1_std-13': 'absent', 'att-1_std-14': 'present', 'att-1_std-15': 'present', 'att-1_std-16': 'present',
      'att-1_std-17': 'absent', 'att-1_std-18': 'present', 'att-1_std-19': 'present', 'att-1_std-20': 'present',

      'att-2_std-1': 'present', 'att-2_std-2': 'present', 'att-2_std-3': 'present', 'att-2_std-4': 'present',
      'att-2_std-5': 'present', 'att-2_std-6': 'absent', 'att-2_std-7': 'present', 'att-2_std-8': 'present',
      'att-2_std-9': 'present', 'att-2_std-10': 'present', 'att-2_std-11': 'excused', 'att-2_std-12': 'present',
      'att-2_std-13': 'absent', 'att-2_std-14': 'present', 'att-2_std-15': 'present', 'att-2_std-16': 'present',
      'att-2_std-17': 'absent', 'att-2_std-18': 'present', 'att-2_std-19': 'present', 'att-2_std-20': 'present',

      'att-3_std-1': 'present', 'att-3_std-2': 'present', 'att-3_std-3': 'present', 'att-3_std-4': 'present',
      'att-3_std-5': 'present', 'att-3_std-6': 'absent', 'att-3_std-7': 'present', 'att-3_std-8': 'present',
      'att-3_std-9': 'present', 'att-3_std-10': 'present', 'att-3_std-11': 'present', 'att-3_std-12': 'present',
      'att-3_std-13': 'absent', 'att-3_std-14': 'present', 'att-3_std-15': 'present', 'att-3_std-16': 'present',
      'att-3_std-17': 'excused', 'att-3_std-18': 'present', 'att-3_std-19': 'present', 'att-3_std-20': 'present'
    }
  };

  function loadDB() {
    try {
      const data = localStorage.getItem(DB_KEY);
      if (data) {
        const parsed = JSON.parse(data);

        // ترقية ونقل التكليفات السابقة إلى نظام التاسكات الجديد تلقائياً
        let tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
        let taskRecords = parsed.taskRecords || {};

        if (tasks.length === 0 && Array.isArray(parsed.assignments) && parsed.assignments.length > 0) {
          tasks = parsed.assignments.map(a => ({
            id: a.id,
            entityId: a.entityId,
            title: a.title,
            description: a.description || '',
            type: 'grade',
            maxScore: a.maxScore || 10,
            requiredAmount: 0,
            deadline: a.deadline || '',
            createdAt: a.createdAt || new Date().toISOString()
          }));
          if (parsed.submissions) {
            Object.keys(parsed.submissions).forEach(k => {
              const sub = parsed.submissions[k];
              taskRecords[k] = {
                score: sub.score,
                notes: sub.notes || '',
                done: sub.score !== null && sub.score !== undefined
              };
            });
          }
        }

        if (tasks.length === 0) {
          tasks = defaultDatabase.tasks;
          taskRecords = defaultDatabase.taskRecords;
        }

        // ترقية قائمة الطلاب ونماذج التاسكات للنماذج الـ 20 الغنية في حال وجود 4 طلاب أو أقل
        let studentsList = Array.isArray(parsed.students) ? parsed.students : [];
        let attendanceRecs = parsed.attendanceRecords || defaultDatabase.attendanceRecords;
        let attendanceSessionsList = Array.isArray(parsed.attendanceSessions) && parsed.attendanceSessions.length > 0 ? parsed.attendanceSessions : defaultDatabase.attendanceSessions;
        if (studentsList.length <= 4) {
          studentsList = defaultDatabase.students;
          taskRecords = defaultDatabase.taskRecords;
          attendanceRecs = defaultDatabase.attendanceRecords;
          attendanceSessionsList = defaultDatabase.attendanceSessions;
        } else if (attendanceSessionsList.length <= 1) {
          attendanceSessionsList = defaultDatabase.attendanceSessions;
          attendanceRecs = { ...defaultDatabase.attendanceRecords, ...attendanceRecs };
        }

        const loadedDB = {
          entities: (Array.isArray(parsed.entities) && parsed.entities.length > 0 ? parsed.entities : defaultDatabase.entities).map(e => ({
            ...e,
            whatsappLink: e.whatsappLink || ''
          })),
          students: studentsList.map(s => ({
            id: s.id,
            entityId: s.entityId,
            academicId: s.academicId,
            name: s.name,
            phone: s.phone || '',
            notes: s.notes || '',
            hasProblem: s.hasProblem === true || s.problemStatus === 'pending',
            problemStatus: s.problemStatus || (s.hasProblem ? 'pending' : 'none'),
            problemType: s.problemType || '',
            problemDetails: s.problemDetails || s.notes || '',
            problemDate: s.problemDate || '',
            actionTaken: s.actionTaken || ''
          })),
          customColumns: Array.isArray(parsed.customColumns) ? parsed.customColumns : [],
          customValues: parsed.customValues || {},
          tasks: tasks,
          taskRecords: taskRecords,
          assignments: Array.isArray(parsed.assignments) ? parsed.assignments : [],
          submissions: parsed.submissions || {},
          attendanceSessions: attendanceSessionsList,
          attendanceRecords: attendanceRecs
        };

        saveDB(loadedDB);
        return loadedDB;
      }

      // ترقية واستيراد البيانات السابقة تلقائياً من الإصدار السابق إن وجدت
      const prevData = localStorage.getItem('BATU_DIRECT_SECTION_APP_DB_V1') || localStorage.getItem('BATU_SECTION_APP_DB_V19');
      if (prevData) {
        const p = JSON.parse(prevData);
        if (p.sections && p.sections.length > 0) {
          const importedEntities = p.sections.map((s, idx) => ({
            id: s.id || ('unit-' + idx),
            type: 'section',
            sectionNumber: s.name.replace(/[^0-9]/g, '') || String(idx + 1),
            groupNumber: '1',
            name: s.name.includes('مجموعة') ? s.name : `${s.name} (مجموعة 1)`,
            code: s.code || `SEC-${idx + 1}-G1`,
            leader: {
              name: (s.officials && s.officials[0] && s.officials[0].name) || 'مسؤول السكشن',
              role: 'ليدر السكشن',
              phone: (s.officials && s.officials[0] && s.officials[0].phone) || ''
            },
            coOfficials: (s.officials && s.officials.slice(1).map(o => ({
              id: o.id || ('co-' + Math.random()),
              name: o.name,
              role: o.role || 'نائب ليدر السكشن',
              phone: o.phone || ''
            }))) || [],
            createdAt: s.createdAt || new Date().toISOString()
          }));

          const importedStudents = (p.students || []).map(st => ({
            ...st,
            entityId: st.sectionId || st.entityId || importedEntities[0].id
          }));

          const importedAssignments = (p.assignments || []).map(a => ({
            ...a,
            entityId: a.sectionId || a.entityId || importedEntities[0].id
          }));

          const importedAttendance = (p.attendanceSessions || []).map(att => ({
            ...att,
            entityId: att.sectionId || att.entityId || importedEntities[0].id
          }));

          const imported = {
            entities: importedEntities,
            students: importedStudents,
            customColumns: p.customColumns || [],
            customValues: p.customValues || {},
            assignments: importedAssignments,
            submissions: p.submissions || {},
            attendanceSessions: importedAttendance,
            attendanceRecords: p.attendanceRecords || {}
          };
          saveDB(imported);
          return imported;
        }
      }

      saveDB(defaultDatabase);
      return defaultDatabase;
    } catch (e) {
      console.error('Error loading DB:', e);
      return defaultDatabase;
    }
  }

  function saveDB(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving DB:', e);
    }
  }

  let DB = loadDB();

  // APPLICATION STATE
  const state = {
    currentEntity: null,     // الكيان الحالي (سكشن أو مجموعة)
    activeTab: 'home',       // 'home' | 'grid' | 'tasks' | 'attendance' | 'students' | 'notebook' | 'dashboard'
    searchQuery: '',
    notebookFilter: 'all',   // 'all' | 'problems_only' | 'resolved' | 'clean'
    notebookTypeFilter: 'all', // 'all' or specific problem type
    activeTaskId: null,      // التاسك النشط حالياً في تبويب التاسكات
    activeAttendanceSessionId: null, // الجلسة النشطة في الحضور
    attendanceViewMode: 'matrix', // 'matrix' (شيت مجمع لجميع الأسابيع) | 'single' (تحضير جلسة محددة)
    attendanceFilter: 'all', // 'all' | 'warning' (مهدد بالإنذار)
    modal: null,
    modalData: null,
    registerType: 'section'  // النوع في شاشة التسجيل: 'section' أو 'group'
  };

  // تعيين الكيان النشط الافتراضي تلقائياً
  const savedUnitId = localStorage.getItem('BATU_ACTIVE_UNIT_ID');
  state.currentEntity = (DB.entities || []).find(e => e.id === savedUnitId) || (DB.entities && DB.entities[0]) || null;

  // -------------------------------------------------------------
  // HELPER FUNCTIONS & CALCULATIONS
  // -------------------------------------------------------------
  function getEntityStats(entityId) {
    const students = (DB.students || []).filter(s => s.entityId === entityId);
    const totalStudents = students.length;
    const tasksCount = (DB.tasks || []).filter(t => t.entityId === entityId).length;
    let doneCount = 0;
    let pendingProblemsCount = 0;
    let resolvedProblemsCount = 0;

    students.forEach(std => {
      if (DB.customValues && DB.customValues[`${std.id}_done`] === true) {
        doneCount++;
      }
      if (std.problemStatus === 'pending' || std.hasProblem === true) {
        pendingProblemsCount++;
      } else if (std.problemStatus === 'resolved') {
        resolvedProblemsCount++;
      }
    });

    const donePercent = totalStudents > 0 ? Math.round((doneCount / totalStudents) * 100) : 0;
    return {
      totalStudents,
      tasksCount,
      doneCount,
      donePercent,
      pendingProblemsCount,
      resolvedProblemsCount,
      cleanCount: Math.max(0, totalStudents - pendingProblemsCount - resolvedProblemsCount)
    };
  }

  function getFilteredStudents(entityId) {
    const allStudents = (DB.students || []).filter(s => s.entityId === entityId);
    const query = (state.searchQuery || '').trim().toLowerCase();
    
    let students = allStudents;

    // تصفية خاصة بتبويب النوتة
    if (state.activeTab === 'notebook') {
      if (state.notebookFilter === 'problems_only') {
        students = students.filter(s => s.problemStatus === 'pending' || s.hasProblem === true);
      } else if (state.notebookFilter === 'resolved') {
        students = students.filter(s => s.problemStatus === 'resolved');
      } else if (state.notebookFilter === 'clean') {
        students = students.filter(s => (!s.problemStatus || s.problemStatus === 'none') && !s.hasProblem);
      }

      if (state.notebookTypeFilter && state.notebookTypeFilter !== 'all') {
        students = students.filter(s => s.problemType === state.notebookTypeFilter);
      }
    }

    // تصفية خاصة بتبويب الحضور (المهددين بالإنذار)
    if (state.activeTab === 'attendance' && state.attendanceFilter === 'warning') {
      const sessions = (DB.attendanceSessions || []).filter(s => s.entityId === entityId);
      const recs = DB.attendanceRecords || {};
      students = students.filter(std => {
        let absentCount = 0;
        sessions.forEach(sess => {
          if (recs[`${sess.id}_${std.id}`] === 'absent') absentCount++;
        });
        return absentCount >= 2;
      });
    }

    if (query) {
      students = students.filter(s => {
        const name = (s.name || '').toLowerCase();
        const acad = (s.academicId || '').toLowerCase();
        const phone = (s.phone || '');
        const details = (s.problemDetails || '').toLowerCase();
        const pType = (s.problemType || '').toLowerCase();
        const action = (s.actionTaken || '').toLowerCase();
        return name.includes(query) || acad.includes(query) || phone.includes(query) || details.includes(query) || pType.includes(query) || action.includes(query);
      });
    }

    return { allStudents, students };
  }

  function handleSearch(val) {
    state.searchQuery = val;
    render();
    const searchInputs = document.querySelectorAll('.student-search-box');
    searchInputs.forEach(input => {
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    });
  }

  function renderSearchBar(placeholder = 'بحث بالاسم أو الرقم الأكاديمي أو الهاتف...') {
    return `
      <div class="relative flex-1 min-w-[220px] max-w-md">
        <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">🔍</span>
        <input 
          type="text" 
          value="${state.searchQuery || ''}" 
          oninput="handleSearch(this.value);" 
          placeholder="${placeholder}" 
          class="student-search-box input-box pr-8 pl-8 text-xs w-full font-bold shadow-xs focus:ring-2 focus:ring-emerald-500"
        />
        ${state.searchQuery ? `
          <button onclick="handleSearch('');" class="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 hover:text-rose-500 text-xs font-bold transition" title="مسح البحث">✕</button>
        ` : ''}
      </div>
    `;
  }

  // -------------------------------------------------------------
  // ENTITY MANAGEMENT (تسجيل سكشن أو مجموعة + المسؤولين)
  // -------------------------------------------------------------
  function switchEntity(entityId) {
    const target = DB.entities.find(e => e.id === entityId);
    if (target) {
      state.currentEntity = target;
      localStorage.setItem('BATU_ACTIVE_UNIT_ID', target.id);
      render();
    }
  }

  function registerEntity(data) {
    const {
      type,            // 'section' | 'group'
      sectionNumber,   // سكشن كام
      groupNumber,     // مجموعة كام
      customName,
      leaderName,      // اسم المسؤول الرئيسي
      leaderPhone,
      coName,          // مين مسؤول معاه
      coRole,          // صفته
      coPhone
    } = data;

    const isSec = type === 'section';
    const sNum = (sectionNumber || '').trim();
    const gNum = (groupNumber || '').trim();

    if (isSec && !sNum) {
      alert('⚠️ يرجى تحديد سكشن كام.');
      return;
    }
    if (!gNum) {
      alert('⚠️ يرجى تحديد مجموعة كام.');
      return;
    }
    if (!leaderName || !leaderName.trim()) {
      alert('⚠️ يرجى إدخال اسمك (المسؤول الرئيسي).');
      return;
    }

    let defaultName = '';
    let defaultCode = '';

    if (isSec) {
      defaultName = `سكشن ${sNum} (مجموعة ${gNum})`;
      defaultCode = `SEC-${sNum}-G${gNum}`;
    } else {
      defaultName = `مجموعة ${gNum}`;
      defaultCode = `GRP-${gNum}`;
    }

    const finalName = customName && customName.trim() ? customName.trim() : defaultName;
    const finalCode = defaultCode.toUpperCase();

    const leader = {
      name: leaderName.trim(),
      role: isSec ? 'ليدر السكشن الرئيسي' : 'ليدر المجموعة الرئيسي',
      phone: leaderPhone ? leaderPhone.trim() : ''
    };

    const coOfficials = [];
    if (coName && coName.trim()) {
      coOfficials.push({
        id: 'co-' + Date.now(),
        name: coName.trim(),
        role: (coRole && coRole.trim()) ? coRole.trim() : (isSec ? 'نائب ليدر السكشن' : 'نائب ليدر المجموعة'),
        phone: coPhone ? coPhone.trim() : ''
      });
    }

    const newEntity = {
      id: 'unit-' + Date.now(),
      type: isSec ? 'section' : 'group',
      sectionNumber: isSec ? sNum : '',
      groupNumber: gNum,
      name: finalName,
      code: finalCode,
      leader: leader,
      coOfficials: coOfficials,
      createdAt: new Date().toISOString()
    };

    DB.entities.push(newEntity);
    saveDB(DB);

    state.currentEntity = newEntity;
    state.activeTab = 'home';
    localStorage.setItem('BATU_ACTIVE_UNIT_ID', newEntity.id);
    closeModal();
    render();
    alert(`🎉 تم تسجيل ${isSec ? 'السكشن' : 'المجموعة'} بنجاح!\nالاسم: ${newEntity.name}\nالمسؤول: ${leader.name}${coOfficials.length > 0 ? `\nمسؤول معاه: ${coOfficials[0].name} (${coOfficials[0].role})` : ''}`);
  }

  function editEntityName(entityId) {
    const ent = DB.entities.find(e => e.id === entityId);
    if (!ent) return;

    const newName = prompt('أدخل الاسم الجديد:', ent.name);
    if (newName && newName.trim() && newName.trim() !== ent.name) {
      ent.name = newName.trim();
      saveDB(DB);
      render();
      alert('✅ تم تعديل الاسم بنجاح.');
    }
  }

  function deleteEntity(entityId) {
    const ent = DB.entities.find(e => e.id === entityId);
    if (!ent) return;

    const typeLabel = ent.type === 'section' ? 'السكشن' : 'المجموعة';
    if (!confirm(`هل أنت متأكد من حذف ${typeLabel} "${ent.name}"؟\nسيتم حذف جميع الطلاب والتكليفات وسجلات الحضور المرتبطة به.`)) {
      return;
    }

    DB.entities = DB.entities.filter(e => e.id !== entityId);
    DB.students = DB.students.filter(s => s.entityId !== entityId);
    if (Array.isArray(DB.tasks)) DB.tasks = DB.tasks.filter(t => t.entityId !== entityId);
    DB.assignments = (DB.assignments || []).filter(a => a.entityId !== entityId);
    DB.attendanceSessions = DB.attendanceSessions.filter(a => a.entityId !== entityId);

    saveDB(DB);
    state.currentEntity = DB.entities[0] || null;
    if (state.currentEntity) {
      localStorage.setItem('BATU_ACTIVE_UNIT_ID', state.currentEntity.id);
    } else {
      localStorage.removeItem('BATU_ACTIVE_UNIT_ID');
    }
    render();
    alert(`🗑️ تم حذف ${typeLabel} بنجاح.`);
  }

  // -------------------------------------------------------------
  // CO-OFFICIALS MANAGEMENT (إدارة مين مسؤول معاه)
  // -------------------------------------------------------------
  function addCoOfficial(entityId, nameOrObj, role, phone) {
    const ent = DB.entities.find(e => e.id === entityId);
    if (!ent) return;

    let name = '';
    let r = role;
    let p = phone;
    if (typeof nameOrObj === 'object' && nameOrObj !== null) {
      name = nameOrObj.name || '';
      r = nameOrObj.role || role;
      p = nameOrObj.phone || phone;
    } else {
      name = nameOrObj || '';
    }

    if (!name || !name.trim()) {
      alert('يرجى كتابة اسم المسؤول المشارك.');
      return;
    }

    if (!Array.isArray(ent.coOfficials)) ent.coOfficials = [];

    const newCo = {
      id: 'co-' + Date.now(),
      name: name.trim(),
      role: (r && r.trim()) ? r.trim() : (ent.type === 'section' ? 'نائب ليدر السكشن' : 'نائب ليدر المجموعة'),
      phone: p ? p.trim() : ''
    };

    ent.coOfficials.push(newCo);
    saveDB(DB);
    closeModal();
    render();
    alert(`✅ تم تعيين (${newCo.name}) كمسؤول مشارك بنجاح!`);
  }

  function deleteCoOfficial(entityId, coId) {
    const ent = DB.entities.find(e => e.id === entityId);
    if (!ent || !ent.coOfficials) return;

    const co = ent.coOfficials.find(c => c.id === coId);
    if (!confirm(`هل أنت متأكد من حذف المسؤول المشارك (${co ? co.name : ''})؟`)) return;

    ent.coOfficials = ent.coOfficials.filter(c => c.id !== coId);
    saveDB(DB);
    render();
    alert('🗑️ تم الحذف بنجاح.');
  }

  // -------------------------------------------------------------
  // STUDENTS MANAGEMENT
  // -------------------------------------------------------------
  function addStudentToSection(nameOrObj, academicId, phone) {
    if (!state.currentEntity) return;

    let name = '';
    let acad = '';
    let ph = '';
    if (typeof nameOrObj === 'object' && nameOrObj !== null) {
      name = nameOrObj.name || '';
      acad = String(nameOrObj.academicId || academicId || '');
      ph = String(nameOrObj.phone || phone || '');
    } else {
      name = nameOrObj || '';
      acad = String(academicId || '');
      ph = String(phone || '');
    }

    if (!name.trim() || !acad.trim()) {
      alert('يرجى ملء اسم الطالب ورقمه الأكاديمي.');
      return;
    }

    const newStd = {
      id: 'std-' + Date.now() + Math.floor(Math.random() * 1000),
      entityId: state.currentEntity.id,
      academicId: acad.trim(),
      name: name.trim(),
      phone: ph ? ph.trim() : '',
      notes: '',
      hasProblem: false,
      problemStatus: 'none',
      problemType: '',
      problemDetails: '',
      problemDate: '',
      actionTaken: ''
    };

    DB.students.push(newStd);
    saveDB(DB);
    closeModal();
    render();
    alert('✅ تم إضافة الطالب (' + newStd.name + ') بنجاح!');
  }

  function updateStudent(studentId, name, academicId, phone) {
    const std = DB.students.find(s => s.id === studentId);
    if (!std) return;

    std.name = name.trim();
    std.academicId = academicId.trim();
    std.phone = phone ? phone.trim() : '';

    saveDB(DB);
    closeModal();
    render();
    alert('✅ تم تحديث بيانات الطالب بنجاح.');
  }

  function deleteStudent(studentId) {
    const std = DB.students.find(s => s.id === studentId);
    if (!std) return;

    if (!confirm('هل أنت متأكد من حذف الطالب (' + std.name + ')؟')) return;

    DB.students = DB.students.filter(s => s.id !== studentId);
    saveDB(DB);
    render();
  }

  function processBulkPasteStudents(rawText) {
    if (!state.currentEntity) return;
    if (!rawText || !rawText.trim()) {
      alert('يرجى لصق بيانات الطلاب أولاً.');
      return;
    }

    const lines = rawText.trim().split('\n');
    let addedCount = 0;

    lines.forEach(line => {
      const parts = line.split(/[\t,;]+/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        let acad = parts[0];
        let name = parts[1];
        let phone = parts[2] || '';

        // تبديل إذا كان الأول هو الاسم والثاني هو الرقم الأكاديمي
        if (isNaN(acad) && !isNaN(name)) {
          const temp = acad;
          acad = name;
          name = temp;
        }

        if (name && acad) {
          DB.students.push({
            id: 'std-' + Date.now() + Math.floor(Math.random() * 100000),
            entityId: state.currentEntity.id,
            academicId: acad,
            name: name,
            phone: phone,
            notes: '',
            hasProblem: false,
            problemStatus: 'none',
            problemType: '',
            problemDetails: '',
            problemDate: '',
            actionTaken: ''
          });
          addedCount++;
        }
      }
    });

    saveDB(DB);
    closeModal();
    render();
    alert('🎉 تم استيراد ' + addedCount + ' طالب بنجاح!');
  }

  // -------------------------------------------------------------
  // NOTEBOOK & STUDENT PROBLEMS MANAGEMENT (إدارة النوتة ومشكلات الطلاب)
  // -------------------------------------------------------------
  function updateStudentProblemStatus(studentId, newStatus) {
    const std = DB.students.find(s => s.id === studentId);
    if (!std) return;

    std.problemStatus = newStatus;
    std.hasProblem = (newStatus === 'pending');
    if (newStatus === 'pending' && !std.problemDate) {
      std.problemDate = new Date().toISOString().slice(0, 10);
    }
    saveDB(DB);
    render();
  }

  function updateStudentProblemType(studentId, problemType) {
    const std = DB.students.find(s => s.id === studentId);
    if (!std) return;

    std.problemType = problemType;
    if (problemType && (!std.problemStatus || std.problemStatus === 'none')) {
      std.problemStatus = 'pending';
      std.hasProblem = true;
      if (!std.problemDate) std.problemDate = new Date().toISOString().slice(0, 10);
    }
    saveDB(DB);
    render();
  }

  function updateStudentProblemNote(studentId, details) {
    const std = DB.students.find(s => s.id === studentId);
    if (!std) return;

    std.problemDetails = details;
    if (details && details.trim() && (!std.problemStatus || std.problemStatus === 'none')) {
      std.problemStatus = 'pending';
      std.hasProblem = true;
      if (!std.problemDate) std.problemDate = new Date().toISOString().slice(0, 10);
    }
    saveDB(DB);
  }

  function updateStudentActionTaken(studentId, action) {
    const std = DB.students.find(s => s.id === studentId);
    if (!std) return;

    std.actionTaken = action;
    saveDB(DB);
  }

  function updateStudentProblemFull(studentId, data) {
    const std = DB.students.find(s => s.id === studentId);
    if (!std) return;

    std.problemStatus = data.status || 'none';
    std.hasProblem = (std.problemStatus === 'pending');
    std.problemType = data.type || '';
    std.problemDetails = data.details || '';
    std.actionTaken = data.actionTaken || '';
    std.problemDate = data.date || std.problemDate || new Date().toISOString().slice(0, 10);

    saveDB(DB);
    closeModal();
    render();
    alert('✅ تم حفظ بيانات الملاحظة والمشكلة للطالب بنجاح!');
  }

  function clearStudentProblem(studentId) {
    const std = DB.students.find(s => s.id === studentId);
    if (!std) return;
    if (!confirm(`هل أنت متأكد من تفريغ مشكلة الطالب (${std.name}) وإعادته للحالة الطبيعية؟`)) return;

    std.hasProblem = false;
    std.problemStatus = 'none';
    std.problemType = '';
    std.problemDetails = '';
    std.actionTaken = '';
    std.problemDate = '';

    saveDB(DB);
    render();
    alert('🗑️ تم تفريغ المشكلة بنجاح.');
  }

  function printNotebook() {
    window.print();
  }

  // -------------------------------------------------------------
  // GRID / SHEET & CUSTOM COLUMNS
  // -------------------------------------------------------------
  function updateCellValue(studentId, columnId, value) {
    const key = `${studentId}_${columnId}`;
    DB.customValues[key] = value;
    saveDB(DB);
    render();
  }

  function toggleStudentDone(studentId) {
    const key = `${studentId}_done`;
    DB.customValues[key] = !DB.customValues[key];
    saveDB(DB);
    render();
  }

  function addCustomColumn(title, type, defaultValue) {
    if (!state.currentEntity) return;
    if (!title) {
      alert('يرجى إدخال عنوان العمود.');
      return;
    }

    let options = [];
    if (type === 'status') {
      options = ['تمام', 'مش تمام', 'لسه'];
    }

    const newCol = {
      id: 'col-' + Date.now(),
      ownerId: state.currentEntity.id,
      title: title.trim(),
      type: type || 'text',
      options: options
    };

    DB.customColumns.push(newCol);

    if (defaultValue) {
      const students = DB.students.filter(s => s.entityId === state.currentEntity.id);
      students.forEach(std => {
        DB.customValues[`${std.id}_${newCol.id}`] = defaultValue;
      });
    }

    saveDB(DB);
    closeModal();
    render();
    alert('✅ تم إضافة العمود بنجاح!');
  }

  function deleteCustomColumn(columnId) {
    if (!confirm('هل أنت متأكد من حذف هذا العمود بالكامل؟')) return;

    DB.customColumns = DB.customColumns.filter(c => c.id !== columnId);
    saveDB(DB);
    render();
  }

  // -------------------------------------------------------------
  // TASKS MANAGEMENT (إدارة التاسكات، صح/خطأ، تمام/مش تمام، استلام، والفلوس)
  // -------------------------------------------------------------
  function createTask(data) {
    if (!state.currentEntity) return;

    let title, description, type, requiredAmount, maxScore, deadline;
    if (typeof data === 'object' && data !== null) {
      title = data.title;
      description = data.description;
      type = data.type;
      requiredAmount = data.requiredAmount;
      maxScore = data.maxScore;
      deadline = data.deadline;
    } else {
      title = arguments[0];
      description = arguments[1];
      maxScore = arguments[2];
      deadline = arguments[3];
      type = 'grade';
    }

    if (!title || !title.trim()) {
      alert('⚠️ يرجى إدخال اسم أو عنوان التاسك.');
      return;
    }

    const newTask = {
      id: 'task-' + Date.now(),
      entityId: state.currentEntity.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      type: type || 'checkbox', // 'checkbox' | 'status_tri' | 'delivery' | 'payment' | 'grade'
      requiredAmount: parseFloat(requiredAmount) || 0,
      maxScore: parseFloat(maxScore) || 10,
      deadline: deadline || '',
      createdAt: new Date().toISOString()
    };

    if (!Array.isArray(DB.tasks)) DB.tasks = [];
    DB.tasks.push(newTask);
    saveDB(DB);

    state.activeTaskId = newTask.id;
    closeModal();
    render();
    alert(`🎉 تم إضافة التاسك "${newTask.title}" بنجاح!`);
  }

  function deleteTask(taskId) {
    const task = (DB.tasks || []).find(t => t.id === taskId);
    if (!task) return;
    if (!confirm(`هل أنت متأكد من حذف التاسك "${task.title}"؟`)) return;

    DB.tasks = DB.tasks.filter(t => t.id !== taskId);
    if (DB.taskRecords) {
      Object.keys(DB.taskRecords).forEach(k => {
        if (k.startsWith(taskId + '_')) delete DB.taskRecords[k];
      });
    }
    if (state.activeTaskId === taskId) state.activeTaskId = null;

    saveDB(DB);
    render();
    alert('🗑️ تم حذف التاسك بنجاح.');
  }

  function updateTaskRecord(taskId, studentId, updates) {
    if (!DB.taskRecords) DB.taskRecords = {};
    const key = `${taskId}_${studentId}`;
    const curr = DB.taskRecords[key] || {};
    DB.taskRecords[key] = {
      ...curr,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDB(DB);
    render();
  }

  // تحديث حالة السداد والمبلغ المدفوع (فلوس)
  function updateTaskPayment(taskId, studentId, status, paidAmount) {
    const numPaid = parseFloat(paidAmount);
    updateTaskRecord(taskId, studentId, {
      status: status, // 'دفع' | 'مدفعش' | 'دفع جزئي'
      paidAmount: isNaN(numPaid) ? 0 : numPaid
    });
  }

  // تحديث حالة الاستلام (استلم / مستلمش / مش متسجل)
  function updateTaskDelivery(taskId, studentId, status) {
    updateTaskRecord(taskId, studentId, { status: status });
  }

  // تحديث حالة ثلاثية (تمام / مش تمام / لسه)
  function updateTaskStatusTri(taskId, studentId, status) {
    updateTaskRecord(taskId, studentId, { status: status });
  }

  // تحديث صح وخطأ (✓ تم / ✗ لم يتم)
  function toggleTaskDone(taskId, studentId) {
    if (!DB.taskRecords) DB.taskRecords = {};
    const key = `${taskId}_${studentId}`;
    const curr = DB.taskRecords[key] || {};
    const newDone = !curr.done;
    updateTaskRecord(taskId, studentId, {
      done: newDone,
      status: newDone ? 'تم' : 'لم يتم'
    });
  }

  // تحديث ملاحظة التاسك
  function updateTaskNote(taskId, studentId, note) {
    if (!DB.taskRecords) DB.taskRecords = {};
    const key = `${taskId}_${studentId}`;
    const curr = DB.taskRecords[key] || {};
    curr.notes = note;
    DB.taskRecords[key] = curr;
    saveDB(DB);
  }

  // تحديث درجة (لو كان نوعه درجة)
  function updateTaskScore(taskId, studentId, score) {
    const num = parseFloat(score);
    updateTaskRecord(taskId, studentId, {
      score: isNaN(num) ? null : num
    });
  }

  // تعيين جماعي لكل الطلاب في التاسك
  function batchSetTask(taskId, defaultUpdate) {
    if (!state.currentEntity) return;
    const students = DB.students.filter(s => s.entityId === state.currentEntity.id);
    if (!DB.taskRecords) DB.taskRecords = {};

    students.forEach(std => {
      const key = `${taskId}_${std.id}`;
      DB.taskRecords[key] = {
        ...(DB.taskRecords[key] || {}),
        ...defaultUpdate,
        updatedAt: new Date().toISOString()
      };
    });

    saveDB(DB);
    render();
  }

  // طباعة تقرير التاسك الرسمي لجامعة برج العرب
  function printTaskReport(taskId) {
    if (taskId) {
      state.activeTaskId = taskId;
      render();
    }
    setTimeout(() => {
      window.print();
    }, 120);
  }

  // تصدير كشف التاسك كملف إكسل CSV عربي متوافق 100% مع Microsoft Excel
  function exportTaskCSV(taskId) {
    if (!state.currentEntity) return;
    const task = (DB.tasks || []).find(t => t.id === taskId);
    if (!task) {
      alert('لم يتم العثور على التاسك المطلوب لتصديره.');
      return;
    }
    const students = DB.students.filter(s => s.entityId === state.currentEntity.id);
    if (students.length === 0) {
      alert('لا يوجد طلاب مسجلون في السكشن لتصديرهم!');
      return;
    }

    const records = DB.taskRecords || {};
    let csvContent = '';

    if (task.type === 'payment') {
      csvContent = 'م,الرقم الأكاديمي,اسم الطالب,حالة السداد,المبلغ المدفوع (جنيه),المبلغ المطلوب (جنيه),المبلغ المتبقي (جنيه),ملاحظات,رقم الهاتف\n';
      students.forEach((std, idx) => {
        const rec = records[`${task.id}_${std.id}`] || {};
        const paid = rec.paidAmount !== undefined ? parseFloat(rec.paidAmount) || 0 : (rec.status === 'دفع' && task.requiredAmount ? task.requiredAmount : 0);
        const req = task.requiredAmount || 0;
        const remaining = Math.max(0, req - paid);
        let status = rec.status || (paid >= req && req > 0 ? 'دفع' : (paid > 0 ? 'دفع جزئي' : 'مدفعش'));
        const notes = (rec.notes || '').replace(/"/g, '""');
        csvContent += `"${idx + 1}","${std.academicId}","${std.name}","${status}","${paid}","${req}","${remaining}","${notes}","${std.phone || ''}"\n`;
      });
    } else {
      csvContent = 'م,الرقم الأكاديمي,اسم الطالب,حالة التاسك والتقييم,ملاحظات,رقم الهاتف\n';
      students.forEach((std, idx) => {
        const rec = records[`${task.id}_${std.id}`] || {};
        let status = rec.status || '';
        if (task.type === 'checkbox') {
          status = rec.done ? 'تم الإنجاز ✓' : 'لم يتم ✗';
        } else if (task.type === 'grade') {
          status = (rec.score !== null && rec.score !== undefined) ? `${rec.score} من ${task.maxScore}` : 'لم يرصد';
        } else if (!status) {
          if (task.type === 'delivery') status = 'مش متسجل';
          else if (task.type === 'status_tri') status = 'لسه';
        }
        const notes = (rec.notes || '').replace(/"/g, '""');
        csvContent += `"${idx + 1}","${std.academicId}","${std.name}","${status}","${notes}","${std.phone || ''}"\n`;
      });
    }

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (task.title || 'تاسك').replace(/[/\\?%*:|"<>]/g, '_');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_تاسك_${safeTitle}_${state.currentEntity.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getPrintableTaskStatus(task, rec) {
    if (!rec) return '—';
    if (task.type === 'payment') {
      const paid = rec.paidAmount !== undefined ? parseFloat(rec.paidAmount) || 0 : (rec.status === 'دفع' && task.requiredAmount ? task.requiredAmount : 0);
      const req = task.requiredAmount || 0;
      if (req > 0 && paid >= req) return `دفع كامل (${paid} ج)`;
      if (paid > 0 && paid < req) return `دفع جزئي (${paid} ج - باقي ${req - paid} ج)`;
      if (rec.status === 'دفع') return `تم الدفع (${paid} ج)`;
      return `لم يدفع (مطلوب ${req} ج)`;
    }
    if (task.type === 'delivery') {
      const s = rec.status || 'مش متسجل';
      if (s === 'استلم') return 'تم الاستلام ✓';
      if (s === 'مستلمش') return 'لم يستلم ✗';
      return 'غير مسجل';
    }
    if (task.type === 'status_tri') {
      const s = rec.status || 'لسه';
      if (s === 'تمام') return 'تمام ✓';
      if (s === 'مش تمام') return 'مش تمام ✗';
      return 'قيد الانتظار (لسه)';
    }
    if (task.type === 'checkbox') {
      return rec.done ? 'تم الإنجاز ✓' : 'لم يتم ✗';
    }
    if (task.type === 'grade') {
      return (rec.score !== null && rec.score !== undefined) ? `${rec.score} من ${task.maxScore}` : 'لم يرصد';
    }
    return '—';
  }

  function toggleTaskTypeForm(val) {
    const payField = document.getElementById('paymentAmountField');
    const grField = document.getElementById('gradeMaxField');
    if (payField) {
      if (val === 'payment') payField.classList.remove('hidden');
      else payField.classList.add('hidden');
    }
    if (grField) {
      if (val === 'grade') grField.classList.remove('hidden');
      else grField.classList.add('hidden');
    }
  }

  // التوافق القديم
  function createAssignment(title, description, maxScore, deadline) {
    createTask({ title, description, maxScore, deadline, type: 'grade' });
    DB.assignments = DB.tasks || [];
  }
  function deleteAssignment(assignmentId) {
    deleteTask(assignmentId);
    DB.assignments = DB.tasks || [];
  }
  function updateSubmission(studentId, assignmentId, score, notes = '') {
    updateTaskRecord(assignmentId, studentId, { score: parseFloat(score) || 0, notes });
  }

  // -------------------------------------------------------------
  // ATTENDANCE SESSIONS & CONTROLS
  // -------------------------------------------------------------
  function createAttendanceSession(title, date) {
    if (!state.currentEntity) return;
    if (!title) {
      alert('يرجى إدخال عنوان جلسة التحضير (مثال: الأسبوع الثاني).');
      return;
    }

    const newSession = {
      id: 'att-' + Date.now(),
      entityId: state.currentEntity.id,
      title: title.trim(),
      date: date || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString()
    };

    if (!DB.attendanceSessions) DB.attendanceSessions = [];
    DB.attendanceSessions.push(newSession);
    state.activeAttendanceSessionId = newSession.id;
    saveDB(DB);
    closeModal();
    render();
    alert('✅ تم فتح جلسة التحضير "' + newSession.title + '" بنجاح!');
  }

  function deleteAttendanceSession(sessionId) {
    const sess = (DB.attendanceSessions || []).find(s => s.id === sessionId);
    if (!sess) return;
    if (!confirm('هل أنت متأكد من حذف جلسة التحضير "' + sess.title + '" وسجلاتها؟')) return;

    DB.attendanceSessions = DB.attendanceSessions.filter(s => s.id !== sessionId);
    if (DB.attendanceRecords) {
      Object.keys(DB.attendanceRecords).forEach(k => {
        if (k.startsWith(`${sessionId}_`)) delete DB.attendanceRecords[k];
      });
    }

    if (state.activeAttendanceSessionId === sessionId) {
      const remaining = DB.attendanceSessions.filter(s => s.entityId === state.currentEntity.id);
      state.activeAttendanceSessionId = remaining[0]?.id || null;
    }

    saveDB(DB);
    render();
    alert('🗑️ تم حذف جلسة التحضير بنجاح.');
  }

  function markAttendance(sessionId, studentId, status) {
    const key = `${sessionId}_${studentId}`;
    if (!DB.attendanceRecords) DB.attendanceRecords = {};
    DB.attendanceRecords[key] = status;
    saveDB(DB);
    render();
  }

  function toggleAttendance(sessionId, studentId) {
    const key = `${sessionId}_${studentId}`;
    if (!DB.attendanceRecords) DB.attendanceRecords = {};
    const cur = DB.attendanceRecords[key] || 'present';
    let next = 'present';
    if (cur === 'present') next = 'absent';
    else if (cur === 'absent') next = 'excused';
    else next = 'present';

    DB.attendanceRecords[key] = next;
    saveDB(DB);
    render();
  }

  function markAllAttendance(sessionId, status) {
    if (!state.currentEntity) return;
    const students = DB.students.filter(s => s.entityId === state.currentEntity.id);
    if (!DB.attendanceRecords) DB.attendanceRecords = {};
    students.forEach(std => {
      const key = `${sessionId}_${std.id}`;
      DB.attendanceRecords[key] = status;
    });
    saveDB(DB);
    render();
  }

  function resetAttendanceSession(sessionId) {
    if (!confirm('هل تريد تصفير سجلات هذه الجلسة لجميع الطلاب؟')) return;
    const students = DB.students.filter(s => s.entityId === state.currentEntity.id);
    if (!DB.attendanceRecords) DB.attendanceRecords = {};
    students.forEach(std => {
      delete DB.attendanceRecords[`${sessionId}_${std.id}`];
    });
    saveDB(DB);
    render();
  }

  // طباعة كشف الحضور والغياب الرسمي
  function printAttendanceView() {
    if (state.activeTab !== 'attendance') {
      state.activeTab = 'attendance';
      render();
    }
    setTimeout(() => {
      window.print();
    }, 120);
  }

  // تصدير كشف الحضور والغياب CSV إكسل
  function exportAttendanceCSV(sessionId = null) {
    if (!state.currentEntity) return;
    const ent = state.currentEntity;
    const students = DB.students.filter(s => s.entityId === ent.id);
    const sessions = (DB.attendanceSessions || []).filter(s => s.entityId === ent.id);

    if (students.length === 0) {
      alert('لا يوجد طلاب لتصدير كشف الحضور!');
      return;
    }

    if (sessions.length === 0) {
      alert('لا توجد جلسات حضور مسجلة لتصديرها!');
      return;
    }

    let csvContent = '';
    const records = DB.attendanceRecords || {};

    if (sessionId) {
      // تصدير جلسة محددة
      const sess = sessions.find(s => s.id === sessionId);
      if (!sess) return;
      csvContent = 'م,الرقم الأكاديمي,اسم الطالب,حالة الحضور,تاريخ الجلسة,رقم الهاتف\n';
      students.forEach((std, idx) => {
        const st = records[`${sess.id}_${std.id}`] || 'absent';
        const label = st === 'present' ? 'حاضر' : (st === 'excused' ? 'إذن' : 'غائب');
        csvContent += `"${idx + 1}","${std.academicId}","${std.name}","${label}","${sess.date}","${std.phone || ''}"\n`;
      });
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeTitle = (sess.title || 'جلسة').replace(/[/\\?%*:|"<>]/g, '_');
      link.href = url;
      link.download = `كشف_حضور_${safeTitle}_${ent.name}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // تصدير الشيت المجمع لجميع الجلسات والأسابيع
      let header = 'م,الرقم الأكاديمي,اسم الطالب,رقم الهاتف';
      sessions.forEach(sess => {
        header += `,"${sess.title} (${sess.date})"`;
      });
      header += ',إجمالي الحضور,إجمالي الغياب,إجمالي الإذن,نسبة الالتزام %,حالة الإنذار\n';
      csvContent = header;

      students.forEach((std, idx) => {
        let present = 0, absent = 0, excused = 0;
        let row = `"${idx + 1}","${std.academicId}","${std.name}","${std.phone || ''}"`;
        sessions.forEach(sess => {
          const st = records[`${sess.id}_${std.id}`] || 'absent';
          if (st === 'present') {
            present++;
            row += ',"حاضر"';
          } else if (st === 'excused') {
            excused++;
            row += ',"إذن"';
          } else {
            absent++;
            row += ',"غائب"';
          }
        });
        const total = sessions.length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;
        const warning = absent >= 3 ? 'إنذار حرمان (3+ غياب)' : (absent === 2 ? 'مهدد بالإنذار' : 'منتظم');
        row += `,"${present}","${absent}","${excused}","${rate}%","${warning}"\n`;
        csvContent += row;
      });

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `شيت_الغياب_المجمع_${ent.name}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // إضافة جلسات حضور تجريبية كـ عينة للتجربة الفورية
  function seedSampleAttendanceSessions(entityId = null) {
    const entId = entityId || state.currentEntity?.id;
    if (!entId) return;

    const existingSessions = (DB.attendanceSessions || []).filter(s => s.entityId === entId);
    if (existingSessions.length > 0) {
      if (!confirm(`يوجد حالياً ${existingSessions.length} جلسة حضور مسجلة. هل تريد إضافة 4 جلسات تجريبية كـ عينة؟`)) {
        return;
      }
    }

    const students = DB.students.filter(s => s.entityId === entId);
    if (students.length === 0) {
      alert('يرجى إضافة طلاب للسكشن أولاً قبل إضافة جلسات حضور تجريبية!');
      return;
    }

    const today = new Date();
    const d1 = new Date(today); d1.setDate(today.getDate() - 21);
    const d2 = new Date(today); d2.setDate(today.getDate() - 14);
    const d3 = new Date(today); d3.setDate(today.getDate() - 7);
    const d4 = new Date(today);

    const sampleSessionsData = [
      { id: 'att-sample-1-' + Date.now(), entityId: entId, title: 'الأسبوع 1: المعمل الأول والمقدمة', date: d1.toISOString().slice(0, 10) },
      { id: 'att-sample-2-' + Date.now(), entityId: entId, title: 'الأسبوع 2: التجربة العملية 1', date: d2.toISOString().slice(0, 10) },
      { id: 'att-sample-3-' + Date.now(), entityId: entId, title: 'الأسبوع 3: تسليم مسائل الشيت', date: d3.toISOString().slice(0, 10) },
      { id: 'att-sample-4-' + Date.now(), entityId: entId, title: 'الأسبوع 4: تدريب عملي واختبار', date: d4.toISOString().slice(0, 10) }
    ];

    if (!DB.attendanceSessions) DB.attendanceSessions = [];
    if (!DB.attendanceRecords) DB.attendanceRecords = {};

    sampleSessionsData.forEach((sess, sIdx) => {
      DB.attendanceSessions.push(sess);
      students.forEach((std, i) => {
        const key = `${sess.id}_${std.id}`;
        if (i % 7 === sIdx % 7) {
          DB.attendanceRecords[key] = 'absent';
        } else if (i % 11 === sIdx % 11) {
          DB.attendanceRecords[key] = 'excused';
        } else {
          DB.attendanceRecords[key] = 'present';
        }
      });
    });

    state.activeAttendanceSessionId = sampleSessionsData[0].id;
    saveDB(DB);
    render();
    alert(`✅ تم بنجاح إضافة 4 جلسات حضور أسبوعية تجريبية مع رصد غياب الطلاب لـ (${state.currentEntity.name})!`);
  }

  // -------------------------------------------------------------
  // CSV EXPORT & IMPORT
  // -------------------------------------------------------------
  function exportStudentsCSV() {
    if (!state.currentEntity) return;
    const students = DB.students.filter(s => s.entityId === state.currentEntity.id);
    if (students.length === 0) {
      alert('لا يوجد طلاب مسجلون لتصديرهم!');
      return;
    }

    let csvContent = 'م,الرقم الأكاديمي,اسم الطالب,رقم الهاتف\n';
    students.forEach((std, idx) => {
      csvContent += `"${idx + 1}","${std.academicId}","${std.name}","${std.phone || ''}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `كشف_شيت_متابعة_${state.currentEntity.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importStudentsCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      processBulkPasteStudents(text);
    };
    reader.readAsText(file);
  }

  // -------------------------------------------------------------
  // PRINT HELPERS
  // -------------------------------------------------------------
  function printStudentsDirectory() {
    if (state.activeTab !== 'students') {
      state.activeTab = 'students';
      render();
    }
    setTimeout(() => {
      window.print();
    }, 120);
  }

  function printGridView() {
    if (state.activeTab !== 'grid') {
      state.activeTab = 'grid';
      render();
    }
    setTimeout(() => {
      window.print();
    }, 120);
  }

  // -------------------------------------------------------------
  // SAMPLE STUDENTS SEEDER (نماذج طلاب كـ مثال للتجربة)
  // -------------------------------------------------------------
  const SAMPLE_STUDENTS = [
    { academicId: '20240101', name: 'أحمد محمد إبراهيم حسن', phone: '01011110001', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240102', name: 'مريم محمود إبراهيم النجار', phone: '01011110002', problemStatus: 'pending', problemType: 'تأخير تسليم شيت / تكليف', problemDetails: 'تأخرت في تسليم شيت العملي لعذر ظرف طارئ', problemDate: '2026-11-01', actionTaken: 'تم إمهالها 24 ساعة للتسليم' },
    { academicId: '20240103', name: 'يوسف خالد عبد العزيز سالم', phone: '01011110003', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240104', name: 'سلمى طارق عبد الرحمن شلبي', phone: '01011110004', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240105', name: 'عمر شريف فتحي جلال', phone: '01011110005', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240106', name: 'نور الدين حسام الدين مصطفى', phone: '01011110006', problemStatus: 'pending', problemType: 'مشكلة مالية / رسوم', problemDetails: 'طلب تقسيط رسوم الزيارة العلمية', problemDate: '2026-11-02', actionTaken: 'دفع 50 جنيه ومتبقي 50 جنيه' },
    { academicId: '20240107', name: 'سارة علي حسن بدوي', phone: '01011110007', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240108', name: 'عبد الرحمن محمود السيد', phone: '01011110008', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240109', name: 'نادين أحمد فاروق سالم', phone: '01011110009', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240110', name: 'مصطفى كمال الدين حامد', phone: '01011110010', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240111', name: 'زياد إيهاب مصطفى خليل', phone: '01011110011', problemStatus: 'resolved', problemType: 'غياب بعذر طبي', problemDetails: 'قدم شهادة طبية عن غياب معمل الشبكات', problemDate: '2026-10-28', actionTaken: 'تم قبول العذر وتعويض التجربة' },
    { academicId: '20240112', name: 'آية محمد سامي الشناوي', phone: '01011110012', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240113', name: 'حمزة شريف النجار عثمان', phone: '01011110013', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240114', name: 'حبيبة أحمد رضوان غانم', phone: '01011110014', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240115', name: 'كريم عادل صبري منصور', phone: '01011110015', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240116', name: 'شهد وائل عزت درويش', phone: '01011110016', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240117', name: 'خالد وليد عثمان الشريف', phone: '01011110017', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240118', name: 'ملك أسامة عبد الله زايد', phone: '01011110018', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240119', name: 'بلال هاني الديب عبد العال', phone: '01011110019', problemStatus: 'none', problemType: '', problemDetails: '' },
    { academicId: '20240120', name: 'رنا هيثم جلال العطار', phone: '01011110020', problemStatus: 'none', problemType: '', problemDetails: '' }
  ];

  function seedSampleStudents(entityId = null, force = false) {
    const entId = entityId || state.currentEntity?.id;
    if (!entId) return;

    const existing = DB.students.filter(s => s.entityId === entId);
    if (existing.length > 0 && !force) {
      if (!confirm(`يوجد حالياً ${existing.length} طالب مسجل في هذا السكشن. هل تريد إضافة 20 طالباً تجريبياً كـ عينة؟`)) {
        return;
      }
    }

    const secNum = state.currentEntity?.sectionNumber || '1';
    const prefix = `2024${String(secNum).padStart(2, '0')}`;

    const newStudents = SAMPLE_STUDENTS.map((tmpl, idx) => {
      const stdId = 'std-' + Date.now() + '-' + idx;
      const academicId = `${prefix}${String(idx + 1).padStart(2, '0')}`;
      return {
        id: stdId,
        entityId: entId,
        academicId: tmpl.academicId || academicId,
        name: tmpl.name,
        phone: tmpl.phone,
        notes: '',
        hasProblem: tmpl.problemStatus === 'pending',
        problemStatus: tmpl.problemStatus || 'none',
        problemType: tmpl.problemType || '',
        problemDetails: tmpl.problemDetails || '',
        problemDate: tmpl.problemDate || '',
        actionTaken: tmpl.actionTaken || ''
      };
    });

    DB.students.push(...newStudents);

    // إذا كانت هناك تاسكات، نضع سجلات تجريبية لتنشيط الشيت والإحصائيات
    const tasks = (DB.tasks || []).filter(t => t.entityId === entId);
    if (!DB.taskRecords) DB.taskRecords = {};
    tasks.forEach(t => {
      newStudents.forEach((std, i) => {
        const recKey = `${t.id}_${std.id}`;
        if (t.type === 'payment') {
          const isPaid = i % 3 === 0;
          const isPartial = i % 3 === 1;
          const req = t.requiredAmount || 100;
          DB.taskRecords[recKey] = {
            status: isPaid ? 'دفع' : (isPartial ? 'دفع جزئي' : 'مدفعش'),
            paidAmount: isPaid ? req : (isPartial ? Math.round(req / 2) : 0),
            notes: isPartial ? 'متبقي النصف القادم' : ''
          };
        } else if (t.type === 'delivery') {
          DB.taskRecords[recKey] = {
            status: i % 2 === 0 ? 'استلم' : 'مستلمش',
            notes: ''
          };
        } else if (t.type === 'status_tri') {
          DB.taskRecords[recKey] = {
            status: i % 4 === 0 ? 'مش تمام' : (i % 4 === 1 ? 'لسه' : 'تمام'),
            notes: ''
          };
        } else if (t.type === 'checkbox') {
          DB.taskRecords[recKey] = {
            done: i % 3 !== 0,
            status: i % 3 !== 0 ? 'تم' : 'لم يتم',
            notes: ''
          };
        } else if (t.type === 'grade') {
          const max = t.maxScore || 10;
          const score = Math.max(5, Math.min(max, 6 + (i % 5)));
          DB.taskRecords[recKey] = {
            score: score,
            done: true,
            notes: ''
          };
        }
      });
    });

    saveDB(DB);
    render();
    alert(`✅ تم بنجاح إضافة ${newStudents.length} طالباً كـ عينة للتجربة في (${state.currentEntity.name})!`);
  }

  // -------------------------------------------------------------
  // QUICK WHATSAPP GROUP HELPERS (أدوات جروب الواتساب السريع)
  // -------------------------------------------------------------
  function saveEntityWhatsappLink(link) {
    if (!state.currentEntity) return;
    const cleanLink = (link || '').trim();
    state.currentEntity.whatsappLink = cleanLink;
    const e = DB.entities.find(ent => ent.id === state.currentEntity.id);
    if (e) {
      e.whatsappLink = cleanLink;
    }
    saveDB(DB);
    alert('✅ تم حفظ وتثبيت رابط جروب الواتساب للسكشن بنجاح!');
    render();
  }

  function downloadStudentsVCF() {
    if (!state.currentEntity) return;
    const students = DB.students.filter(s => s.entityId === state.currentEntity.id && s.phone);
    if (students.length === 0) {
      alert('لا يوجد طلاب مسجلون بأرقام هواتف لتصدير جهات الاتصال!');
      return;
    }
    const prefix = state.currentEntity.code || `س${state.currentEntity.sectionNumber || '1'}`;
    let vcf = '';
    students.forEach(s => {
      let p = (s.phone || '').trim().replace(/[^0-9]/g, '');
      if (p.startsWith('0')) p = '+2' + p;
      else if (!p.startsWith('+')) p = '+2' + p;
      vcf += `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:[${prefix}] ${s.name}\r\nTEL;TYPE=CELL,VOICE:${p}\r\nEND:VCARD\r\n`;
    });

    const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (state.currentEntity.name || 'سكشن').replace(/[/\\?%*:|"<>]/g, '_');
    a.download = `جهات_اتصال_${safeName}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function copyAllStudentPhones(format = 'comma') {
    if (!state.currentEntity) return;
    const students = DB.students.filter(s => s.entityId === state.currentEntity.id && s.phone);
    if (students.length === 0) {
      alert('لا توجد أرقام هواتف مسجلة للطلاب في هذا السكشن!');
      return;
    }
    let text = '';
    if (format === 'comma') {
      text = students.map(s => s.phone.trim()).join(', ');
    } else {
      text = students.map(s => `${s.name} (${s.academicId}): ${s.phone.trim()}`).join('\n');
    }
    navigator.clipboard.writeText(text).then(() => {
      alert(`✅ تم نسخ ${students.length} رقم هاتف بنجاح إلى الحافظة!`);
    }).catch(() => {
      prompt('انسخ أرقام الطلاب من هنا:', text);
    });
  }

  function copyGroupInviteMessage() {
    const ent = state.currentEntity;
    if (!ent) return;
    const link = ent.whatsappLink || '';
    if (!link) {
      alert('يرجى حفظ رابط الجروب أولاً قبل نسخ رسالة الدعوة!');
      return;
    }
    const msg = `السلام عليكم ورحمة الله وبركاته،\nأهلاً بكم يا شباب في جروب الواتساب الرسمي الخاص بـ (${ent.name}).\nيرجى من جميع الزملاء الانضمام عبر الرابط التالي لمتابعة الشيتات والغياب والتنبيهات الهامة:\n${link}\n\nليدر السكشن: ${ent.leader?.name || ''}`;
    navigator.clipboard.writeText(msg).then(() => {
      alert('✅ تم نسخ رسالة الدعوة ورابط الجروب بنجاح! جاهزة للصق في أي مكان.');
    }).catch(() => {
      prompt('انسخ رسالة الدعوة من هنا:', msg);
    });
  }

  // Modal controls
  function openModal(type, data = null) { state.modal = type; state.modalData = data; render(); }
  function closeModal() { state.modal = null; state.modalData = null; render(); }

  // -------------------------------------------------------------
  // MAIN APP RENDERER
  // -------------------------------------------------------------
  function render() {
    const app = document.getElementById('app');
    if (!app) return;

    // إذا لم يكن هناك أي سكشن أو مجموعة مسجلة، إظهار شاشة التسجيل الأولى
    if (!DB.entities || DB.entities.length === 0) {
      app.innerHTML = renderRegisterFirstEntityScreen();
      return;
    }

    // التأكد من تحديد كيان صالح
    if (!state.currentEntity || !DB.entities.some(e => e.id === state.currentEntity.id)) {
      state.currentEntity = DB.entities[0];
    }

    const ent = state.currentEntity;
    const isSec = ent.type === 'section';
    const stats = getEntityStats(ent.id);

    app.innerHTML = `
      <!-- Top Navbar -->
      <header class="bg-brand-900 text-white shadow-md sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center py-2.5 gap-2">
          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="bg-brand-600 p-2 rounded-xl font-black text-lg tracking-wider shadow">BATU</div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <!-- قائمة اختيار وتغيير السكشن أو المجموعة -->
                <div class="flex items-center gap-1.5 bg-brand-800/90 px-2.5 py-1.5 rounded-xl border border-brand-700 shadow-xs">
                  <span class="text-xs text-brand-300 font-bold hidden sm:inline">الحالي:</span>
                  <select onchange="switchEntity(this.value);" class="bg-transparent text-white font-extrabold text-xs sm:text-sm focus:outline-none cursor-pointer">
                    ${DB.entities.map(e => `
                      <option value="${e.id}" class="text-slate-900 font-bold" ${e.id === ent.id ? 'selected' : ''}>
                        ${e.type === 'section' ? '🏢' : '👥'} ${e.name}
                      </option>
                    `).join('')}
                  </select>
                </div>

                <!-- زر تسجيل سكشن أو مجموعة جديدة -->
                <button onclick="openModal('register_entity');" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow transition" title="تسجيل سكشن أو مجموعة جديدة">
                  <span>➕</span>
                  <span class="hidden sm:inline">تسجيل سكشن / مجموعة</span>
                </button>

                <!-- زر تعديل الاسم -->
                <button onclick="editEntityName('${ent.id}');" class="bg-brand-800 hover:bg-brand-700 text-brand-200 text-xs px-2.5 py-1.5 rounded-xl border border-brand-700 transition" title="تعديل الاسم">
                  <span>✏️</span>
                </button>

                <!-- زر الحذف -->
                ${DB.entities.length > 1 ? `
                  <button onclick="deleteEntity('${ent.id}');" class="bg-rose-900/40 hover:bg-rose-800 text-rose-300 text-xs px-2.5 py-1.5 rounded-xl border border-rose-700/50 transition" title="حذف هذا السجل">
                    <span>🗑️</span>
                  </button>
                ` : ''}
              </div>

              <!-- تفاصيل هوية السكشن أو المجموعة والمسؤولين -->
              <div class="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-brand-200">
                <span class="font-bold text-white">
                  ${isSec ? `🏢 سكشن ${ent.sectionNumber || ''} (مجموعة ${ent.groupNumber || ''})` : `👥 مجموعة ${ent.groupNumber || ''}`}
                </span>
                <span class="text-brand-400">•</span>
                <span class="flex items-center gap-1">
                  <span>👤 المسؤول:</span>
                  <strong class="text-emerald-300">${ent.leader?.name || 'غير محدد'}</strong>
                </span>
                ${(ent.coOfficials && ent.coOfficials.length > 0) ? `
                  <span class="text-brand-400">•</span>
                  <span class="flex items-center gap-1 bg-emerald-950/60 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-600/40 font-bold">
                    <span>🤝 ومسؤول معاه:</span>
                    <strong class="text-amber-300">${ent.coOfficials[0].name}</strong>
                    <span class="text-[10px] text-slate-300">(${ent.coOfficials[0].role})</span>
                    ${ent.coOfficials.length > 1 ? `<span class="text-[10px] bg-emerald-800 px-1 rounded-full">+${ent.coOfficials.length - 1}</span>` : ''}
                  </span>
                ` : ''}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-2 space-x-reverse flex-wrap gap-1.5">
            <button onclick="openModal('quick_whatsapp');" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow transition" title="إنشاء وإدارة جروب واتساب سريع">
              <span>💬</span>
              <span>جروب الواتس</span>
            </button>
            <button onclick="openModal('add_student');" class="bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow transition border border-brand-600">
              <span>➕</span>
              <span>إضافة طالب</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <nav class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-14 sm:top-16 z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-4 space-x-reverse overflow-x-auto">
          <button onclick="state.activeTab='home'; render();" class="py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${state.activeTab === 'home' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}">
            <span>🏠</span> الرئيسية (البيت)
          </button>
          <button onclick="state.activeTab='grid'; render();" class="py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${state.activeTab === 'grid' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}">
            <span>📊</span> شيت المتابعة
          </button>
          <button onclick="state.activeTab='tasks'; render();" class="py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${state.activeTab === 'tasks' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black' : 'border-transparent text-slate-500 hover:text-slate-700'}">
            <span>📋</span> التاسكات والمهام (${stats.tasksCount || 0})
          </button>
          <button onclick="state.activeTab='attendance'; render();" class="py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${state.activeTab === 'attendance' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-black' : 'border-transparent text-slate-500 hover:text-slate-700'}">
            <span>⏱</span> رصد الحضور والغياب (${(DB.attendanceSessions || []).filter(s => s.entityId === ent.id).length})
          </button>
          <button onclick="state.activeTab='students'; render();" class="py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${state.activeTab === 'students' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}">
            <span>👥</span> كشف الطلاب والتواصل (${stats.totalStudents})
          </button>
          <button onclick="state.activeTab='notebook'; render();" class="py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${state.activeTab === 'notebook' ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-black' : 'border-transparent text-slate-500 hover:text-slate-700'}">
            <span>📓</span> دفتر النوتة والمشكلات
            ${stats.pendingProblemsCount > 0 ? `
              <span class="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">${stats.pendingProblemsCount}</span>
            ` : ''}
          </button>
          <button onclick="state.activeTab='dashboard'; render();" class="py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${state.activeTab === 'dashboard' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}">
            <span>📈</span> الإحصائيات
          </button>
        </div>
      </nav>

      <!-- Main Container -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        ${renderActiveTabContent()}
      </main>

      <!-- Modals Container -->
      ${renderModals()}
    `;
  }

  // -------------------------------------------------------------
  // FIRST TIME REGISTRATION SCREEN
  // -------------------------------------------------------------
  function renderRegisterFirstEntityScreen() {
    return `
      <div class="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div class="max-w-lg w-full bg-slate-800 border border-slate-700 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 text-right">
          <div class="text-center space-y-2">
            <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto border border-emerald-500/30">
              🎓
            </div>
            <h2 class="text-xl sm:text-2xl font-black">نظام إدارة السكاشن والمجموعات</h2>
            <p class="text-xs text-slate-400">جامعة برج العرب التكنولوجية | تسجيل الدخول المباشر</p>
          </div>

          <div class="p-3 rounded-2xl bg-slate-700/50 border border-slate-600 text-xs text-slate-300 leading-relaxed text-center">
            اختر ما إذا كنت تريد تسجيل <strong>سكشن</strong> أو <strong>مجموعة</strong>، وحدد رقم السكشن والمجموعة ومين هيكون مسؤول معاك.
          </div>

          <form onsubmit="event.preventDefault(); handleFirstEntitySubmit(this);" class="space-y-4">
            <!-- اختيار سكشن أو مجموعة -->
            <div>
              <label class="form-label text-slate-200">أنت تريد إدارة: *</label>
              <div class="grid grid-cols-2 gap-3 mt-1">
                <label class="cursor-pointer">
                  <input type="radio" name="entityType" value="section" checked onchange="toggleRegFormType(this.value);" class="peer sr-only" />
                  <div class="p-3 text-center rounded-xl border-2 border-slate-600 bg-slate-750 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 font-bold text-xs transition">
                    🏢 سكشن
                  </div>
                </label>

                <label class="cursor-pointer">
                  <input type="radio" name="entityType" value="group" onchange="toggleRegFormType(this.value);" class="peer sr-only" />
                  <div class="p-3 text-center rounded-xl border-2 border-slate-600 bg-slate-750 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 font-bold text-xs transition">
                    👥 مجموعة
                  </div>
                </label>
              </div>
            </div>

            <!-- حقول السكشن والمجموعة -->
            <div class="form-grid-2" id="secGroupFields">
              <div id="sectionNumContainer">
                <label class="form-label text-slate-200">سكشن كام؟ *</label>
                <input type="text" name="sectionNumber" required placeholder="مثال: 1 أو 2" class="input-box text-right font-bold text-emerald-400" />
              </div>
              <div>
                <label class="form-label text-slate-200">مجموعة كام؟ *</label>
                <input type="text" name="groupNumber" required placeholder="مثال: 1 أو 2" class="input-box text-right font-bold text-emerald-400" />
              </div>
            </div>

            <!-- بيانات المسؤول الرئيسي -->
            <div class="border-t border-slate-700 pt-3 space-y-3">
              <h4 class="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <span>👤</span>
                <span>المسؤول الرئيسي (أنت / الليدر):</span>
              </h4>
              <div class="form-grid-2">
                <div>
                  <label class="form-label text-slate-300">اسمك بالكامل *</label>
                  <input type="text" name="leaderName" required placeholder="مثال: أحمد علي عبد الله" class="input-box text-right" />
                </div>
                <div>
                  <label class="form-label text-slate-300">رقم الهاتف</label>
                  <input type="tel" name="leaderPhone" placeholder="01xxxxxxxxx" class="input-box text-right font-mono" />
                </div>
              </div>
            </div>

            <!-- مين مسؤول معاه -->
            <div class="border-t border-slate-700 pt-3 space-y-3">
              <h4 class="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <span>🤝</span>
                <span>مين مسؤول معاك؟ (المسؤول المشارك / النائب):</span>
              </h4>
              <div class="form-grid-2">
                <div>
                  <label class="form-label text-slate-300">اسم زميلك المسؤول معاك</label>
                  <input type="text" name="coName" placeholder="مثال: محمود حسن" class="input-box text-right" />
                </div>
                <div>
                  <label class="form-label text-slate-300">صفته / دوره</label>
                  <input type="text" name="coRole" value="نائب ليدر" class="input-box text-right" />
                </div>
              </div>
              <div>
                <label class="form-label text-slate-300">رقم هاتف المسؤول المشارك</label>
                <input type="tel" name="coPhone" placeholder="01xxxxxxxxx" class="input-box text-right font-mono" />
              </div>
            </div>

            <button type="submit" class="btn-primary w-full py-3.5 text-sm font-black shadow-lg mt-2">
              🚀 تسجيل والبدء في الإدارة فوراً
            </button>
          </form>
        </div>
      </div>
    `;
  }

  function toggleRegFormType(val) {
    const secContainer = document.getElementById('sectionNumContainer');
    const secInput = secContainer ? secContainer.querySelector('input') : null;
    if (val === 'group') {
      if (secContainer) secContainer.style.display = 'none';
      if (secInput) secInput.required = false;
    } else {
      if (secContainer) secContainer.style.display = 'block';
      if (secInput) secInput.required = true;
    }
  }

  function handleFirstEntitySubmit(form) {
    const type = form.entityType.value;
    const sectionNumber = form.sectionNumber ? form.sectionNumber.value : '';
    const groupNumber = form.groupNumber.value;
    const leaderName = form.leaderName.value;
    const leaderPhone = form.leaderPhone.value;
    const coName = form.coName.value;
    const coRole = form.coRole.value;
    const coPhone = form.coPhone.value;

    registerEntity({
      type,
      sectionNumber,
      groupNumber,
      leaderName,
      leaderPhone,
      coName,
      coRole,
      coPhone
    });
  }

  // -------------------------------------------------------------
  // TAB ROUTER
  // -------------------------------------------------------------
  function renderActiveTabContent() {
    switch (state.activeTab) {
      case 'home':
        return renderHomeView();
      case 'grid':
        return renderGridView();
      case 'tasks':
      case 'assignments':
        return renderTasksView();
      case 'attendance':
        return renderAttendanceView();
      case 'students':
        return renderStudentsDirectoryView();
      case 'notebook':
        return renderNotebookView();
      case 'dashboard':
        return renderDashboardView();
      default:
        return renderHomeView();
    }
  }

  // -------------------------------------------------------------
  // 1. HOME VIEW (الرئيسية مع تفاصيل المسؤولين ومن معاهم)
  // -------------------------------------------------------------
  function renderHomeView() {
    const ent = state.currentEntity;
    const isSec = ent.type === 'section';
    const stats = getEntityStats(ent.id);
    const tasksCount = (DB.tasks || []).filter(t => t.entityId === ent.id).length;
    const attCount = DB.attendanceSessions.filter(a => a.entityId === ent.id).length;

    return `
      <div class="space-y-6">
        <!-- Hero Section Card -->
        <div class="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
          <div class="relative z-10 flex flex-wrap justify-between items-center gap-4">
            <div>
              <span class="inline-block bg-white/20 text-emerald-100 text-xs px-3 py-1 rounded-full font-bold mb-2 backdrop-blur-xs">
                ${isSec ? '🏢 لوحة متابعة السكشن' : '👥 لوحة متابعة المجموعة'}
              </span>
              <h2 class="text-2xl sm:text-3xl font-black">${ent.name}</h2>
              <div class="text-xs sm:text-sm text-emerald-100 mt-2 space-y-1">
                <p>
                  ${isSec ? `السكشن رقم <strong>${ent.sectionNumber}</strong> التابع للمجموعة رقم <strong>${ent.groupNumber}</strong>.` : `المجموعة رقم <strong>${ent.groupNumber}</strong>.`}
                </p>
                <p class="flex items-center gap-2 flex-wrap text-xs">
                  <span>👤 المسؤول الرئيسي: <strong>${ent.leader?.name || 'غير محدد'}</strong></span>
                  ${(ent.coOfficials && ent.coOfficials.length > 0) ? `
                    <span class="bg-black/20 px-2.5 py-0.5 rounded-full text-amber-200 border border-white/20">
                      🤝 ومسؤول معاه: <strong>${ent.coOfficials[0].name}</strong> (${ent.coOfficials[0].role})
                    </span>
                  ` : ''}
                </p>
              </div>
            </div>
            <div class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[130px]">
              <span class="text-xs text-emerald-200 block">كود التعريف</span>
              <span class="text-2xl font-black font-mono tracking-widest text-white">${ent.code}</span>
            </div>
          </div>
        </div>

        <!-- Quick Student Search Bar in Home -->
        <div class="card-box flex flex-wrap items-center justify-between gap-3 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 p-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">🔍</span>
            <div>
              <h4 class="text-xs font-black text-slate-800 dark:text-white">البحث السريع عن طالب</h4>
              <p class="text-[11px] text-slate-400">ابحث بالاسم أو الرقم الأكاديمي أو الهاتف</p>
            </div>
          </div>
          <div class="flex-1 min-w-[220px] max-w-md">
            <input 
              type="text" 
              value="${state.searchQuery || ''}" 
              oninput="state.activeTab='grid'; handleSearch(this.value);" 
              placeholder="اكتب اسم أو رقم الطالب للانتقال فوراً للشيت..." 
              class="student-search-box input-box text-xs w-full font-bold shadow-xs border-emerald-500/30 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Stats Counters -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div class="card-box flex items-center gap-3">
            <span class="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold">👥</span>
            <div>
              <span class="text-[11px] text-slate-400 block font-medium">الطلاب المسجلون</span>
              <span class="text-lg font-black text-slate-800 dark:text-white">${stats.totalStudents}</span>
            </div>
          </div>

          <div class="card-box flex items-center gap-3 cursor-pointer hover:border-rose-400 transition" onclick="state.activeTab='notebook'; render();">
            <span class="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl font-bold">📓</span>
            <div>
              <span class="text-[11px] text-slate-400 block font-medium">سجل النوتة والمشكلات</span>
              <span class="text-lg font-black ${stats.pendingProblemsCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-white'}">
                ${stats.pendingProblemsCount} <small class="text-[10px] font-bold text-slate-400">(مشكلات)</small>
              </span>
            </div>
          </div>

          <div class="card-box flex items-center gap-3">
            <span class="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold">✅</span>
            <div>
              <span class="text-[11px] text-slate-400 block font-medium">تسليم الشيتات</span>
              <span class="text-lg font-black text-amber-600 dark:text-amber-400">${stats.doneCount} <small class="text-[10px] font-bold text-slate-400">(${stats.donePercent}%)</small></span>
            </div>
          </div>

          <div class="card-box flex items-center gap-3 cursor-pointer hover:border-indigo-400 transition" onclick="state.activeTab='tasks'; render();">
            <span class="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold">📋</span>
            <div>
              <span class="text-[11px] text-slate-400 block font-medium">التاسكات والمهام</span>
              <span class="text-lg font-black text-slate-800 dark:text-white">${tasksCount}</span>
            </div>
          </div>

          <div class="card-box flex items-center gap-3 col-span-2 sm:col-span-1">
            <span class="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl font-bold">⏱</span>
            <div>
              <span class="text-[11px] text-slate-400 block font-medium">جلسات الحضور</span>
              <span class="text-lg font-black text-slate-800 dark:text-white">${attCount}</span>
            </div>
          </div>
        </div>

        <!-- طاقم المسؤولين (مين مسؤول معاه) -->
        <div class="card-box space-y-4">
          <div class="card-header border-b pb-3 border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span class="text-xl">🤝</span>
              <div>
                <h3 class="text-sm font-black text-slate-800 dark:text-white">طاقم المسؤولين ومين مسؤول معاه</h3>
                <p class="text-xs text-slate-400">إدارة المسؤول الرئيسي والزملاء المسؤولين المساعدين</p>
              </div>
            </div>
            <button onclick="openModal('add_co_official');" class="btn-primary-sm">
              <span>➕</span>
              <span>إضافة مسؤول آخر معاه</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- المسؤول الرئيسي -->
            <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg font-bold shadow-xs">👑</span>
                <div>
                  <h4 class="text-xs font-black text-slate-900 dark:text-white">${ent.leader?.name || 'غير محدد'}</h4>
                  <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">${ent.leader?.role || 'المسؤول الرئيسي'}</span>
                  ${ent.leader?.phone ? `<span class="text-[10px] text-slate-500 font-mono block" dir="ltr">📞 ${ent.leader.phone}</span>` : ''}
                </div>
              </div>
              <span class="badge-tag bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-black">
                المسؤول الأول
              </span>
            </div>

            <!-- المسؤولون المشاركون -->
            ${(ent.coOfficials || []).map(co => `
              <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg font-bold shadow-xs">🤝</span>
                  <div>
                    <h4 class="text-xs font-black text-slate-900 dark:text-white">${co.name}</h4>
                    <span class="text-[10px] font-bold text-amber-700 dark:text-amber-400 block">${co.role}</span>
                    ${co.phone ? `<span class="text-[10px] text-slate-500 font-mono block" dir="ltr">📞 ${co.phone}</span>` : ''}
                  </div>
                </div>
                <button onclick="deleteCoOfficial('${ent.id}', '${co.id}');" class="text-rose-500 hover:text-rose-700 text-xs px-2 py-1 font-bold" title="حذف المسؤول المشارك">
                  ✕ حذف
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="card-box space-y-4">
          <div class="card-header">
            <h3 class="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span>⚡</span>
              <span>إجراءات وإضافات سريعة</span>
            </h3>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button onclick="openModal('quick_whatsapp');" class="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 transition text-right group">
              <span class="text-2xl block mb-1 group-hover:scale-110 transition">💬</span>
              <span class="font-bold text-xs text-slate-800 dark:text-slate-100 block">جروب الواتس السريع</span>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">إنشاء ودعوة الطلاب</span>
            </button>

            <button onclick="state.activeTab='notebook'; render();" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 hover:border-rose-500/50 transition text-right group">
              <span class="text-2xl block mb-1 group-hover:scale-110 transition">📓</span>
              <span class="font-bold text-xs text-slate-800 dark:text-slate-100 block">دفتر النوتة والمشكلات</span>
              <span class="text-[10px] text-slate-400">متابعة وطباعة المشكلات</span>
            </button>

            <button onclick="openModal('add_student');" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition text-right group">
              <span class="text-2xl block mb-1 group-hover:scale-110 transition">➕</span>
              <span class="font-bold text-xs text-slate-800 dark:text-slate-100 block">إضافة طالب</span>
              <span class="text-[10px] text-slate-400">تسجيل طالب جديد</span>
            </button>

            <button onclick="openModal('bulk_paste_students');" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 transition text-right group">
              <span class="text-2xl block mb-1 group-hover:scale-110 transition">📋</span>
              <span class="font-bold text-xs text-slate-800 dark:text-slate-100 block">لصق كشف كامل</span>
              <span class="text-[10px] text-slate-400">استيراد كشف كامل</span>
            </button>

            <button onclick="openModal('add_task');" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 transition text-right group">
              <span class="text-2xl block mb-1 group-hover:scale-110 transition">📋</span>
              <span class="font-bold text-xs text-slate-800 dark:text-slate-100 block">إضافة تاسك جديد</span>
              <span class="text-[10px] text-slate-400">صح/خطأ، استلام، فلوس</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // 2. GRID VIEW (شيت المتابعة)
  // -------------------------------------------------------------
  function renderGridView() {
    const ent = state.currentEntity;
    const { allStudents, students } = getFilteredStudents(ent.id);
    const columns = DB.customColumns.filter(c => c.ownerId === ent.id);

    return `
      <div class="space-y-4">
        <!-- University Print Header (يظهر فقط في الطباعة) -->
        <div class="print-only mb-6 border-b-2 border-slate-900 pb-4">
          <div class="flex justify-between items-center text-xs text-slate-800">
            <div class="text-right">
              <p class="font-black text-sm">جامعة برج العرب التكنولوجية</p>
              <p class="font-bold">كلية تكنولوجيا الصناعة والطاقة</p>
              <p class="text-slate-600">شؤون التعليم والطلاب</p>
            </div>
            <div class="text-center">
              <div class="inline-block border-2 border-slate-900 px-4 py-1.5 rounded-lg">
                <h2 class="text-base font-black text-slate-900">شيت المتابعة ورصد التكليفات</h2>
                <p class="text-xs font-bold text-slate-700">${ent.name} (${ent.code || ''})</p>
              </div>
            </div>
            <div class="text-left text-xs font-mono">
              <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-EG')}</p>
              <p><strong>المسؤول:</strong> ${ent.leader?.name || 'غير محدد'}</p>
              <p><strong>إجمالي الطلاب:</strong> ${allStudents.length} طالب</p>
            </div>
          </div>
        </div>

        <!-- Actions Header & Search -->
        <div class="card-box flex flex-wrap justify-between items-center gap-3 no-print">
          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="openModal('add_student');" class="btn-primary-sm">
              <span>➕</span>
              <span>إضافة طالب</span>
            </button>
            <button onclick="openModal('add_column');" class="btn-secondary-sm">
              <span>📊</span>
              <span>إضافة عمود</span>
            </button>
            <button onclick="exportStudentsCSV();" class="btn-action-sm">
              <span>📥</span>
              <span>تصدير CSV</span>
            </button>
            <button onclick="printGridView();" class="btn-action-sm">
              <span>🖨️</span>
              <span>طباعة</span>
            </button>
            <button onclick="openModal('quick_whatsapp');" class="btn-action-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 font-bold">
              <span>💬</span>
              <span>جروب الواتس</span>
            </button>
          </div>

          <!-- Live Student Search Bar -->
          ${renderSearchBar('بحث في شيت المتابعة بالاسم أو الرقم أو الهاتف...')}

          <div class="text-xs font-bold text-slate-500 whitespace-nowrap">
            ${state.searchQuery ? `
              المطابق للبحث: <span class="text-emerald-600 font-black">${students.length}</span> من أصل <span class="text-slate-700 dark:text-slate-300">${allStudents.length}</span>
            ` : `
              إجمالي الطلاب: <span class="text-emerald-600 font-black">${allStudents.length}</span>
            `}
          </div>
        </div>

        <!-- Table Grid -->
        <div class="card-box p-0 overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 rounded-2xl">
          <div class="overflow-x-auto max-h-[70vh]">
            <table class="w-full text-right text-xs border-collapse">
              <thead class="bg-slate-100 dark:bg-slate-900 sticky top-0 z-30 shadow-xs border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="p-3 w-12 text-center font-bold">م</th>
                  <th class="p-3 col-fixed-1 bg-slate-100 dark:bg-slate-900 w-32 font-bold">الرقم الأكاديمي</th>
                  <th class="p-3 col-fixed-2 bg-slate-100 dark:bg-slate-900 min-w-[170px] font-bold">اسم الطالب</th>
                  <th class="p-3 min-w-[130px] font-bold text-center">حالة التسليم (Done)</th>
                  ${columns.map(col => `
                    <th class="p-3 min-w-[140px] font-bold border-r border-slate-200 dark:border-slate-700">
                      <div class="flex items-center justify-between gap-1">
                        <span>${col.title}</span>
                        <button onclick="deleteCustomColumn('${col.id}');" class="text-rose-400 hover:text-rose-600 text-xs px-1 no-print" title="حذف العمود">✕</button>
                      </div>
                    </th>
                  `).join('')}
                  <th class="p-3 text-center w-20 font-bold no-print">إجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                ${students.length === 0 ? `
                  <tr>
                    <td colspan="${5 + columns.length}" class="p-8 text-center text-slate-400">
                      ${state.searchQuery ? `
                        <div class="space-y-2">
                          <p class="text-amber-500 font-bold text-sm">🔍 لم يتم العثور على أي طالب يطابق "${state.searchQuery}"</p>
                          <button onclick="handleSearch('');" class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold">إلغاء البحث وعرض جميع الطلاب</button>
                        </div>
                      ` : `
                        <div class="space-y-3 py-6">
                          <span class="text-4xl block">📊</span>
                          <p class="font-bold text-slate-600 dark:text-slate-300">لا يوجد طلاب مسجلون في هذا الشيت بعد.</p>
                          <div class="flex items-center justify-center gap-2 flex-wrap">
                            <button onclick="openModal('add_student');" class="btn-primary-sm">
                              <span>➕</span>
                              <span>إضافة طالب يدوي</span>
                            </button>
                            <button onclick="openModal('bulk_paste_students');" class="btn-secondary-sm">
                              <span>📋</span>
                              <span>لصق كشف كامل</span>
                            </button>
                          </div>
                        </div>
                      `}
                    </td>
                  </tr>
                ` : students.map((std, idx) => {
                  const isDone = DB.customValues[`${std.id}_done`] === true;
                  return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition ${isDone ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''}">
                      <td class="p-3 text-center text-slate-400 font-mono">${idx + 1}</td>
                      <td class="p-3 col-fixed-1 font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800">
                        ${std.academicId}
                      </td>
                      <td class="p-3 col-fixed-2 font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800">
                        <div class="flex items-center justify-between gap-1.5">
                          <span>${std.name}</span>
                          ${(std.problemStatus === 'pending' || std.hasProblem) ? `
                            <button onclick="openModal('edit_problem', '${std.id}');" class="no-print px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[9px] font-black border border-rose-300 dark:border-rose-800 hover:scale-105 transition" title="${std.problemDetails || 'عنده مشكلة في النوتة'}">
                              ⚠️ مشكلة
                            </button>
                            <span class="print-only text-[8pt] text-rose-600 font-bold">(مشكلة)</span>
                          ` : std.problemStatus === 'resolved' ? `
                            <button onclick="openModal('edit_problem', '${std.id}');" class="no-print px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[9px] font-black border border-amber-300 dark:border-amber-800" title="تم حل المشكلة">
                              ✅ تم
                            </button>
                          ` : ''}
                        </div>
                      </td>
                      <td class="p-2.5 text-center">
                        <button onclick="toggleStudentDone('${std.id}');" class="no-print px-3 py-1 rounded-full text-xs font-bold transition flex items-center justify-center gap-1 mx-auto ${isDone ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-slate-600'}">
                          <span>${isDone ? '✓ مسلم (Done)' : '○ غير مسلم'}</span>
                        </button>
                        <span class="print-only font-bold text-[9pt]">
                          ${isDone ? 'مسلم ✓' : 'غير مسلم ✗'}
                        </span>
                      </td>
                      ${columns.map(col => {
                        const cellVal = DB.customValues[`${std.id}_${col.id}`] || '';
                        return `
                          <td class="p-2 border-r border-slate-100 dark:border-slate-800">
                            ${renderCellEditor(col, std.id, cellVal)}
                          </td>
                        `;
                      }).join('')}
                      <td class="p-2.5 text-center no-print">
                        <button onclick="deleteStudent('${std.id}');" class="text-rose-500 hover:text-rose-700 text-xs px-2 py-1 font-bold">
                          حذف
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- University Print Signatures Footer (يظهر فقط في الطباعة) -->
        <div class="print-only mt-8 pt-4 border-t-2 border-slate-900">
          <div class="grid grid-cols-3 text-center text-xs text-slate-900 font-bold">
            <div>
              <p class="mb-8">ليدر / مسؤول السكشن</p>
              <p class="font-black">${ent.leader?.name || '........................'}</p>
            </div>
            <div>
              <p class="mb-8">المسؤول المشارك</p>
              <p class="font-black">${(ent.coOfficials && ent.coOfficials[0]?.name) || '........................'}</p>
            </div>
            <div>
              <p class="mb-8">اعتماد شؤون الطلاب</p>
              <p class="font-black">........................</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCellEditor(col, studentId, value) {
    if (col.type === 'status') {
      const opts = col.options && col.options.length > 0 ? col.options : ['تمام', 'مش تمام', 'لسه'];
      return `
        <select onchange="updateCellValue('${studentId}', '${col.id}', this.value);" class="no-print w-full text-xs font-bold p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 ${value === 'تمام' ? 'text-emerald-600' : value === 'مش تمام' ? 'text-rose-600' : 'text-amber-600'}">
          <option value="">-- اختر --</option>
          ${opts.map(opt => `
            <option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>
          `).join('')}
        </select>
        <span class="print-only font-bold text-[9pt]">${value || '—'}</span>
      `;
    }

    if (col.type === 'payment') {
      const isPaid = value === 'تم الدفع';
      return `
        <button onclick="updateCellValue('${studentId}', '${col.id}', '${isPaid ? 'لم يدفع' : 'تم الدفع'}');" class="no-print w-full py-1 px-2 rounded-lg text-xs font-bold transition ${isPaid ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}">
          ${isPaid ? '💵 تم الدفع' : '❌ لم يدفع'}
        </button>
        <span class="print-only font-bold text-[9pt]">${isPaid ? 'تم الدفع ✓' : 'لم يدفع ✗'}</span>
      `;
    }

    return `
      <input type="text" value="${value}" onchange="updateCellValue('${studentId}', '${col.id}', this.value);" class="no-print input-box p-1.5 text-xs" placeholder="أدخل قيمة..." />
      <span class="print-only text-[9pt]">${value || '—'}</span>
    `;
  }

  // -------------------------------------------------------------
  // 3. TASKS VIEW (صفحة التاسكات والمهام والمتابعة والفلوس)
  // -------------------------------------------------------------
  function renderTasksView() {
    const ent = state.currentEntity;
    const tasks = (DB.tasks || []).filter(t => t.entityId === ent.id);
    const { allStudents, students } = getFilteredStudents(ent.id);

    if (!state.activeTaskId || !tasks.some(t => t.id === state.activeTaskId)) {
      state.activeTaskId = tasks[0]?.id || null;
    }
    const currentTask = tasks.find(t => t.id === state.activeTaskId);

    return `
      <div class="space-y-4">
        <!-- Header & Action -->
        <div class="card-box flex flex-wrap justify-between items-center gap-3">
          <div class="flex items-center gap-2.5">
            <span class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold shadow-xs">
              📋
            </span>
            <div>
              <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>التاسكات والمهام الخاصة بـ (${ent.name})</span>
                <span class="badge-tag bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  ${tasks.length} تاسك
                </span>
              </h3>
              <p class="text-xs text-slate-400">متابعة إنجاز الطلاب: صح/خطأ، تمام ومش تمام، استلام، وسداد المبالغ والفلوس</p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            ${renderSearchBar('بحث عن طالب في التاسك بالاسم أو الرقم...')}
            <button onclick="openModal('add_task');" class="btn-primary-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition">
              <span>➕</span>
              <span>إضافة تاسك جديد</span>
            </button>
          </div>
        </div>

        ${tasks.length === 0 ? `
          <div class="card-box text-center p-12 text-slate-400 space-y-3">
            <span class="text-4xl block">📋</span>
            <p class="font-bold text-slate-600 dark:text-slate-300 text-sm">لم يتم إضافة أي تاسك بعد.</p>
            <p class="text-xs">تقدر تضيف تاسك دلوقتي سواء متابعة صح/خطأ، تمام ومش تمام، استلام، أو سداد مبالغ وفلوس.</p>
            <button onclick="openModal('add_task');" class="btn-primary-sm mx-auto mt-2">
              <span>➕ إضافة أول تاسك الآن</span>
            </button>
          </div>
        ` : `
          <!-- Task Selector Tabs -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700">
            ${tasks.map(t => {
              const isActive = t.id === currentTask?.id;
              let icon = '📋';
              if (t.type === 'payment') icon = '💰';
              else if (t.type === 'delivery') icon = '📦';
              else if (t.type === 'status_tri') icon = '🔘';
              else if (t.type === 'checkbox') icon = '✓';
              else if (t.type === 'grade') icon = '🎯';

              return `
                <button onclick="state.activeTaskId='${t.id}'; render();" class="px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap shadow-xs ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-102 ring-2 ring-indigo-400/50'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }">
                  <span>${icon}</span>
                  <span>${t.title}</span>
                  ${t.type === 'payment' && t.requiredAmount ? `<span class="bg-black/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">${t.requiredAmount} ج</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Active Task Card & Live Stats -->
          ${renderCurrentTaskDetails(currentTask, students, allStudents)}
        `}
      </div>
    `;
  }

  function renderCurrentTaskDetails(task, students, allStudents) {
    if (!task) return '';
    const records = DB.taskRecords || {};

    let typeBadge = '';
    if (task.type === 'payment') typeBadge = '<span class="badge-tag bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">💰 سداد مالي وفلوس</span>';
    else if (task.type === 'delivery') typeBadge = '<span class="badge-tag bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">📦 استلام وتسليم</span>';
    else if (task.type === 'status_tri') typeBadge = '<span class="badge-tag bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">🔘 تمام / مش تمام / لسه</span>';
    else if (task.type === 'checkbox') typeBadge = '<span class="badge-tag bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold">✓ صح / تم - ✗ لم يتم</span>';
    else if (task.type === 'grade') typeBadge = `<span class="badge-tag bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">🎯 درجات (من ${task.maxScore})</span>`;

    // Calculate stats
    let statsHtml = '';
    let batchButtons = '';

    if (task.type === 'payment') {
      let paidCount = 0;
      let partialCount = 0;
      let unpaidCount = 0;
      let totalMoney = 0;

      allStudents.forEach(s => {
        const r = records[`${task.id}_${s.id}`] || {};
        const amount = parseFloat(r.paidAmount) || 0;
        totalMoney += amount;
        if (r.status === 'دفع' || (task.requiredAmount > 0 && amount >= task.requiredAmount)) {
          paidCount++;
        } else if (r.status === 'دفع جزئي' || (amount > 0 && amount < task.requiredAmount)) {
          partialCount++;
        } else {
          unpaidCount++;
        }
      });

      const targetTotal = task.requiredAmount ? allStudents.length * task.requiredAmount : 0;

      statsHtml = `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
            <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">إجمالي المحصل:</span>
            <span class="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">${totalMoney} ج</span>
            ${targetTotal > 0 ? `<span class="text-[10px] text-slate-400 font-mono block">من ${targetTotal} ج</span>` : ''}
          </div>
          <div class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
            <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">دفع كامل (مسدد):</span>
            <span class="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">${paidCount} طالب</span>
          </div>
          <div class="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20">
            <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">دفع جزئي (باقي عليه):</span>
            <span class="text-base font-black text-amber-600 dark:text-amber-400 font-mono">${partialCount} طالب</span>
          </div>
          <div class="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20">
            <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">لم يدفع (مدفعش):</span>
            <span class="text-base font-black text-rose-600 dark:text-rose-400 font-mono">${unpaidCount} طالب</span>
          </div>
        </div>
      `;

      batchButtons = `
        <div class="flex items-center gap-1.5 flex-wrap text-xs">
          <span class="text-slate-400 font-bold text-[11px]">إجراء جماعي:</span>
          <button onclick="batchSetTask('${task.id}', { status: 'دفع', paidAmount: ${task.requiredAmount || 0} });" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition">
            🟢 جعل الكل دفع كامل
          </button>
          <button onclick="batchSetTask('${task.id}', { status: 'مدفعش', paidAmount: 0 });" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition">
            🔴 تصفير السداد للكل
          </button>
        </div>
      `;
    } else if (task.type === 'delivery') {
      let delivered = 0, notDelivered = 0, unregistered = 0;
      allStudents.forEach(s => {
        const r = records[`${task.id}_${s.id}`] || {};
        if (r.status === 'استلم') delivered++;
        else if (r.status === 'مستلمش') notDelivered++;
        else unregistered++;
      });

      statsHtml = `
        <div class="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
            <span class="text-[10px] text-slate-500 block font-bold">استلم:</span>
            <span class="text-base font-black text-emerald-600 font-mono">${delivered} طالب</span>
          </div>
          <div class="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20">
            <span class="text-[10px] text-slate-500 block font-bold">مستلمش:</span>
            <span class="text-base font-black text-amber-600 font-mono">${notDelivered} طالب</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span class="text-[10px] text-slate-500 block font-bold">مش متسجل:</span>
            <span class="text-base font-black text-slate-600 dark:text-slate-300 font-mono">${unregistered} طالب</span>
          </div>
        </div>
      `;

      batchButtons = `
        <div class="flex items-center gap-1.5 flex-wrap text-xs">
          <span class="text-slate-400 font-bold text-[11px]">إجراء جماعي:</span>
          <button onclick="batchSetTask('${task.id}', { status: 'استلم' });" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition">
            🟢 تحديد الكل استلم
          </button>
          <button onclick="batchSetTask('${task.id}', { status: 'مستلمش' });" class="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition">
            🔴 تحديد الكل مستلمش
          </button>
          <button onclick="batchSetTask('${task.id}', { status: 'مش متسجل' });" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition">
            ⚪ تحديد الكل مش متسجل
          </button>
        </div>
      `;
    } else if (task.type === 'status_tri') {
      let tamam = 0, mshTamam = 0, lesa = 0;
      allStudents.forEach(s => {
        const r = records[`${task.id}_${s.id}`] || {};
        if (r.status === 'تمام') tamam++;
        else if (r.status === 'مش تمام') mshTamam++;
        else lesa++;
      });

      statsHtml = `
        <div class="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
            <span class="text-[10px] text-slate-500 block font-bold">تمام:</span>
            <span class="text-base font-black text-emerald-600 font-mono">${tamam} طالب</span>
          </div>
          <div class="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20">
            <span class="text-[10px] text-slate-500 block font-bold">مش تمام:</span>
            <span class="text-base font-black text-rose-600 font-mono">${mshTamam} طالب</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span class="text-[10px] text-slate-500 block font-bold">لسه:</span>
            <span class="text-base font-black text-slate-600 dark:text-slate-300 font-mono">${lesa} طالب</span>
          </div>
        </div>
      `;

      batchButtons = `
        <div class="flex items-center gap-1.5 flex-wrap text-xs">
          <span class="text-slate-400 font-bold text-[11px]">إجراء جماعي:</span>
          <button onclick="batchSetTask('${task.id}', { status: 'تمام' });" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition">
            🟢 تحديد الكل تمام
          </button>
          <button onclick="batchSetTask('${task.id}', { status: 'مش تمام' });" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition">
            🔴 تحديد الكل مش تمام
          </button>
          <button onclick="batchSetTask('${task.id}', { status: 'لسه' });" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition">
            ⚪ تحديد الكل لسه
          </button>
        </div>
      `;
    } else if (task.type === 'checkbox') {
      let done = 0, notDone = 0;
      allStudents.forEach(s => {
        const r = records[`${task.id}_${s.id}`] || {};
        if (r.done) done++;
        else notDone++;
      });

      statsHtml = `
        <div class="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
            <span class="text-[10px] text-slate-500 block font-bold">تم / صح:</span>
            <span class="text-base font-black text-emerald-600 font-mono">${done} طالب</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span class="text-[10px] text-slate-500 block font-bold">لم يتم:</span>
            <span class="text-base font-black text-slate-600 dark:text-slate-300 font-mono">${notDone} طالب</span>
          </div>
        </div>
      `;

      batchButtons = `
        <div class="flex items-center gap-1.5 flex-wrap text-xs">
          <span class="text-slate-400 font-bold text-[11px]">إجراء جماعي:</span>
          <button onclick="batchSetTask('${task.id}', { done: true, status: 'تم' });" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition">
            ✓ تحديد الكل تم
          </button>
          <button onclick="batchSetTask('${task.id}', { done: false, status: 'لم يتم' });" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition">
            ✗ إلغاء الكل
          </button>
        </div>
      `;
    }

    return `
      <div class="card-box space-y-4 border border-slate-200 dark:border-slate-700 shadow-md">
        <!-- University Print Header (يظهر فقط في الطباعة) -->
        <div class="print-only mb-6 border-b-2 border-slate-900 pb-4">
          <div class="flex justify-between items-center text-xs text-slate-800">
            <div class="text-right">
              <p class="font-black text-sm">جامعة برج العرب التكنولوجية</p>
              <p class="font-bold">كلية تكنولوجيا الصناعة والطاقة</p>
              <p class="text-slate-600">شؤون التعليم والطلاب</p>
            </div>
            <div class="text-center">
              <div class="inline-block border-2 border-slate-900 px-4 py-1.5 rounded-lg">
                <h2 class="text-base font-black text-slate-900">كشف متابعة تاسك: ${task.title}</h2>
                <p class="text-xs font-bold text-slate-700">${state.currentEntity.name} ${task.deadline ? `- الموعد: ${task.deadline}` : ''}</p>
              </div>
            </div>
            <div class="text-left text-xs font-mono">
              <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-EG')}</p>
              <p><strong>المسؤول:</strong> ${state.currentEntity.leader?.name || 'غير محدد'}</p>
              <p><strong>إجمالي الطلاب:</strong> ${allStudents.length} طالب</p>
            </div>
          </div>
        </div>

        <!-- Task Header -->
        <div class="card-header border-b pb-3 border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="text-base sm:text-lg font-black text-slate-800 dark:text-white">${task.title}</h4>
              ${typeBadge}
            </div>
            ${task.description ? `<p class="text-xs text-slate-400 mt-1">${task.description}</p>` : ''}
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            ${task.deadline ? `
              <span class="badge-tag bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs">
                📅 ${task.deadline}
              </span>
            ` : ''}
            <button onclick="exportTaskCSV('${task.id}');" class="btn-action-sm">
              <span>📥</span>
              <span>تصدير CSV</span>
            </button>
            <button onclick="printTaskReport('${task.id}');" class="btn-action-sm">
              <span>🖨️</span>
              <span>طباعة</span>
            </button>
            <button onclick="deleteTask('${task.id}');" class="btn-danger-sm">
              🗑️ حذف التاسك
            </button>
          </div>
        </div>

        <!-- Task Stats Counters -->
        ${statsHtml}

        <!-- Batch Action Buttons -->
        ${batchButtons ? `<div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 no-print">${batchButtons}</div>` : ''}

        <!-- Students Task Table -->
        <div class="overflow-x-auto max-h-[60vh] border border-slate-200 dark:border-slate-700 rounded-xl">
          <table class="w-full text-right text-xs border-collapse">
            <thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
              <tr>
                <th class="p-3 font-bold w-12 text-center">م</th>
                <th class="p-3 font-bold w-28">الرقم الأكاديمي</th>
                <th class="p-3 font-bold w-44">اسم الطالب</th>
                <th class="p-3 font-bold min-w-[220px]">حالة التاسك والتقييم</th>
                <th class="p-3 font-bold min-w-[150px]">ملاحظات</th>
                <th class="p-3 font-bold text-center w-20 no-print">تواصل</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
              ${students.length === 0 ? `
                <tr>
                  <td colspan="6" class="p-8 text-center text-slate-400">لا يوجد طلاب يطابقون البحث.</td>
                </tr>
              ` : students.map((std, idx) => {
                const rec = records[`${task.id}_${std.id}`] || {};

                return `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                    <td class="p-3 text-center text-slate-400 font-mono font-bold">${idx + 1}</td>
                    <td class="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">${std.academicId}</td>
                    <td class="p-3 font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                      ${std.name}
                      ${std.phone ? `<span class="block text-[10px] text-slate-400 font-mono" dir="ltr">📞 ${std.phone}</span>` : ''}
                    </td>

                    <!-- خانة التاسك التفاعلية -->
                    <td class="p-2.5">
                      <div class="no-print">
                        ${renderTaskInputCell(task, std.id, rec)}
                      </div>
                      <span class="print-only font-bold text-[9pt]">
                        ${getPrintableTaskStatus(task, rec)}
                      </span>
                    </td>

                    <!-- ملاحظة -->
                    <td class="p-2.5">
                      <input 
                        type="text" 
                        value="${rec.notes || ''}" 
                        placeholder="ملاحظة خاصة..." 
                        onchange="updateTaskNote('${task.id}', '${std.id}', this.value);" 
                        class="no-print input-box p-1.5 text-xs w-full"
                      />
                      <span class="print-only text-[9pt]">
                        ${rec.notes || '—'}
                      </span>
                    </td>

                    <!-- تواصل -->
                    <td class="p-2.5 text-center whitespace-nowrap no-print">
                      ${std.phone ? `
                        <a href="https://wa.me/2${std.phone.replace(/^0/, '')}" target="_blank" class="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow hover:scale-110 transition" title="مراسلة واتساب">
                          💬
                        </a>
                      ` : '<span class="text-slate-400 text-[10px]">—</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- University Print Signatures Footer (يظهر فقط في الطباعة) -->
        <div class="print-only mt-8 pt-4 border-t-2 border-slate-900">
          <div class="grid grid-cols-3 text-center text-xs text-slate-900 font-bold">
            <div>
              <p class="mb-8">ليدر / مسؤول السكشن</p>
              <p class="font-black">${state.currentEntity.leader?.name || '........................'}</p>
            </div>
            <div>
              <p class="mb-8">المسؤول المشارك</p>
              <p class="font-black">${(state.currentEntity.coOfficials && state.currentEntity.coOfficials[0]?.name) || '........................'}</p>
            </div>
            <div>
              <p class="mb-8">اعتماد شؤون الطلاب</p>
              <p class="font-black">........................</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderTaskInputCell(task, studentId, rec) {
    if (task.type === 'checkbox') {
      const isDone = rec.done === true;
      return `
        <button onclick="toggleTaskDone('${task.id}', '${studentId}');" class="px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
          isDone ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-slate-600'
        }">
          <span>${isDone ? '✓ صح / تم' : '○ لم يتم'}</span>
        </button>
      `;
    }

    if (task.type === 'status_tri') {
      const status = rec.status || 'لسه';
      return `
        <div class="flex items-center gap-1.5 flex-wrap">
          <button onclick="updateTaskStatusTri('${task.id}', '${studentId}', 'تمام');" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${
            status === 'تمام' ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50'
          }">
            🟢 تمام
          </button>
          <button onclick="updateTaskStatusTri('${task.id}', '${studentId}', 'مش تمام');" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${
            status === 'مش تمام' ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-50'
          }">
            🔴 مش تمام
          </button>
          <button onclick="updateTaskStatusTri('${task.id}', '${studentId}', 'لسه');" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${
            status === 'لسه' ? 'bg-slate-500 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
          }">
            ⚪ لسه
          </button>
        </div>
      `;
    }

    if (task.type === 'delivery') {
      const status = rec.status || 'مش متسجل';
      return `
        <div class="flex items-center gap-1.5 flex-wrap">
          <button onclick="updateTaskDelivery('${task.id}', '${studentId}', 'استلم');" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${
            status === 'استلم' ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50'
          }">
            🟢 استلم
          </button>
          <button onclick="updateTaskDelivery('${task.id}', '${studentId}', 'مستلمش');" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${
            status === 'مستلمش' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-50'
          }">
            🔴 مستلمش
          </button>
          <button onclick="updateTaskDelivery('${task.id}', '${studentId}', 'مش متسجل');" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${
            status === 'مش متسجل' ? 'bg-slate-500 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
          }">
            ⚪ مش متسجل
          </button>
        </div>
      `;
    }

    if (task.type === 'payment') {
      const status = rec.status || 'مدفعش';
      const paid = rec.paidAmount !== undefined ? rec.paidAmount : (status === 'دفع' && task.requiredAmount ? task.requiredAmount : 0);
      const isComplete = task.requiredAmount > 0 && paid >= task.requiredAmount;
      const isPartial = task.requiredAmount > 0 && paid > 0 && paid < task.requiredAmount;

      return `
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <select onchange="updateTaskPayment('${task.id}', '${studentId}', this.value, '${paid}');" class="text-xs font-bold py-1 px-2 rounded-lg border transition ${
              status === 'دفع' || isComplete
                ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : status === 'دفع جزئي' || isPartial
                ? 'bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
            }">
              <option value="دفع" ${status === 'دفع' || isComplete ? 'selected' : ''}>🟢 دفع</option>
              <option value="دفع جزئي" ${status === 'دفع جزئي' || isPartial ? 'selected' : ''}>🟡 دفع جزئي</option>
              <option value="مدفعش" ${status === 'مدفعش' && !isComplete && !isPartial ? 'selected' : ''}>🔴 مدفعش</option>
            </select>

            <div class="flex items-center gap-1">
              <span class="text-[11px] text-slate-400 font-bold">المبلغ:</span>
              <input 
                type="number" 
                min="0" 
                value="${paid}" 
                placeholder="0" 
                onchange="
                  const val = parseFloat(this.value) || 0;
                  let st = 'دفع';
                  if (val === 0) st = 'مدفعش';
                  else if (${task.requiredAmount || 0} > 0 && val < ${task.requiredAmount || 0}) st = 'دفع جزئي';
                  updateTaskPayment('${task.id}', '${studentId}', st, val);
                " 
                class="input-box w-20 py-1 px-2 text-center font-mono font-bold text-xs" 
              />
              <span class="text-xs font-bold text-slate-500">ج</span>
            </div>
          </div>

          ${(task.requiredAmount > 0) ? `
            <div class="text-[10px] font-bold">
              ${isComplete ? `
                <span class="text-emerald-600 dark:text-emerald-400">✓ تم سداد كامل المبلغ المطلوب (${task.requiredAmount} ج)</span>
              ` : (paid > 0) ? `
                <span class="text-amber-600 dark:text-amber-400 font-mono">⚠️ باقي عليه: ${task.requiredAmount - paid} ج من أصل ${task.requiredAmount} ج</span>
              ` : `
                <span class="text-rose-500 font-mono">مطلوب منه: ${task.requiredAmount} ج</span>
              `}
            </div>
          ` : ''}
        </div>
      `;
    }

    if (task.type === 'grade') {
      const scoreVal = rec.score !== null && rec.score !== undefined ? rec.score : '';
      return `
        <div class="flex items-center gap-1.5">
          <input 
            type="number" 
            step="0.5" 
            max="${task.maxScore}" 
            min="0" 
            value="${scoreVal}" 
            placeholder="0" 
            onchange="updateTaskScore('${task.id}', '${studentId}', this.value);" 
            class="input-box w-20 py-1 px-2 text-center font-mono font-bold text-xs" 
          />
          <span class="text-xs text-slate-400 font-bold">من ${task.maxScore}</span>
        </div>
      `;
    }

    return '';
  }

  // -------------------------------------------------------------
  // 4. ATTENDANCE VIEW (شيت وسجلات الحضور والغياب)
  // -------------------------------------------------------------
  function renderAttendanceView() {
    const ent = state.currentEntity;
    const sessions = (DB.attendanceSessions || []).filter(s => s.entityId === ent.id);
    const { allStudents, students } = getFilteredStudents(ent.id);
    const records = DB.attendanceRecords || {};

    if (!state.activeAttendanceSessionId || !sessions.some(s => s.id === state.activeAttendanceSessionId)) {
      state.activeAttendanceSessionId = sessions[0]?.id || null;
    }
    const currentSession = sessions.find(s => s.id === state.activeAttendanceSessionId);

    // حساب إحصائيات الحضور العامة للسكشن
    let totalPresentSlots = 0;
    let totalPossibleSlots = allStudents.length * sessions.length;
    let perfectStudentsCount = 0;
    let warningStudentsCount = 0;

    allStudents.forEach(std => {
      let stdPresent = 0;
      let stdAbsent = 0;
      sessions.forEach(sess => {
        const st = records[`${sess.id}_${std.id}`] || 'absent';
        if (st === 'present') {
          stdPresent++;
          totalPresentSlots++;
        } else if (st === 'absent') {
          stdAbsent++;
        }
      });
      if (sessions.length > 0 && stdPresent === sessions.length) perfectStudentsCount++;
      if (stdAbsent >= 2) warningStudentsCount++;
    });

    const averageRate = totalPossibleSlots > 0 ? Math.round((totalPresentSlots / totalPossibleSlots) * 100) : 0;
    const isMatrix = state.attendanceViewMode !== 'single';

    return `
      <div class="space-y-4">
        <!-- University Print Header (يظهر فقط في الطباعة) -->
        <div class="print-only mb-6 border-b-2 border-slate-900 pb-4">
          <div class="flex justify-between items-center text-xs text-slate-800">
            <div class="text-right">
              <p class="font-black text-sm">جامعة برج العرب التكنولوجية</p>
              <p class="font-bold">كلية تكنولوجيا الصناعة والطاقة</p>
              <p class="text-slate-600">شؤون التعليم والطلاب</p>
            </div>
            <div class="text-center">
              <div class="inline-block border-2 border-slate-900 px-4 py-1.5 rounded-lg">
                <h2 class="text-base font-black text-slate-900">
                  ${isMatrix ? 'كشف رصد الحضور والغياب الفصلي المجمع' : `كشف حضور جلسة: ${currentSession?.title || ''}`}
                </h2>
                <p class="text-xs font-bold text-slate-700">${ent.name} (${ent.code || ''}) ${!isMatrix && currentSession ? `- تاريخ: ${currentSession.date}` : ''}</p>
              </div>
            </div>
            <div class="text-left text-xs font-mono">
              <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-EG')}</p>
              <p><strong>المسؤول:</strong> ${ent.leader?.name || 'غير محدد'}</p>
              <p><strong>إجمالي الطلاب:</strong> ${allStudents.length} طالب</p>
            </div>
          </div>
        </div>

        <!-- Attendance Toolbar & Actions -->
        <div class="card-box flex flex-wrap justify-between items-center gap-3 no-print">
          <div class="flex items-center gap-2.5">
            <span class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold shadow-xs">
              ⏱
            </span>
            <div>
              <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>سجلات الحضور والغياب (${ent.name})</span>
                <span class="badge-tag bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  ${sessions.length} جلسة
                </span>
              </h3>
              <p class="text-xs text-slate-400">رصد الحضور الفصلي المجمع، نسب الالتزام، وتنبيهات الغياب على واتساب</p>
            </div>
          </div>

          <!-- Action buttons (تصدير CSV بجانب طباعة) -->
          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="openModal('create_attendance_session');" class="btn-primary-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <span>➕</span>
              <span>فتح جلسة جديدة</span>
            </button>
            <button onclick="exportAttendanceCSV(${isMatrix ? 'null' : `'${currentSession?.id || ''}'`});" class="btn-action-sm">
              <span>📥</span>
              <span>تصدير CSV</span>
            </button>
            <button onclick="printAttendanceView();" class="btn-action-sm">
              <span>🖨️</span>
              <span>طباعة</span>
            </button>
            <button onclick="seedSampleAttendanceSessions();" class="btn-secondary-sm bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300">
              <span>✨</span>
              <span>جلسات كـ مثال</span>
            </button>
          </div>
        </div>

        <!-- Smart Attendance Stats Counters -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 no-print">
          <div class="card-box p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <span class="text-[10px] text-slate-400 font-bold block">إجمالي الجلسات:</span>
            <span class="text-base sm:text-lg font-black text-slate-800 dark:text-white font-mono">${sessions.length} جلسة</span>
          </div>

          <div class="card-box p-3 border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">متوسط الحضور بالسكشن:</span>
            <span class="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">${averageRate}%</span>
          </div>

          <div class="card-box p-3 border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20">
            <span class="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">ملتزمون (حضور 100%):</span>
            <span class="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 font-mono">${perfectStudentsCount} طالب</span>
          </div>

          <div class="card-box p-3 border border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20 cursor-pointer hover:border-rose-400 transition" onclick="state.attendanceFilter = state.attendanceFilter === 'warning' ? 'all' : 'warning'; render();">
            <span class="text-[10px] text-rose-600 dark:text-rose-400 font-bold block flex items-center justify-between">
              <span>مهددون بإنذار غياب:</span>
              <span class="text-[9px] underline">انقر للفلترة</span>
            </span>
            <span class="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 font-mono">${warningStudentsCount} طالب</span>
          </div>
        </div>

        <!-- Controls Bar: View Mode Switcher + Filter + Search Bar -->
        <div class="card-box flex flex-wrap justify-between items-center gap-3 no-print">
          <!-- View Mode Toggle -->
          <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button onclick="state.attendanceViewMode='matrix'; render();" class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${isMatrix ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}">
              <span>📊</span>
              <span>شيت الغياب المجمع</span>
            </button>
            <button onclick="state.attendanceViewMode='single'; render();" class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${!isMatrix ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}">
              <span>⏱</span>
              <span>التحضير السريع (جلسة جلسة)</span>
            </button>
          </div>

          <!-- Attendance Filter Toggle -->
          <div class="flex items-center gap-1.5">
            <button onclick="state.attendanceFilter='all'; render();" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${state.attendanceFilter !== 'warning' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
              الكل (${students.length})
            </button>
            <button onclick="state.attendanceFilter='warning'; render();" class="px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${state.attendanceFilter === 'warning' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
              <span>⚠️ مهددون بالإنذار (${warningStudentsCount})</span>
            </button>
          </div>

          <!-- Search Input -->
          ${renderSearchBar('بحث في الحضور بالاسم أو الرقم أو الهاتف...')}
        </div>

        ${sessions.length === 0 ? `
          <div class="card-box text-center p-12 text-slate-400 space-y-3">
            <span class="text-4xl block">⏱</span>
            <p class="font-bold text-slate-700 dark:text-slate-300 text-sm">لم يتم فتح أي جلسات حضور بعد.</p>
            <p class="text-xs">تقدر تفتح جلسة حضور أسبوعية دلوقتي أو تضغط على "جلسات كـ مثال" لتجربة الشيت فوراً.</p>
            <div class="flex items-center justify-center gap-2 pt-2 flex-wrap">
              <button onclick="seedSampleAttendanceSessions();" class="btn-primary-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold">
                <span>✨ إضافة 4 جلسات كـ مثال للتجربة</span>
              </button>
              <button onclick="openModal('create_attendance_session');" class="btn-secondary-sm">
                <span>➕ فتح جلسة حضور جديدة</span>
              </button>
            </div>
          </div>
        ` : (isMatrix ? renderAttendanceMatrixView(sessions, students, allStudents, records, ent) : renderAttendanceSingleSessionView(sessions, currentSession, students, allStudents, records, ent))}

        <!-- University Print Signatures Footer (يظهر فقط في الطباعة) -->
        <div class="print-only mt-8 pt-4 border-t-2 border-slate-900">
          <div class="grid grid-cols-3 text-center text-xs text-slate-900 font-bold">
            <div>
              <p class="mb-8">ليدر / مسؤول السكشن</p>
              <p class="font-black">${ent.leader?.name || '........................'}</p>
            </div>
            <div>
              <p class="mb-8">أستاذ المادة / المعيد</p>
              <p class="font-black">........................</p>
            </div>
            <div>
              <p class="mb-8">اعتماد شؤون الطلاب</p>
              <p class="font-black">........................</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAttendanceMatrixView(sessions, students, allStudents, records, ent) {
    return `
      <div class="card-box p-0 overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 rounded-2xl">
        <div class="overflow-x-auto max-h-[70vh]">
          <table class="w-full text-right text-xs border-collapse">
            <thead class="bg-slate-100 dark:bg-slate-900 sticky top-0 z-30 shadow-xs border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="p-3 w-12 text-center font-bold">م</th>
                <th class="p-3 col-fixed-1 bg-slate-100 dark:bg-slate-900 w-28 font-bold">الرقم الأكاديمي</th>
                <th class="p-3 col-fixed-2 bg-slate-100 dark:bg-slate-900 min-w-[170px] font-bold">اسم الطالب</th>
                ${sessions.map(sess => `
                  <th class="p-2.5 font-bold text-center border-r border-slate-200 dark:border-slate-700 min-w-[95px]">
                    <div class="truncate font-extrabold" title="${sess.title}">${sess.title}</div>
                    <div class="text-[10px] text-slate-400 font-mono font-normal">${sess.date}</div>
                  </th>
                `).join('')}
                <th class="p-2.5 font-bold text-center w-16 bg-slate-50 dark:bg-slate-850">حضور</th>
                <th class="p-2.5 font-bold text-center w-16 bg-slate-50 dark:bg-slate-850">غياب</th>
                <th class="p-2.5 font-bold text-center w-24">نسبة الالتزام</th>
                <th class="p-2.5 font-bold text-center min-w-[110px]">حالة الإنذار</th>
                <th class="p-2.5 font-bold text-center w-20 no-print">تواصل</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
              ${students.length === 0 ? `
                <tr>
                  <td colspan="${sessions.length + 8}" class="p-8 text-center text-slate-400">
                    لا يوجد طلاب يطابقون البحث أو الفلتر المختار.
                  </td>
                </tr>
              ` : students.map((std, idx) => {
                let presentCount = 0;
                let absentCount = 0;
                let excusedCount = 0;

                sessions.forEach(sess => {
                  const st = records[`${sess.id}_${std.id}`] || 'absent';
                  if (st === 'present') presentCount++;
                  else if (st === 'excused') excusedCount++;
                  else absentCount++;
                });

                const rate = sessions.length > 0 ? Math.round((presentCount / sessions.length) * 100) : 0;
                const isCritical = absentCount >= 3;
                const isWarning = absentCount === 2;

                const alertMsg = encodeURIComponent(
                  `السلام عليكم يا ${std.name}،\nنفيدك بأنه تم رصد (${absentCount}) مرات غياب لك في سكشن (${ent.name}).\nنسبة حضورك الحالية هي (${rate}%).\nيرجى مراجعة الليدر لتقديم عذر طبي مقبول لتفادي إنذار الحرمان.`
                );

                return `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition ${isCritical ? 'bg-rose-50/30 dark:bg-rose-950/20' : (isWarning ? 'bg-amber-50/20 dark:bg-amber-950/10' : '')}">
                    <td class="p-3 text-center text-slate-400 font-mono font-bold">${idx + 1}</td>
                    <td class="p-3 col-fixed-1 font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800">
                      ${std.academicId}
                    </td>
                    <td class="p-3 col-fixed-2 font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800">
                      <div>${std.name}</div>
                      ${std.phone ? `<span class="block text-[10px] text-slate-400 font-mono no-print" dir="ltr">📞 ${std.phone}</span>` : ''}
                    </td>

                    <!-- خانات الجلسات التفاعلية بنقرة واحدة -->
                    ${sessions.map(sess => {
                      const st = records[`${sess.id}_${std.id}`] || 'absent';
                      let badgeClass = 'bg-rose-500 text-white shadow-xs';
                      let label = 'غائب';
                      let icon = '✗';
                      if (st === 'present') {
                        badgeClass = 'bg-emerald-500 text-white shadow-xs';
                        label = 'حاضر';
                        icon = '✓';
                      } else if (st === 'excused') {
                        badgeClass = 'bg-amber-500 text-white shadow-xs';
                        label = 'إذن';
                        icon = '○';
                      }

                      return `
                        <td class="p-2 text-center border-r border-slate-100 dark:border-slate-800">
                          <button 
                            onclick="toggleAttendance('${sess.id}', '${std.id}');" 
                            class="no-print w-full py-1 px-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${badgeClass} hover:opacity-90 hover:scale-105"
                            title="انقر لتبديل الحالة: حاضر ⟷ غائب ⟷ إذن"
                          >
                            <span>${icon}</span>
                            <span>${label}</span>
                          </button>
                          <span class="print-only text-[9pt] font-bold">
                            ${label}
                          </span>
                        </td>
                      `;
                    }).join('')}

                    <!-- عداد الحضور -->
                    <td class="p-2.5 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 bg-slate-50/50 dark:bg-slate-850">
                      ${presentCount}
                    </td>

                    <!-- عداد الغياب -->
                    <td class="p-2.5 text-center font-mono font-black ${absentCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'} bg-slate-50/50 dark:bg-slate-850">
                      ${absentCount}
                    </td>

                    <!-- نسبة الالتزام -->
                    <td class="p-2.5 text-center">
                      <div class="flex items-center gap-1.5 justify-center">
                        <div class="w-12 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden no-print">
                          <div class="h-full rounded-full ${rate >= 80 ? 'bg-emerald-500' : (rate >= 60 ? 'bg-amber-500' : 'bg-rose-500')}" style="width: ${rate}%"></div>
                        </div>
                        <span class="font-mono font-bold text-xs ${rate >= 80 ? 'text-emerald-600' : (rate >= 60 ? 'text-amber-600' : 'text-rose-600')}">
                          ${rate}%
                        </span>
                      </div>
                    </td>

                    <!-- حالة الإنذار -->
                    <td class="p-2 text-center">
                      ${isCritical ? `
                        <span class="inline-block px-2 py-0.5 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-black text-[10px] border border-rose-300">
                          🚨 حرمان (${absentCount})
                        </span>
                      ` : (isWarning ? `
                        <span class="inline-block px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px] border border-amber-300">
                          ⚠️ إنذار (2)
                        </span>
                      ` : `
                        <span class="inline-block px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                          ⭐ منتظم
                        </span>
                      `)}
                    </td>

                    <!-- تواصل واتساب للإنذار -->
                    <td class="p-2 text-center no-print">
                      ${std.phone && absentCount > 0 ? `
                        <a 
                          href="https://wa.me/2${std.phone.replace(/^0/, '')}?text=${alertMsg}" 
                          target="_blank" 
                          class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs shadow transition hover:scale-110" 
                          title="إرسال تنبيه غياب على واتساب"
                        >
                          💬
                        </a>
                      ` : '<span class="text-slate-300 dark:text-slate-600 text-xs">—</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderAttendanceSingleSessionView(sessions, currentSession, students, allStudents, records, ent) {
    if (!currentSession) return '';
    let presentCount = 0;
    let absentCount = 0;
    let excusedCount = 0;

    allStudents.forEach(std => {
      const st = records[`${currentSession.id}_${std.id}`] || 'absent';
      if (st === 'present') presentCount++;
      else if (st === 'excused') excusedCount++;
      else absentCount++;
    });

    const rate = allStudents.length > 0 ? Math.round((presentCount / allStudents.length) * 100) : 0;

    return `
      <div class="space-y-4">
        <!-- Session Selector Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700 no-print">
          ${sessions.map(s => {
            const isActive = s.id === currentSession.id;
            return `
              <button 
                onclick="state.activeAttendanceSessionId='${s.id}'; render();" 
                class="px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap shadow-xs ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md scale-102 ring-2 ring-emerald-400/50' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }"
              >
                <span>⏱</span>
                <span>${s.title}</span>
                <span class="text-[10px] font-mono opacity-80">(${s.date})</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Active Session Card -->
        <div class="card-box space-y-4 border border-slate-200 dark:border-slate-700 shadow-md">
          <div class="card-header border-b pb-3 border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="text-base sm:text-lg font-black text-slate-800 dark:text-white">${currentSession.title}</h4>
                <span class="badge-tag bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs">
                  📅 ${currentSession.date}
                </span>
                <span class="badge-tag bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  حضور: ${presentCount} من ${allStudents.length} (${rate}%)
                </span>
              </div>
            </div>

            <!-- Session Actions: CSV, Print, Delete -->
            <div class="flex items-center gap-2 flex-wrap no-print">
              <button onclick="exportAttendanceCSV('${currentSession.id}');" class="btn-action-sm">
                <span>📥</span>
                <span>تصدير CSV</span>
              </button>
              <button onclick="printAttendanceView();" class="btn-action-sm">
                <span>🖨️</span>
                <span>طباعة الكشف</span>
              </button>
              <button onclick="deleteAttendanceSession('${currentSession.id}');" class="btn-danger-sm">
                🗑️ حذف الجلسة
              </button>
            </div>
          </div>

          <!-- Quick Batch Actions Toolbar -->
          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2 no-print">
            <div class="flex items-center gap-1.5 flex-wrap text-xs">
              <span class="text-slate-400 font-bold text-[11px]">إجراء جماعي سريع:</span>
              <button onclick="markAllAttendance('${currentSession.id}', 'present');" class="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold transition hover:bg-emerald-700 shadow-xs">
                ✓ تحضير الكل حاضر
              </button>
              <button onclick="markAllAttendance('${currentSession.id}', 'absent');" class="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold transition hover:bg-rose-700 shadow-xs">
                ✕ تحديد الكل غائب
              </button>
              <button onclick="resetAttendanceSession('${currentSession.id}');" class="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition">
                ⚪ تصفير
              </button>
            </div>

            <div class="text-xs font-bold text-slate-500 font-mono">
              🟢 حاضر: ${presentCount} | 🔴 غائب: ${absentCount} | 🟡 إذن: ${excusedCount}
            </div>
          </div>

          <!-- Students Single Session Table -->
          <div class="overflow-x-auto max-h-[60vh] border border-slate-200 dark:border-slate-700 rounded-xl">
            <table class="w-full text-right text-xs border-collapse">
              <thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
                <tr>
                  <th class="p-3 font-bold w-12 text-center">م</th>
                  <th class="p-3 font-bold w-32">الرقم الأكاديمي</th>
                  <th class="p-3 font-bold min-w-[180px]">اسم الطالب</th>
                  <th class="p-3 font-bold text-center min-w-[220px]">حالة الحضور</th>
                  <th class="p-3 font-bold text-center w-28 no-print">تواصل واتساب</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                ${students.length === 0 ? `
                  <tr>
                    <td colspan="5" class="p-8 text-center text-slate-400">لا يوجد طلاب يطابقون البحث.</td>
                  </tr>
                ` : students.map((std, idx) => {
                  const status = records[`${currentSession.id}_${std.id}`] || 'absent';
                  const isPresent = status === 'present';
                  const isAbsent = status === 'absent';
                  const isExcused = status === 'excused';

                  const alertMsg = encodeURIComponent(
                    `السلام عليكم يا ${std.name}،\nنحيطكم علماً بأنه تم تسجيل غيابك في (${currentSession.title} - ${currentSession.date}) لـ ${ent.name}.\nيرجى مراجعة الليدر لتقديم عذر رسمي.`
                  );

                  return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition ${isAbsent ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''}">
                      <td class="p-3 text-center text-slate-400 font-mono font-bold">${idx + 1}</td>
                      <td class="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">${std.academicId}</td>
                      <td class="p-3 font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        ${std.name}
                        ${std.phone ? `<span class="block text-[10px] text-slate-400 font-mono" dir="ltr">📞 ${std.phone}</span>` : ''}
                      </td>

                      <!-- الأزرار الثلاثية السريعة للتحضير -->
                      <td class="p-2.5 text-center">
                        <div class="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-900 shadow-2xs no-print">
                          <button 
                            onclick="markAttendance('${currentSession.id}', '${std.id}', 'present');" 
                            class="px-4 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 ${
                              isPresent ? 'bg-emerald-500 text-white shadow-sm scale-102' : 'text-slate-500 hover:text-emerald-600'
                            }"
                          >
                            <span>✓</span>
                            <span>حاضر</span>
                          </button>
                          <button 
                            onclick="markAttendance('${currentSession.id}', '${std.id}', 'absent');" 
                            class="px-4 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 ${
                              isAbsent ? 'bg-rose-500 text-white shadow-sm scale-102' : 'text-slate-500 hover:text-rose-600'
                            }"
                          >
                            <span>✕</span>
                            <span>غائب</span>
                          </button>
                          <button 
                            onclick="markAttendance('${currentSession.id}', '${std.id}', 'excused');" 
                            class="px-4 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 ${
                              isExcused ? 'bg-amber-500 text-white shadow-sm scale-102' : 'text-slate-500 hover:text-amber-600'
                            }"
                          >
                            <span>○</span>
                            <span>إذن</span>
                          </button>
                        </div>

                        <!-- في وضع الطباعة -->
                        <span class="print-only font-bold text-[9pt] ${isPresent ? 'text-emerald-600' : (isAbsent ? 'text-rose-600' : 'text-amber-600')}">
                          ${isPresent ? 'حاضر ✓' : (isAbsent ? 'غائب ✗' : 'إذن بعذر ○')}
                        </span>
                      </td>

                      <!-- زر تواصل واتساب للغائبين -->
                      <td class="p-2.5 text-center whitespace-nowrap no-print">
                        ${std.phone && isAbsent ? `
                          <a 
                            href="https://wa.me/2${std.phone.replace(/^0/, '')}?text=${alertMsg}" 
                            target="_blank" 
                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-700 transition" 
                            title="إرسال تنبيه غياب على واتساب"
                          >
                            <span>💬</span>
                            <span>تنبيه واتس</span>
                          </a>
                        ` : '<span class="text-slate-300 dark:text-slate-600 text-xs">—</span>'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // 5. STUDENTS DIRECTORY
  // -------------------------------------------------------------
  function renderStudentsDirectoryView() {
    const ent = state.currentEntity;
    const { allStudents, students } = getFilteredStudents(ent.id);

    return `
      <div class="space-y-4">
        <!-- University Print Header (يظهر فقط في الطباعة) -->
        <div class="print-only mb-6 border-b-2 border-slate-900 pb-4">
          <div class="flex justify-between items-center text-xs text-slate-800">
            <div class="text-right">
              <p class="font-black text-sm">جامعة برج العرب التكنولوجية</p>
              <p class="font-bold">كلية تكنولوجيا الصناعة والطاقة</p>
              <p class="text-slate-600">شؤون التعليم والطلاب</p>
            </div>
            <div class="text-center">
              <div class="inline-block border-2 border-slate-900 px-4 py-1.5 rounded-lg">
                <h2 class="text-base font-black text-slate-900">دليل وبيانات طلاب السكشن</h2>
                <p class="text-xs font-bold text-slate-700">${ent.name} (${ent.code || ''})</p>
              </div>
            </div>
            <div class="text-left text-xs font-mono">
              <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-EG')}</p>
              <p><strong>المسؤول:</strong> ${ent.leader?.name || 'غير محدد'}</p>
              <p><strong>إجمالي الطلاب:</strong> ${allStudents.length} طالب</p>
            </div>
          </div>
        </div>

        <!-- Directory Header & Search -->
        <div class="card-box flex flex-wrap justify-between items-center gap-3 no-print">
          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="openModal('add_student');" class="btn-primary-sm">
              <span>➕</span>
              <span>إضافة طالب</span>
            </button>
            <button onclick="openModal('bulk_paste_students');" class="btn-secondary-sm">
              <span>📋</span>
              <span>لصق كشف كامل</span>
            </button>
            <button onclick="exportStudentsCSV();" class="btn-action-sm">
              <span>📥</span>
              <span>تصدير CSV</span>
            </button>
            <button onclick="printStudentsDirectory();" class="btn-action-sm">
              <span>🖨️</span>
              <span>طباعة</span>
            </button>
            <button onclick="openModal('quick_whatsapp');" class="btn-action-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 font-bold">
              <span>💬</span>
              <span>جروب واتساب سريع</span>
            </button>
          </div>

          <!-- Live Student Search Bar -->
          ${renderSearchBar('بحث في دليل الطلاب بالاسم أو الرقم أو الهاتف...')}

          <div class="text-xs text-slate-400 font-bold whitespace-nowrap">
            ${state.searchQuery ? `
              المطابق للبحث: <span class="text-emerald-500 font-black">${students.length}</span> من أصل ${allStudents.length}
            ` : `
              عدد الطلاب: <span class="text-emerald-500 font-black">${allStudents.length}</span>
            `}
          </div>
        </div>

        <div class="card-box p-0 overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 rounded-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-right text-xs">
              <thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="p-3 w-12 text-center font-bold">م</th>
                  <th class="p-3 font-bold w-32">الرقم الأكاديمي</th>
                  <th class="p-3 font-bold min-w-[180px]">اسم الطالب</th>
                  <th class="p-3 font-bold min-w-[160px]">رقم الهاتف</th>
                  <th class="p-3 font-bold text-center min-w-[120px]">سجل النوتة والمشكلة</th>
                  <th class="p-3 font-bold text-center w-28 no-print">إجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                ${students.length === 0 ? `
                  <tr>
                    <td colspan="6" class="p-8 text-center text-slate-400">
                      ${state.searchQuery ? `
                        <div class="space-y-2">
                          <p class="text-amber-500 font-bold text-sm">🔍 لم يتم العثور على أي طالب يطابق "${state.searchQuery}"</p>
                          <button onclick="handleSearch('');" class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold">إلغاء البحث وعرض جميع الطلاب</button>
                        </div>
                      ` : `
                        <div class="space-y-3 py-6">
                          <span class="text-4xl block">👥</span>
                          <p class="font-bold text-slate-600 dark:text-slate-300">لا يوجد طلاب مسجلون في هذا السكشن بعد.</p>
                          <div class="flex items-center justify-center gap-2 flex-wrap">
                            <button onclick="openModal('add_student');" class="btn-primary-sm">
                              <span>➕</span>
                              <span>إضافة طالب يدوي</span>
                            </button>
                            <button onclick="openModal('bulk_paste_students');" class="btn-secondary-sm">
                              <span>📋</span>
                              <span>لصق كشف كامل</span>
                            </button>
                          </div>
                        </div>
                      `}
                    </td>
                  </tr>
                ` : students.map((std, idx) => {
                  return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition ${(std.problemStatus === 'pending' || std.hasProblem) ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''}">
                      <td class="p-3 text-center text-slate-400 font-mono">${idx + 1}</td>
                      <td class="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">${std.academicId}</td>
                      <td class="p-3 font-bold text-slate-800 dark:text-slate-100">${std.name}</td>
                      <td class="p-3 font-mono" dir="ltr">
                        ${std.phone ? `
                          <div class="flex items-center gap-2">
                            <span class="font-bold text-slate-800 dark:text-slate-200">${std.phone}</span>
                            <div class="flex items-center gap-1.5 no-print">
                              <a href="https://wa.me/2${std.phone.replace(/^0/, '')}" target="_blank" class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow hover:scale-110 transition" title="واتساب">💬</a>
                              <a href="tel:${std.phone}" class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shadow hover:scale-110 transition" title="اتصال">📞</a>
                            </div>
                          </div>
                        ` : '<span class="text-slate-400 text-xs italic">بدون هاتف</span>'}
                      </td>
                      <td class="p-3 text-center">
                        <div class="no-print">
                          ${(std.problemStatus === 'pending' || std.hasProblem) ? `
                            <button onclick="openModal('edit_problem', '${std.id}');" class="px-2.5 py-1 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-300 dark:border-rose-800 flex items-center gap-1 mx-auto hover:scale-105 transition" title="${std.problemDetails || 'عنده مشكلة'}">
                              <span>⚠️ عنده مشكلة</span>
                            </button>
                          ` : std.problemStatus === 'resolved' ? `
                            <button onclick="openModal('edit_problem', '${std.id}');" class="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-300 dark:border-amber-800 flex items-center gap-1 mx-auto hover:scale-105 transition">
                              <span>✅ تم الحل</span>
                            </button>
                          ` : `
                            <button onclick="openModal('edit_problem', '${std.id}');" class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-rose-600 font-medium text-xs border border-slate-200 dark:border-slate-600 flex items-center gap-1 mx-auto hover:scale-105 transition">
                              <span>📓 نوتة</span>
                            </button>
                          `}
                        </div>
                        <span class="print-only text-[9pt] font-bold">
                          ${(std.problemStatus === 'pending' || std.hasProblem) ? `⚠️ ${std.problemType || 'مشكلة'}` : (std.problemStatus === 'resolved' ? '✅ تم الحل' : '—')}
                        </span>
                      </td>
                      <td class="p-3 text-center no-print">
                        <div class="flex items-center justify-center gap-2">
                          <button onclick="openModal('edit_student', '${std.id}');" class="btn-action-sm">
                            ✏️ تعديل
                          </button>
                          <button onclick="deleteStudent('${std.id}');" class="btn-danger-sm">
                            🗑️ حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- University Print Signatures Footer (يظهر فقط في الطباعة) -->
        <div class="print-only mt-8 pt-4 border-t-2 border-slate-900">
          <div class="grid grid-cols-3 text-center text-xs text-slate-900 font-bold">
            <div>
              <p class="mb-8">ليدر / مسؤول السكشن</p>
              <p class="font-black">${ent.leader?.name || '........................'}</p>
            </div>
            <div>
              <p class="mb-8">المسؤول المشارك</p>
              <p class="font-black">${(ent.coOfficials && ent.coOfficials[0]?.name) || '........................'}</p>
            </div>
            <div>
              <p class="mb-8">اعتماد شؤون الطلاب</p>
              <p class="font-black">........................</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // 6. NOTEBOOK & STUDENT PROBLEMS VIEW (دفتر النوتة وسجل المشكلات والطباعة)
  // -------------------------------------------------------------
  function renderNotebookView() {
    const ent = state.currentEntity;
    const { allStudents, students } = getFilteredStudents(ent.id);
    const stats = getEntityStats(ent.id);

    const problemTypesList = [
      'تأخير تسليم شيت / تكليف',
      'غياب متكرر / إنذار غياب',
      'عذر طبي / إجازة رسمية',
      'مشكلة تسجيل / كود الطالب',
      'إعادة كويز / مشكلة درجات',
      'ملاحظة التزام وسلوك',
      'أخرى / ملاحظة خاصة'
    ];

    return `
      <div class="space-y-4" id="notebook-print-area">
        <!-- Official University Print Header (يظهر فقط عند أمر الطباعة) -->
        <div class="print-only mb-6 border-b-2 border-slate-900 pb-4">
          <div class="flex justify-between items-center text-xs text-slate-800">
            <div class="text-right space-y-0.5">
              <p class="font-bold">جمهورية مصر العربية</p>
              <p class="font-bold">وزارة التعليم العالي والبحث العلمي</p>
              <p class="font-black text-sm text-slate-950">جامعة برج العرب التكنولوجية</p>
              <p class="font-bold">كلية تكنولوجيا الصناعة والطاقة</p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 mx-auto mb-1 border-2 border-slate-900 rounded-2xl flex items-center justify-center font-black text-sm">
                BATU
              </div>
              <span class="text-[10px] font-black block">برنامج تكنولوجيا المعلومات (IT)</span>
            </div>
            <div class="text-left font-mono text-[10px] space-y-0.5" dir="ltr">
              <p class="font-bold">BATU-ITMS-NOTEBOOK</p>
              <p>Date: ${new Date().toLocaleDateString('ar-EG')}</p>
              <p>Time: ${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div class="mt-4 text-center border-t border-slate-300 pt-3">
            <h2 class="text-base font-black text-slate-950 underline underline-offset-4">
              دفتر النوتة وسجل متابعة مشكلات وملاحظات الطلاب
            </h2>
            <div class="flex justify-center items-center gap-6 mt-1.5 text-xs text-slate-800 font-bold">
              <span>الكيان: <strong>${ent.name}</strong> (${ent.type === 'section' ? 'سكشن أكاديمي' : 'مجموعة طلابية'})</span>
              <span>المسؤول الأول: <strong>${ent.leader?.name || '---'}</strong></span>
              ${(ent.coOfficials && ent.coOfficials.length > 0) ? `<span>المشرف المشارك: <strong>${ent.coOfficials.map(c => c.name).join('، ')}</strong></span>` : ''}
            </div>
          </div>
        </div>

        <!-- Controls Toolbar (مخفي أثناء الطباعة) -->
        <div class="card-box space-y-3.5 no-print">
          <div class="flex flex-wrap justify-between items-center gap-3">
            <div class="flex items-center gap-2.5">
              <span class="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl font-bold shadow-xs">
                📓
              </span>
              <div>
                <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <span>دفتر النوتة وسجل مشكلات الطلاب</span>
                  ${stats.pendingProblemsCount > 0 ? `
                    <span class="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      ${stats.pendingProblemsCount} عندهم مشكلة
                    </span>
                  ` : `
                    <span class="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      كل الطلاب تمام 👍
                    </span>
                  `}
                </h3>
                <p class="text-xs text-slate-400">سجل ملاحظاتك ومشاكل كل طالب واطبع الكشف الرسمي في أي وقت</p>
              </div>
            </div>

            <!-- Print & Quick Actions -->
            <div class="flex items-center gap-2 flex-wrap">
              <button onclick="printNotebook();" class="btn-primary-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-800 hover:from-emerald-700 hover:to-slate-900 text-white font-black px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition hover:scale-102">
                <span class="text-sm">🖨️</span>
                <span>طباعة النوتة والكشف الكامل</span>
              </button>
              <button onclick="openModal('add_student');" class="btn-secondary-sm">
                <span>➕</span>
                <span>إضافة طالب</span>
              </button>
            </div>
          </div>

          <!-- Status Filters & Search Bar -->
          <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3">
            <div class="flex items-center gap-1.5 flex-wrap">
              <button onclick="state.notebookFilter='all'; render();" class="px-3 py-1 rounded-xl text-xs font-bold transition ${state.notebookFilter === 'all' ? 'bg-slate-800 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}">
                الكل (${allStudents.length})
              </button>
              <button onclick="state.notebookFilter='problems_only'; render();" class="px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${state.notebookFilter === 'problems_only' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100'}">
                <span>⚠️ عندهم مشكلة</span>
                <span class="font-mono">(${stats.pendingProblemsCount})</span>
              </button>
              <button onclick="state.notebookFilter='resolved'; render();" class="px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${state.notebookFilter === 'resolved' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100'}">
                <span>✅ تم الحل</span>
                <span class="font-mono">(${stats.resolvedProblemsCount})</span>
              </button>
              <button onclick="state.notebookFilter='clean'; render();" class="px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${state.notebookFilter === 'clean' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'}">
                <span>🟢 بدون مشكلات</span>
                <span class="font-mono">(${stats.cleanCount})</span>
              </button>
            </div>

            <!-- Type Filter & Live Search Bar -->
            <div class="flex items-center gap-2 flex-1 max-w-lg justify-end flex-wrap sm:flex-nowrap">
              <select onchange="state.notebookTypeFilter=this.value; render();" class="input-box text-xs py-1.5 px-2 font-bold max-w-[170px]">
                <option value="all" ${state.notebookTypeFilter === 'all' ? 'selected' : ''}>كل أنواع المشكلات</option>
                ${problemTypesList.map(t => `
                  <option value="${t}" ${state.notebookTypeFilter === t ? 'selected' : ''}>${t}</option>
                `).join('')}
              </select>
              ${renderSearchBar('بحث في النوتة بالاسم أو المشكلة أو الملاحظة...')}
            </div>
          </div>
        </div>

        <!-- Notebook Table -->
        <div class="card-box p-0 overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 rounded-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-right text-xs border-collapse">
              <thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="p-3 w-10 text-center font-bold">م</th>
                  <th class="p-3 font-bold w-28">الرقم الأكاديمي</th>
                  <th class="p-3 font-bold w-44">اسم الطالب</th>
                  <th class="p-3 font-bold w-36">حالة المشكلة</th>
                  <th class="p-3 font-bold w-44">نوع المشكلة</th>
                  <th class="p-3 font-bold">ملاحظات النوتة وتفاصيل المشكلة</th>
                  <th class="p-3 font-bold w-40">الإجراء المتخذ / المتابعة</th>
                  <th class="p-3 font-bold text-center w-28 no-print">إجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                ${students.length === 0 ? `
                  <tr>
                    <td colspan="8" class="p-8 text-center text-slate-400">
                      <div class="space-y-1">
                        <span class="text-3xl block">🔍</span>
                        <p class="font-bold text-slate-600 dark:text-slate-300">لا يوجد طلاب يطابقون خيارات العرض المحددة.</p>
                        ${(state.notebookFilter !== 'all' || state.searchQuery || state.notebookTypeFilter !== 'all') ? `
                          <button onclick="state.notebookFilter='all'; state.notebookTypeFilter='all'; handleSearch('');" class="text-xs text-emerald-600 font-bold hover:underline">عرض جميع الطلاب</button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                ` : students.map((std, idx) => {
                  const isPending = std.problemStatus === 'pending' || std.hasProblem === true;
                  const isResolved = std.problemStatus === 'resolved';

                  return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition ${isPending ? 'bg-rose-50/30 dark:bg-rose-950/20' : isResolved ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''}">
                      <!-- م -->
                      <td class="p-3 text-center text-slate-400 font-mono font-bold">${idx + 1}</td>

                      <!-- الرقم الأكاديمي -->
                      <td class="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">${std.academicId}</td>

                      <!-- اسم الطالب -->
                      <td class="p-3 font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        ${std.name}
                        ${std.phone ? `<span class="block text-[10px] text-slate-400 font-mono no-print" dir="ltr">📞 ${std.phone}</span>` : ''}
                      </td>

                      <!-- حالة المشكلة -->
                      <td class="p-2.5">
                        <select onchange="updateStudentProblemStatus('${std.id}', this.value);" class="no-print w-full text-xs font-bold py-1 px-2 rounded-lg border transition ${
                          isPending
                            ? 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : isResolved
                            ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                        }">
                          <option value="none" ${!isPending && !isResolved ? 'selected' : ''}>🟢 لا توجد مشكلة</option>
                          <option value="pending" ${isPending ? 'selected' : ''}>🔴 عنده مشكلة</option>
                          <option value="resolved" ${isResolved ? 'selected' : ''}>🟡 تم الحل</option>
                        </select>
                        <span class="print-only font-bold text-[9pt]">
                          ${isPending ? '⚠️ عنده مشكلة' : isResolved ? '✅ تم الحل' : '—'}
                        </span>
                      </td>

                      <!-- نوع المشكلة -->
                      <td class="p-2.5">
                        <select onchange="updateStudentProblemType('${std.id}', this.value);" class="no-print w-full text-xs font-medium py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                          <option value="">-- حدد النوع --</option>
                          ${problemTypesList.map(t => `
                            <option value="${t}" ${std.problemType === t ? 'selected' : ''}>${t}</option>
                          `).join('')}
                        </select>
                        <span class="print-only text-[9pt]">
                          ${std.problemType || '—'}
                        </span>
                      </td>

                      <!-- ملاحظات النوتة وتفاصيل المشكلة -->
                      <td class="p-2.5">
                        <div class="relative no-print">
                          <input 
                            type="text" 
                            value="${std.problemDetails || ''}" 
                            placeholder="اكتب ملاحظة النوتة أو مشكلة الطالب..." 
                            onchange="updateStudentProblemNote('${std.id}', this.value);" 
                            class="input-box text-xs w-full py-1.5 px-2.5 font-medium ${isPending ? 'border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20' : ''}"
                          />
                        </div>
                        <div class="print-only text-[9pt]">
                          ${std.problemDetails ? `<span>${std.problemDetails}</span>` : '<span class="text-slate-400">—</span>'}
                          ${std.problemDate ? `<span class="block text-[8pt] text-slate-500">تاريخ: ${std.problemDate}</span>` : ''}
                        </div>
                      </td>

                      <!-- الإجراء المتخذ / المتابعة -->
                      <td class="p-2.5">
                        <input 
                          type="text" 
                          value="${std.actionTaken || ''}" 
                          placeholder="الإجراء المتخذ..." 
                          onchange="updateStudentActionTaken('${std.id}', this.value);" 
                          class="no-print input-box text-xs w-full py-1 px-2 font-medium"
                        />
                        <span class="print-only text-[9pt]">
                          ${std.actionTaken || '—'}
                        </span>
                      </td>

                      <!-- إجراءات (شاشة فقط) -->
                      <td class="p-2.5 text-center whitespace-nowrap no-print">
                        <div class="flex items-center justify-center gap-1.5">
                          <button onclick="openModal('edit_problem', '${std.id}');" class="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs transition" title="فتح نافذة التفاصيل والملاحظات">
                            📝
                          </button>
                          ${std.phone ? `
                            <a href="https://wa.me/2${std.phone.replace(/^0/, '')}" target="_blank" class="p-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs transition" title="مراسلة واتساب">
                              💬
                            </a>
                          ` : ''}
                          ${(std.problemStatus !== 'none' || std.problemDetails || std.problemType) ? `
                            <button onclick="clearStudentProblem('${std.id}');" class="p-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs transition" title="تفريغ المشكلة">
                              ✕
                            </button>
                          ` : ''}
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Official Print Signatures Footer -->
        <div class="print-only mt-10 pt-4 border-t-2 border-slate-900">
          <div class="grid grid-cols-3 text-center text-xs text-slate-900">
            <div>
              <p class="font-bold">مسؤول السكشن / المجموعة</p>
              <p class="mt-1 font-medium">${ent.leader?.name || '---'}</p>
              <p class="mt-8">التوقيع: ............................</p>
            </div>
            <div>
              <p class="font-bold">المشرف المشارك</p>
              <p class="mt-1 font-medium">${(ent.coOfficials && ent.coOfficials[0]?.name) || '---'}</p>
              <p class="mt-8">التوقيع: ............................</p>
            </div>
            <div>
              <p class="font-bold">أستاذ / معيد المادة</p>
              <p class="mt-1 font-medium">كلية تكنولوجيا الصناعة والطاقة</p>
              <p class="mt-8">التوقيع والاعتماد: ............................</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // 7. DASHBOARD & CHARTS
  // -------------------------------------------------------------
  function renderDashboardView() {
    const ent = state.currentEntity;
    const stats = getEntityStats(ent.id);
    const tasks = (DB.tasks || []).filter(t => t.entityId === ent.id);

    return `
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card-box text-center p-6 space-y-2">
            <span class="text-3xl">👥</span>
            <span class="text-xs text-slate-400 block font-bold">إجمالي الطلاب المسجلين</span>
            <span class="text-3xl font-black text-slate-800 dark:text-white">${stats.totalStudents}</span>
          </div>

          <div class="card-box text-center p-6 space-y-2">
            <span class="text-3xl">📊</span>
            <span class="text-xs text-slate-400 block font-bold">نسبة إنجاز الشيتات</span>
            <span class="text-3xl font-black text-emerald-600 dark:text-emerald-400">${stats.donePercent}%</span>
            <span class="text-[11px] text-slate-400 block">${stats.doneCount} طالب أنجزوا المطلوب</span>
          </div>

          <div class="card-box text-center p-6 space-y-2">
            <span class="text-3xl">📋</span>
            <span class="text-xs text-slate-400 block font-bold">عدد التاسكات والمهام</span>
            <span class="text-3xl font-black text-indigo-600 dark:text-indigo-400">${tasks.length}</span>
          </div>
        </div>

        <div class="card-box space-y-3">
          <h4 class="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>📈</span>
            <span>معدل إنجاز الشيتات والتكليفات</span>
          </h4>
          <div class="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500" style="width: ${stats.donePercent}%"></div>
          </div>
          <div class="flex justify-between text-xs font-bold text-slate-400">
            <span>0%</span>
            <span>${stats.donePercent}% مكتمل</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // MODALS
  // -------------------------------------------------------------
  function renderModals() {
    if (!state.modal) return '';

    // Modal: Register Entity (تسجيل سكشن أو مجموعة جديدة)
    if (state.modal === 'register_entity') {
      return `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="modal-box space-y-4 max-w-lg text-right">
            <div class="card-header">
              <h3 class="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>➕</span>
                <span>تسجيل سكشن أو مجموعة جديدة</span>
              </h3>
              <button onclick="closeModal();" class="btn-cancel text-sm font-bold">✕</button>
            </div>

            <form onsubmit="event.preventDefault(); handleFirstEntitySubmit(this);" class="space-y-4 text-right">
              <!-- نوع الإدارة: سكشن أو مجموعة -->
              <div>
                <label class="form-label">النوع: *</label>
                <div class="grid grid-cols-2 gap-3 mt-1">
                  <label class="cursor-pointer">
                    <input type="radio" name="entityType" value="section" checked onchange="toggleRegFormType(this.value);" class="peer sr-only" />
                    <div class="p-2.5 text-center rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 font-bold text-xs transition">
                      🏢 سكشن
                    </div>
                  </label>

                  <label class="cursor-pointer">
                    <input type="radio" name="entityType" value="group" onchange="toggleRegFormType(this.value);" class="peer sr-only" />
                    <div class="p-2.5 text-center rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 font-bold text-xs transition">
                      👥 مجموعة
                    </div>
                  </label>
                </div>
              </div>

              <!-- حقول سكشن كام ومجموعة كام -->
              <div class="form-grid-2" id="secGroupFields">
                <div id="sectionNumContainer">
                  <label class="form-label">سكشن كام؟ *</label>
                  <input type="text" name="sectionNumber" required placeholder="مثال: 2" class="input-box text-right font-bold text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <label class="form-label">مجموعة كام؟ *</label>
                  <input type="text" name="groupNumber" required placeholder="مثال: 1" class="input-box text-right font-bold text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>

              <!-- بيانات المسؤول الأول (الليدر) -->
              <div class="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-3">
                <h4 class="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>👤</span>
                  <span>المسؤول الرئيسي (الليدر):</span>
                </h4>
                <div class="form-grid-2">
                  <div>
                    <label class="form-label">اسم المسؤول *</label>
                    <input type="text" name="leaderName" required placeholder="مثال: إسلام علي" class="input-box" />
                  </div>
                  <div>
                    <label class="form-label">رقم الهاتف</label>
                    <input type="tel" name="leaderPhone" placeholder="01xxxxxxxxx" class="input-box font-mono" />
                  </div>
                </div>
              </div>

              <!-- مين مسؤول معاه -->
              <div class="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-3">
                <h4 class="text-xs font-black text-amber-500 flex items-center gap-1.5">
                  <span>🤝</span>
                  <span>مين مسؤول معاه؟ (المسؤول المشارك / النائب):</span>
                </h4>
                <div class="form-grid-2">
                  <div>
                    <label class="form-label">اسم المسؤول المشارك</label>
                    <input type="text" name="coName" placeholder="مثال: كريم هاني" class="input-box" />
                  </div>
                  <div>
                    <label class="form-label">صفته / دوره</label>
                    <input type="text" name="coRole" value="نائب ليدر" class="input-box" />
                  </div>
                </div>
                <div>
                  <label class="form-label">رقم هاتف المسؤول المشارك</label>
                  <input type="tel" name="coPhone" placeholder="01xxxxxxxxx" class="input-box font-mono" />
                </div>
              </div>

              <div class="card-footer">
                <button type="button" onclick="closeModal();" class="btn-cancel">إلغاء</button>
                <button type="submit" class="btn-primary">حفظ وتسجيل الكيان</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // Modal: Add Co-Official (إضافة مسؤول مشارك إضافي)
    if (state.modal === 'add_co_official') {
      return `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="modal-box space-y-4 text-right">
            <div class="card-header">
              <h3 class="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>🤝</span>
                <span>إضافة مسؤول مشارك معاه في (${state.currentEntity.name})</span>
              </h3>
              <button onclick="closeModal();" class="btn-cancel text-sm font-bold">✕</button>
            </div>

            <form onsubmit="event.preventDefault(); addCoOfficial('${state.currentEntity.id}', this.coName.value, this.coRole.value, this.coPhone.value);" class="space-y-4 text-right">
              <div>
                <label class="form-label">اسم المسؤول المشارك *</label>
                <input type="text" name="coName" required placeholder="مثال: يوسف محمود" class="input-box" />
              </div>

              <div class="form-grid-2">
                <div>
                  <label class="form-label">الصفة / الدور *</label>
                  <input type="text" name="coRole" required value="${state.currentEntity.type === 'section' ? 'نائب ليدر السكشن' : 'نائب ليدر المجموعة'}" class="input-box" />
                </div>
                <div>
                  <label class="form-label">رقم الهاتف</label>
                  <input type="tel" name="coPhone" placeholder="01xxxxxxxxx" class="input-box font-mono" />
                </div>
              </div>

              <div class="card-footer">
                <button type="button" onclick="closeModal();" class="btn-cancel">إلغاء</button>
                <button type="submit" class="btn-primary">تعيين كمسؤول مشارك</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // Modal: Add Student
    if (state.modal === 'add_student') {
      return `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="modal-box space-y-4">
            <div class="card-header">
              <h3 class="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>➕</span>
                <span>إضافة طالب إلى ${state.currentEntity.name}</span>
              </h3>
              <button onclick="closeModal();" class="btn-cancel text-sm font-bold">✕</button>
            </div>

            <form onsubmit="event.preventDefault(); addStudentToSection(this.name.value, this.academicId.value, this.phone.value);" class="space-y-4 text-right">
              <div>
                <label class="form-label">اسم الطالب الكامل *</label>
                <input type="text" name="name" required placeholder="مثال: أحمد عبد الله حسن" class="input-box" />
              </div>

              <div class="form-grid-2">
                <div>
                  <label class="form-label">الرقم الأكاديمي 🆔 *</label>
                  <input type="text" name="academicId" required placeholder="مثال: 20240101" class="input-box font-mono" />
                </div>
                <div>
                  <label class="form-label">رقم الهاتف / واتساب</label>
                  <input type="tel" name="phone" placeholder="01xxxxxxxxx" class="input-box font-mono" />
                </div>
              </div>

              <div class="card-footer">
                <button type="button" onclick="closeModal();" class="btn-cancel">إلغاء</button>
                <button type="submit" class="btn-primary">إضافة الطالب</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // Modal: Edit Student
    if (state.modal === 'edit_student') {
      const std = DB.students.find(s => s.id === state.modalData);
      if (!std) return '';

      return `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="modal-box space-y-4">
            <div class="card-header">
              <h3 class="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>✏️</span>
                <span>تعديل بيانات الطالب</span>
              </h3>
              <button onclick="closeModal();" class="btn-cancel text-sm font-bold">✕</button>
            </div>

            <form onsubmit="event.preventDefault(); updateStudent('${std.id}', this.name.value, this.academicId.value, this.phone.value);" class="space-y-4 text-right">
              <div>
                <label class="form-label">اسم الطالب *</label>
                <input type="text" name="name" value="${std.name}" required class="input-box" />
              </div>

              <div class="form-grid-2">
                <div>
                  <label class="form-label">الرقم الأكاديمي 🆔 *</label>
                  <input type="text" name="academicId" value="${std.academicId}" required class="input-box font-mono" />
                </div>
                <div>
                  <label class="form-label">رقم الهاتف</label>
                  <input type="tel" name="phone" value="${std.phone || ''}" class="input-box font-mono" />
                </div>
              </div>

              <div class="card-footer">
                <button type="button" onclick="closeModal();" class="btn-cancel">إلغاء</button>
                <button type="submit" class="btn-primary">حفظ التعديلات</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // Modal: Bulk Paste Students
    if (state.modal === 'bulk_paste_students') {
      return `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="modal-box space-y-4 max-w-xl">
            <div class="card-header">
              <h3 class="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>📋</span>
                <span>لصق كشف طلاب دفعة واحدة</span>
              </h3>
              <button onclick="closeModal();" class="btn-cancel text-sm font-bold">✕</button>
            </div>

            <form onsubmit="event.preventDefault(); processBulkPasteStudents(this.rawText.value);" class="space-y-4 text-right">
              <div>
                <label class="form-label">الصق بيانات الطلاب (الرقم الأكاديمي ثم الاسم أو العكس)</label>
                <textarea name="rawText" rows="8" required placeholder="مثال:&#10;20240101    محمد علي حسن&#10;20240102    سارة أحمد محمود&#10;20240103    يوسف خالد" class="input-box font-mono text-xs"></textarea>
                <p class="text-[11px] text-slate-400 mt-1">يدعم النسخ المباشر من Excel أو Word أو ملفات Text مفصولاً بمسافة أو Tab.</p>
              </div>

              <div class="card-footer">
                <button type="button" onclick="closeModal();" class="btn-cancel">إلغاء</button>
                <button type="submit" class="btn-primary">استيراد الطلاب</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // Modal: Add Custom Column
    if (state.modal === 'add_column') {
      return `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="modal-box space-y-4">
            <div class="card-header">
              <h3 class="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>📊</span>
                <span>إضافة عمود مخصص للشيت</span>
              </h3>
              <button onclick="closeModal();" class="btn-cancel text-sm font-bold">✕</button>
            </div>

            <form onsubmit="event.preventDefault(); addCustomColumn(this.title.value, this.type.value, this.defaultValue.value);" class="space-y-4 text-right">
              <div>
                <label class="form-label">عنوان العمود *</label>
                <input type="text" name="title" required placeholder="مثال: شيت المعمل 2 أو تسليم البحث" class="input-box" />
              </div>

              <div class="form-grid-2">
                <div>
                  <label class="form-label">نوع العمود</label>
                  <select name="type" class="input-box">
                    <option value="status">حالة (تمام / مش تمام / لسه)</option>
                    <option value="payment">دفع رسوم / فلوس</option>
                    <option value="text">نص حر / ملاحظة</option>
                  </select>
                </div>
                <div>
                  <label class="form-label">قيمة افتراضية لجميع الطلاب</label>
                  <input type="text" name="defaultValue" placeholder="اختياري" class="input-box" />
                </div>
              </div>

              <div class="card-footer">
                <button type="button" onclick="closeModal();" class="btn-cancel">إلغاء</button>
                <button type="submit" class="btn-primary">إضافة العمود</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // Modal: Add Task (إضافة تاسك جديد)
    if (state.modal === 'add_task' || state.modal === 'add_assignment') {
      return `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="modal-box space-y-4 max-w-lg text-right">
            <div class="card-header border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 class="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>➕</span>
                <span>إضافة تاسك جديد</span>
              </h3>
              <button onclick="closeModal();" class="btn-cancel text-sm font-bold">✕</button>
            </div>

            <form onsubmit="
              event.preventDefault();
              const f = this;
              createTask({
                title: f.title.value,
                type: f.taskType.value,
                requiredAmount: f.requiredAmount ? f.requiredAmount.value : 0,
                maxScore: f.maxScore ? f.maxScore.value : 10,
                description: f.description.value,
                deadline: f.deadline.value
              });
            " class="space-y-4 text-right">

              <div>
                <label class="form-label font-bold text-xs">عنوان التاسك / المهمة: *</label>
                <input type="text" name="title" required placeholder="مثال: تسليم شيت 1، سداد مصاريف المعمل، استلام البالطو..." class="input-box text-xs w-full mt-1 font-bold" />
              </div>

              <!-- نوع ونظام تتبع التاسك -->
              <div>
                <label class="form-label font-bold text-xs">نوع التاسك ونظام المتابعة: *</label>
                <div class="grid grid-cols-2 gap-2 mt-1.5">
                  <label class="cursor-pointer">
                    <input type="radio" name="taskType" value="checkbox" checked onchange="toggleTaskTypeForm(this.value);" class="peer sr-only" />
                    <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 font-bold text-xs transition space-y-0.5">
                      <div class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <span>✓</span>
                        <span>صح وخطأ (تم / لم يتم)</span>
                      </div>
                      <span class="text-[10px] text-slate-400 font-normal block">تأكيد الإنجاز بنقرة واحدة</span>
                    </div>
                  </label>

                  <label class="cursor-pointer">
                    <input type="radio" name="taskType" value="status_tri" onchange="toggleTaskTypeForm(this.value);" class="peer sr-only" />
                    <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 font-bold text-xs transition space-y-0.5">
                      <div class="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                        <span>🔘</span>
                        <span>تمام / مش تمام / لسه</span>
                      </div>
                      <span class="text-[10px] text-slate-400 font-normal block">متابعة حالة شيتات ومهام</span>
                    </div>
                  </label>

                  <label class="cursor-pointer">
                    <input type="radio" name="taskType" value="delivery" onchange="toggleTaskTypeForm(this.value);" class="peer sr-only" />
                    <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 font-bold text-xs transition space-y-0.5">
                      <div class="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <span>📦</span>
                        <span>استلام وتسليم</span>
                      </div>
                      <span class="text-[10px] text-slate-400 font-normal block">استلم / مستلمش / مش متسجل</span>
                    </div>
                  </label>

                  <label class="cursor-pointer">
                    <input type="radio" name="taskType" value="payment" onchange="toggleTaskTypeForm(this.value);" class="peer sr-only" />
                    <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 font-bold text-xs transition space-y-0.5">
                      <div class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <span>💰</span>
                        <span>سداد مالي وفلوس</span>
                      </div>
                      <span class="text-[10px] text-slate-400 font-normal block">دفع أو لا + المبلغ المدفوع</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- حقل المبلغ المالي المطلوب (يظهر فقط لو التاسك دفع وفلوس) -->
              <div id="paymentAmountField" class="hidden p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                <label class="form-label font-bold text-xs text-emerald-800 dark:text-emerald-300">المبلغ المطلوب من كل طالب بالجنيه:</label>
                <div class="flex items-center gap-2">
                  <input type="number" name="requiredAmount" min="0" value="0" placeholder="مثال: 50" class="input-box text-xs w-full font-mono font-bold" />
                  <span class="text-xs font-bold text-emerald-700 dark:text-emerald-300">جنيه</span>
                </div>
                <span class="text-[10px] text-slate-400 block">اتركه 0 إذا كان المبلغ غير محدد مسبقاً</span>
              </div>

              <!-- حقل الدرجة العظمى (لو درجات) -->
              <div id="gradeMaxField" class="hidden">
                <label class="form-label font-bold text-xs">الدرجة العظمى:</label>
                <input type="number" name="maxScore" value="10" min="1" class="input-box text-xs w-full mt-1 font-mono" />
              </div>

              <div>
                <label class="form-label font-bold text-xs">تفاصيل أو وصف التاسك (اختياري):</label>
                <textarea name="description" rows="2" placeholder="اكتب تفاصيل إضافية عن المطلوب..." class="input-box text-xs w-full mt-1"></textarea>
              </div>

              <div>
                <label class="form-label font-bold text-xs">الموعد النهائي للتسليم (اختياري):</label>
                <input type="date" name="deadline" class="input-box text-xs w-full mt-1 font-mono" />
              </div>

              <div class="card-footer">
                <button type="button" onclick="closeModal();" class="btn-cancel">إلغاء</button>
                <button type="submit" class="btn-primary">💾 إضافة التاسك</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // Modal: Create Attendance Session
    if (state.modal === 'create_attendance_session') {
      const today = new Date().toISOString().slice(0, 10);
      return `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="modal-box space-y-4">
            <div class="card-header">
              <h3 class="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>⏱</span>
                <span>فتح جلسة تحضير جديدة</span>
              </h3>
              <button onclick="closeModal();" class="btn-cancel text-sm font-bold">✕</button>
            </div>

            <form onsubmit="event.preventDefault(); createAttendanceSession(this.title.value, this.date.value);" class="space-y-4 text-right">
              <div>
                <label class="form-label">عنوان الجلسة *</label>
                <input type="text" name="title" required placeholder="مثال: جلسة الأسبوع الثالث" class="input-box" />
              </div>

              <div>
                <label class="form-label">تاريخ الجلسة *</label>
                <input type="date" name="date" required value="${today}" class="input-box font-mono" />
              </div>

              <div class="card-footer">
                <button type="button" onclick="closeModal();" class="btn-cancel">إلغاء</button>
                <button type="submit" class="btn-primary">فتح جلسة التحضير</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // Modal: Edit Student Problem & Notebook Details (نافذة تدوين مشكلة وملاحظة الطالب)
    if (state.modal === 'edit_problem') {
      const std = DB.students.find(s => s.id === state.modalData);
      if (!std) return '';

      const problemTypesList = [
        'تأخير تسليم شيت / تكليف',
        'غياب متكرر / إنذار غياب',
        'عذر طبي / إجازة رسمية',
        'مشكلة تسجيل / كود الطالب',
        'إعادة كويز / مشكلة درجات',
        'ملاحظة التزام وسلوك',
        'أخرى / ملاحظة خاصة'
      ];

      return `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="modal-box space-y-4 max-w-lg text-right">
            <div class="card-header border-b pb-3 border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">📓</span>
                <div>
                  <h3 class="text-sm font-black text-slate-800 dark:text-white">تدوين ملاحظة ومشكلة الطالب في النوتة</h3>
                  <p class="text-[11px] text-slate-400 font-bold">${std.name} (${std.academicId})</p>
                </div>
              </div>
              <button onclick="closeModal();" class="btn-cancel text-sm font-bold">✕</button>
            </div>

            <form onsubmit="
              event.preventDefault();
              const f = this;
              updateStudentProblemFull('${std.id}', {
                status: f.problemStatus.value,
                type: f.problemType.value,
                details: f.problemDetails.value,
                actionTaken: f.actionTaken.value,
                date: f.problemDate.value
              });
            " class="space-y-3.5 text-right">

              <!-- حالة المشكلة -->
              <div>
                <label class="form-label font-bold text-xs">حالة المشكلة والمتابعة: *</label>
                <div class="grid grid-cols-3 gap-2 mt-1">
                  <label class="cursor-pointer">
                    <input type="radio" name="problemStatus" value="none" ${(!std.problemStatus || std.problemStatus === 'none') && !std.hasProblem ? 'checked' : ''} class="peer sr-only" />
                    <div class="p-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 font-bold text-xs transition">
                      🟢 لا توجد مشكلة
                    </div>
                  </label>
                  <label class="cursor-pointer">
                    <input type="radio" name="problemStatus" value="pending" ${std.problemStatus === 'pending' || std.hasProblem ? 'checked' : ''} class="peer sr-only" />
                    <div class="p-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 peer-checked:border-rose-500 peer-checked:bg-rose-500/10 font-bold text-xs transition">
                      🔴 عنده مشكلة
                    </div>
                  </label>
                  <label class="cursor-pointer">
                    <input type="radio" name="problemStatus" value="resolved" ${std.problemStatus === 'resolved' ? 'checked' : ''} class="peer sr-only" />
                    <div class="p-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 font-bold text-xs transition">
                      🟡 تم الحل
                    </div>
                  </label>
                </div>
              </div>

              <!-- نوع المشكلة -->
              <div>
                <label class="form-label font-bold text-xs">نوع المشكلة / تصنيف الملاحظة:</label>
                <select name="problemType" class="input-box text-xs w-full mt-1 font-bold">
                  <option value="">-- اختر نوع المشكلة أو اتركه فارغاً --</option>
                  ${problemTypesList.map(t => `
                    <option value="${t}" ${std.problemType === t ? 'selected' : ''}>${t}</option>
                  `).join('')}
                </select>
              </div>

              <!-- تفاصيل المشكلة وملاحظات النوتة -->
              <div>
                <label class="form-label font-bold text-xs">ملاحظات النوتة وتفاصيل المشكلة:</label>
                <textarea name="problemDetails" rows="3" placeholder="اكتب كل تفاصيل مشكلة الطالب أو الملاحظة الخاصة به..." class="input-box text-xs w-full mt-1 font-medium">${std.problemDetails || ''}</textarea>
              </div>

              <!-- الإجراء المتخذ والمتابعة وتاريخها -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="form-label font-bold text-xs">الإجراء المتخذ (Action Taken):</label>
                  <input type="text" name="actionTaken" value="${std.actionTaken || ''}" placeholder="مثال: تم إبلاغ المعيد..." class="input-box text-xs w-full mt-1 font-medium" />
                </div>
                <div>
                  <label class="form-label font-bold text-xs">تاريخ تسجيل الملاحظة:</label>
                  <input type="date" name="problemDate" value="${std.problemDate || new Date().toISOString().slice(0, 10)}" class="input-box text-xs w-full mt-1 font-mono" />
                </div>
              </div>

              <!-- أزرار الإجراءات -->
              <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onclick="clearStudentProblem('${std.id}'); closeModal();" class="text-rose-500 hover:text-rose-700 text-xs font-bold transition">
                  🗑️ تفريغ المشكلة تماماً
                </button>
                <div class="flex items-center gap-2">
                  <button type="button" onclick="closeModal();" class="btn-cancel text-xs font-bold px-3 py-1.5">إلغاء</button>
                  <button type="submit" class="btn-primary-sm px-4 py-1.5">💾 حفظ الملاحظة</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // Modal: Quick WhatsApp Group (جروب الواتساب السريع)
    if (state.modal === 'quick_whatsapp') {
      const ent = state.currentEntity;
      const students = DB.students.filter(s => s.entityId === ent.id);
      const studentsWithPhone = students.filter(s => s.phone && s.phone.trim().length >= 8);
      const studentsWithoutPhone = students.filter(s => !s.phone || s.phone.trim().length < 8);
      const groupLink = ent.whatsappLink || '';

      return `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div class="modal-box space-y-4 max-w-2xl w-full text-right my-8 max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="card-header border-b pb-3 border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
                  💬
                </span>
                <div>
                  <h3 class="text-sm sm:text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <span>جروب الواتساب السريع</span>
                    <span class="badge-tag bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                      ${ent.name}
                    </span>
                  </h3>
                  <p class="text-xs text-slate-400">إنشاء الجروب في ثوانٍ، حفظ الرابط، ودعوة جميع الطلاب بضغطة زر</p>
                </div>
              </div>
              <button onclick="closeModal();" class="btn-cancel text-sm font-bold">✕</button>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
              <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="text-slate-400 block text-[10px]">إجمالي الطلاب:</span>
                <span class="font-black text-slate-800 dark:text-slate-200 text-sm font-mono">${students.length}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30">
                <span class="text-emerald-600 dark:text-emerald-400 block text-[10px]">لديهم رقم هاتف / واتس:</span>
                <span class="font-black text-emerald-600 dark:text-emerald-400 text-sm font-mono">${studentsWithPhone.length}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 col-span-2 sm:col-span-1">
                <span class="text-amber-600 dark:text-amber-400 block text-[10px]">بدون رقم هاتف:</span>
                <span class="font-black text-amber-600 dark:text-amber-400 text-sm font-mono">${studentsWithoutPhone.length}</span>
              </div>
            </div>

            <!-- STEP 1: FAST GROUP CREATION -->
            <div class="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/30 dark:via-slate-850 dark:to-slate-800 border-2 border-emerald-500/30 space-y-3">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">1</span>
                <h4 class="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
                  أسرع طريقة لإنشاء الجروب وإضافة كل الطلاب في ثوانٍ
                </h4>
              </div>

              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                بدل ما تسجل أرقام الطلاب واحد واحد على تليفونك، اضغط على <strong>"تحميل جهات الاتصال"</strong> وافتح الملف على هاتفك.. هيتحفظ كل طلاب السكشن فوراً مسبوقين بكود السكشن 
                <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">[${ent.code || 'س1'}]</span>. بعدها افتح واتساب واعمل "مجموعة جديدة" وابحث عن الكود وحددهم كلهم في ثوانٍ!
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button onclick="downloadStudentsVCF();" class="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow transition hover:scale-102">
                  <span>📥</span>
                  <span>تحميل جهات الاتصال (VCF)</span>
                </button>
                <button onclick="copyAllStudentPhones('comma');" class="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition">
                  <span>📋</span>
                  <span>نسخ جميع أرقام الطلاب</span>
                </button>
                <a href="https://web.whatsapp.com/" target="_blank" class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition">
                  <span>🌐</span>
                  <span>فتح واتساب ويب</span>
                </a>
              </div>
            </div>

            <!-- STEP 2: LINK THE GROUP -->
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">2</span>
                <h4 class="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
                  رابط الجروب الرسمي الخاص بـ (${ent.name})
                </h4>
              </div>
              <p class="text-xs text-slate-400">
                بعد عمل الجروب، انسخ رابط الدعوة (Invite Link) والصقه هنا ليتم حفظه دائماً للسكشن ومشاركته بسهولة:
              </p>

              <div class="flex items-center gap-2">
                <input 
                  type="url" 
                  id="whatsappGroupLinkInput" 
                  value="${groupLink}" 
                  placeholder="مثال: https://chat.whatsapp.com/L123456789abcdef..." 
                  class="input-box text-xs flex-1 font-mono text-left" 
                  dir="ltr" 
                />
                <button 
                  onclick="saveEntityWhatsappLink(document.getElementById('whatsappGroupLinkInput').value);" 
                  class="btn-primary-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 font-bold whitespace-nowrap shadow transition"
                >
                  💾 حفظ الرابط
                </button>
              </div>

              ${groupLink ? `
                <div class="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-3">
                  <div class="flex items-center justify-between flex-wrap gap-2">
                    <span class="badge-tag bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                      ✅ رابط الجروب متصل ومحفوظ بنجاح
                    </span>
                    <div class="flex items-center gap-2 flex-wrap">
                      <a href="${groupLink}" target="_blank" class="btn-primary-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow">
                        <span>🔗</span>
                        <span>فتح الجروب في واتساب</span>
                      </a>
                      <button onclick="copyGroupInviteMessage();" class="btn-secondary-sm text-xs font-bold px-3 py-1.5 flex items-center gap-1">
                        <span>📋</span>
                        <span>نسخ رسالة الترحيب مع الرابط</span>
                      </button>
                    </div>
                  </div>

                  <!-- QR Code Preview -->
                  <div class="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(groupLink)}" 
                      alt="QR Code" 
                      class="w-20 h-20 rounded-xl border border-slate-200 dark:border-slate-600 bg-white p-1 shadow-xs" 
                    />
                    <div class="text-right">
                      <h5 class="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1">
                        <span>📱</span>
                        <span>رمز QR للانضمام المباشر للجروب</span>
                      </h5>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        اعرض هذا الكود على شاشتك في قاعة المحاضرات أو المعمل ليقوم الطلاب بتصويره بكاميرا الهاتف والانضمام فوراً.
                      </p>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- STEP 3: INDIVIDUAL STUDENT INVITES -->
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center">3</span>
                  <h4 class="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
                    إرسال دعوة الجروب للطلاب فردياً على واتساب
                  </h4>
                </div>
                <span class="text-[11px] text-slate-400 font-bold">${students.length} طالب</span>
              </div>

              <div class="overflow-x-auto max-h-60 border border-slate-200 dark:border-slate-700 rounded-xl">
                <table class="w-full text-right text-xs">
                  <thead class="bg-slate-50 dark:bg-slate-900 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th class="p-2 w-10 text-center font-bold">م</th>
                      <th class="p-2 font-bold">اسم الطالب</th>
                      <th class="p-2 font-bold">رقم الهاتف</th>
                      <th class="p-2 font-bold text-center">إجراء التواصل</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    ${students.length === 0 ? `
                      <tr>
                        <td colspan="4" class="p-4 text-center text-slate-400">لا يوجد طلاب مسجلون بعد.</td>
                      </tr>
                    ` : students.map((std, idx) => {
                      const hasPhone = std.phone && std.phone.trim().length >= 8;
                      const cleanPhone = hasPhone ? std.phone.trim().replace(/^0/, '') : '';
                      const inviteText = encodeURIComponent(
                        `أهلاً يا ${std.name}،\nده رابط جروب الواتساب الرسمي الخاص بـ (${ent.name}):\n${groupLink || 'يرجى مراجعة الليدر'}\n\nبرجاء الانضمام لمتابعة التكليفات والتنبيهات.`
                      );

                      return `
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                          <td class="p-2 text-center text-slate-400 font-mono">${idx + 1}</td>
                          <td class="p-2 font-bold text-slate-800 dark:text-slate-100">${std.name}</td>
                          <td class="p-2 font-mono text-slate-600 dark:text-slate-300" dir="ltr">
                            ${hasPhone ? std.phone : '<span class="text-rose-400 italic text-[11px]">لا يوجد رقم</span>'}
                          </td>
                          <td class="p-2 text-center">
                            ${hasPhone ? `
                              <a 
                                href="https://wa.me/2${cleanPhone}?text=${inviteText}" 
                                target="_blank" 
                                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-700 transition hover:scale-102"
                                title="إرسال رابط الجروب لواتساب الطالب"
                              >
                                <span>💬</span>
                                <span>إرسال الرابط للواتساب</span>
                              </a>
                            ` : `
                              <button onclick="openModal('edit_student', '${std.id}');" class="text-amber-500 hover:underline font-bold text-[11px]">
                                ➕ إضافة رقم هاتف
                              </button>
                            `}
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="card-footer border-t pt-3 border-slate-100 dark:border-slate-800">
              <button type="button" onclick="closeModal();" class="btn-cancel font-bold px-4 py-2 text-xs">إغلاق</button>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  // Initial boot
  render();

  // Expose globally on window for all browser onclick / onsubmit attributes
  if (typeof window !== 'undefined') {
    window.state = state;
    window.DB = DB;
    window.DB_KEY = DB_KEY;
    window.loadDB = loadDB;
    window.saveDB = saveDB;
    window.getEntityStats = getEntityStats;
    window.getFilteredStudents = getFilteredStudents;
    window.handleSearch = handleSearch;
    window.switchEntity = switchEntity;
    window.registerEntity = registerEntity;
    window.editEntityName = editEntityName;
    window.deleteEntity = deleteEntity;
    window.addCoOfficial = addCoOfficial;
    window.deleteCoOfficial = deleteCoOfficial;
    window.toggleRegFormType = toggleRegFormType;
    window.handleFirstEntitySubmit = handleFirstEntitySubmit;
    window.addStudentToSection = addStudentToSection;
    window.updateStudent = updateStudent;
    window.deleteStudent = deleteStudent;
    window.processBulkPasteStudents = processBulkPasteStudents;
    window.seedSampleStudents = seedSampleStudents;
    window.printStudentsDirectory = printStudentsDirectory;
    window.printGridView = printGridView;
    window.printTaskReport = printTaskReport;
    window.exportTaskCSV = exportTaskCSV;
    window.saveEntityWhatsappLink = saveEntityWhatsappLink;
    window.downloadStudentsVCF = downloadStudentsVCF;
    window.copyAllStudentPhones = copyAllStudentPhones;
    window.copyGroupInviteMessage = copyGroupInviteMessage;
    window.updateStudentProblemStatus = updateStudentProblemStatus;
    window.updateStudentProblemType = updateStudentProblemType;
    window.updateStudentProblemNote = updateStudentProblemNote;
    window.updateStudentActionTaken = updateStudentActionTaken;
    window.updateStudentProblemFull = updateStudentProblemFull;
    window.clearStudentProblem = clearStudentProblem;
    window.printNotebook = printNotebook;
    window.createTask = createTask;
    window.deleteTask = deleteTask;
    window.updateTaskRecord = updateTaskRecord;
    window.updateTaskPayment = updateTaskPayment;
    window.updateTaskDelivery = updateTaskDelivery;
    window.updateTaskStatusTri = updateTaskStatusTri;
    window.toggleTaskDone = toggleTaskDone;
    window.updateTaskNote = updateTaskNote;
    window.updateTaskScore = updateTaskScore;
    window.batchSetTask = batchSetTask;
    window.toggleTaskTypeForm = toggleTaskTypeForm;
    window.updateCellValue = updateCellValue;
    window.toggleStudentDone = toggleStudentDone;
    window.addCustomColumn = addCustomColumn;
    window.deleteCustomColumn = deleteCustomColumn;
    window.createAssignment = createAssignment;
    window.deleteAssignment = deleteAssignment;
    window.updateSubmission = updateSubmission;
    window.createAttendanceSession = createAttendanceSession;
    window.deleteAttendanceSession = deleteAttendanceSession;
    window.markAttendance = markAttendance;
    window.toggleAttendance = toggleAttendance;
    window.markAllAttendance = markAllAttendance;
    window.resetAttendanceSession = resetAttendanceSession;
    window.exportAttendanceCSV = exportAttendanceCSV;
    window.printAttendanceView = printAttendanceView;
    window.seedSampleAttendanceSessions = seedSampleAttendanceSessions;
    window.exportStudentsCSV = exportStudentsCSV;
    window.importStudentsCSV = importStudentsCSV;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.render = render;
  }
})();
