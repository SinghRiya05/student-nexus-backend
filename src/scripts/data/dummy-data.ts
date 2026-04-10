export const ROLES = {
  TEACHER: "69d42224f19bc20b0c6688d8",
  ALUMINI: "69d4221cf19bc20b0c6688d5",
  STUDENT: "69d39e7240306e5fab820a64",
};

export const UNIVERSITIES = {
  BBDU: "69d4d7eb99dd7b7c2324db43",
  LU: "69d4d83099dd7b7c2324db58",
};

export const COURSES = {
  BTECH: "69d495491a06dc035a91e270",
  MCA: "69d4957a1a06dc035a91e276",
  MTECH: "69d4958c1a06dc035a91e279",
  MBA: "69d4959d1a06dc035a91e27c",
  BBA: "69d495b91a06dc035a91e27f",
  BCA: "69d78a86b5e47999d3f5cec7",
};

export const SEMESTERS = {
  MCA: [
    "69d508e8622771b8c79e8f33", // S1
    "69d50642f97238b2b677a61f", // S2
    "69d50e6f622771b8c79e8f53", // S3
    "69d50e83622771b8c79e8f5f", // S4
  ],
  BCA: [
    "69d78aabb5e47999d3f5ced5", // S1
    "69d78abab5e47999d3f5cee1", // S2
    "69d78ac8b5e47999d3f5ceed", // S3
    "69d78ad4b5e47999d3f5cef9", // S4
    "69d78ae6b5e47999d3f5cf05", // S5
    "69d78af5b5e47999d3f5cf11", // S6
  ],
};

export const dummyUsers = [
  // ── Students ─────────────────────────────────────────────────────────────
  {
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav.sharma@example.com",
    phone: "9812345601",
    password: "Password@123",
    roleId: ROLES.STUDENT,
    universityId: UNIVERSITIES.BBDU,
    courseIds: [COURSES.MCA],
    semesterId: SEMESTERS.MCA[0], // S1
    profile: {
      type: "STUDENT",
      hobby_badge: "Coding",
      skills: ["React", "NodeJS"],
    },
  },
    {
    firstName: "Santosh",
    lastName: "Kumar",
    email: "thecodeneverlie@gmail.com",
    phone: "9812345601",
    password: "Password@123",
    roleId: ROLES.STUDENT,
    universityId: UNIVERSITIES.LU,
    courseIds: [COURSES.BCA],
    semesterId: SEMESTERS.BCA[3], // S4
    profile: {
      type: "STUDENT",
      hobby_badge: "Coding",
      skills: ["React", "NodeJS"],
    },
  },
  {
    firstName: "Priya",
    lastName: "Verma",
    email: "priya.verma@example.com",
    phone: "9812345602",
    password: "Password@123",
    roleId: ROLES.STUDENT,
    universityId: UNIVERSITIES.LU,
    courseIds: [COURSES.BCA],
    semesterId: SEMESTERS.BCA[1], // S2
    profile: {
      type: "STUDENT",
      hobby_badge: "Photography",
      skills: ["UI/UX", "TypeScript"],
    },
  },
  {
    firstName: "Rohan",
    lastName: "Gupta",
    email: "rohan.gupta@example.com",
    phone: "9812345603",
    password: "Password@123",
    roleId: ROLES.STUDENT,
    universityId: UNIVERSITIES.BBDU,
    courseIds: [COURSES.MCA],
    semesterId: SEMESTERS.MCA[2], // S3
    profile: {
      type: "STUDENT",
      hobby_badge: "Gaming",
      skills: ["Python", "SQL"],
    },
  },
  {
    firstName: "Sneha",
    lastName: "Patel",
    email: "sneha.patel@example.com",
    phone: "9812345604",
    password: "Password@123",
    roleId: ROLES.STUDENT,
    universityId: UNIVERSITIES.LU,
    courseIds: [COURSES.BCA],
    semesterId: SEMESTERS.BCA[3], // S4
    profile: {
      type: "STUDENT",
      hobby_badge: "Reading",
      skills: ["Java", "C++"],
    },
  },
  {
    firstName: "Kabir",
    lastName: "Singh",
    email: "kabir.singh@example.com",
    phone: "9812345605",
    password: "Password@123",
    roleId: ROLES.STUDENT,
    universityId: UNIVERSITIES.BBDU,
    courseIds: [COURSES.MCA],
    semesterId: SEMESTERS.MCA[1], // S2
    profile: {
      type: "STUDENT",
      hobby_badge: "Music",
      skills: ["Docker", "AWS"],
    },
  },
  // ── Alumni ────────────────────────────────────────────────────────────────
  {
    firstName: "Neha",
    lastName: "Joshi",
    email: "neha.joshi@example.com",
    phone: "9812345606",
    password: "Password@123",
    roleId: ROLES.ALUMINI,
    universityId: UNIVERSITIES.BBDU,
    courseIds: [COURSES.MCA],
    semesterId: null,
    profile: {
      type: "ALUMINI",
      currentCompany: "Google",
      jobTitle: "Frontend Developer",
      experienceYears: 3,
      skills: ["React", "TypeScript"],
    },
  },
  {
    firstName: "Arjun",
    lastName: "Mehta",
    email: "arjun.mehta@example.com",
    phone: "9812345607",
    password: "Password@123",
    roleId: ROLES.ALUMINI,
    universityId: UNIVERSITIES.LU,
    courseIds: [COURSES.BCA],
    semesterId: null,
    profile: {
      type: "ALUMINI",
      currentCompany: "Microsoft",
      jobTitle: "Backend Developer",
      experienceYears: 5,
      skills: ["NodeJS", "Docker"],
    },
  },
  {
    firstName: "Divya",
    lastName: "Kumar",
    email: "divya.kumar@example.com",
    phone: "9812345608",
    password: "Password@123",
    roleId: ROLES.ALUMINI,
    universityId: UNIVERSITIES.BBDU,
    courseIds: [COURSES.MBA],
    semesterId: null,
    profile: {
      type: "ALUMINI",
      currentCompany: "Amazon",
      jobTitle: "Product Manager",
      experienceYears: 7,
      skills: ["SQL", "AWS"],
    },
  },
  // ── Teachers ──────────────────────────────────────────────────────────────
  {
    firstName: "Dr. Ravi",
    lastName: "Mishra",
    email: "ravi.mishra@example.com",
    phone: "9812345609",
    password: "Password@123",
    roleId: ROLES.TEACHER,
    universityId: UNIVERSITIES.BBDU,
    courseIds: [COURSES.MCA],
    semesterId: null,
    profile: {
      type: "TEACHER",
      designation: "Associate Professor",
      department: "School of Computer Applications",
      experienceYears: 12,
      bio: "Experienced educator in Software Engineering and Cloud Computing.",
    },
  },
  {
    firstName: "Prof. Sunita",
    lastName: "Yadav",
    email: "sunita.yadav@example.com",
    phone: "9812345610",
    password: "Password@123",
    roleId: ROLES.TEACHER,
    universityId: UNIVERSITIES.LU,
    courseIds: [COURSES.BCA],
    semesterId: null,
    profile: {
      type: "TEACHER",
      designation: "Assistant Professor",
      department: "School of Computer Applications",
      experienceYears: 9,
      bio: "Specialist in Data Structures, Algorithms, and Database Management.",
    },
  },
];
