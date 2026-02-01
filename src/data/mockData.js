// src/data/mockData.js

export const CURRENT_USER = {
  id: "user_123",
  username: "gym_rat_99",
  name: "John Doe",
  email: "john@example.com"
};

export const EXERCISE_LIST = [
  // --- PUSH (Chest, Shoulders, Triceps) ---
  { id: "ex_1", name: "Bench Press", type: "strength", bodyPart: "Chest" },
  { id: "ex_5", name: "Overhead Press", type: "strength", bodyPart: "Shoulders" },
  { id: "ex_6", name: "Incline DB Press", type: "strength", bodyPart: "Chest" },
  { id: "ex_9", name: "Tricep Pushdown", type: "strength", bodyPart: "Triceps" },
  { id: "ex_10", name: "Lateral Raise", type: "strength", bodyPart: "Shoulders" },

  // --- PULL (Back, Biceps) ---
  { id: "ex_11", name: "Lat Pulldown", type: "strength", bodyPart: "Back" },
  { id: "ex_12", name: "Barbell Row", type: "strength", bodyPart: "Back" },
  { id: "ex_4", name: "Dumbbell Curl", type: "strength", bodyPart: "Biceps" },
  { id: "ex_13", name: "Face Pull", type: "strength", bodyPart: "Shoulders" },

  // --- LEGS (Quads, Hams, Calves) ---
  { id: "ex_2", name: "Squat", type: "strength", bodyPart: "Legs" },
  { id: "ex_7", name: "Leg Press", type: "strength", bodyPart: "Legs" },
  { id: "ex_8", name: "Leg Extension", type: "strength", bodyPart: "Legs" },
  { id: "ex_14", name: "Calf Raise", type: "strength", bodyPart: "Calves" },
  
  // --- CARDIO ---
  { id: "ex_3", name: "Treadmill Run", type: "cardio", bodyPart: "Cardio" },
];

export const WORKOUT_LOGS = [
  // ========================== SEPT 2025 DATA (Historical) ==========================
  // Day 1: PUSH
  {
    id: "log_w1_d1", date: "2025-09-01", userId: "user_123",
    exercises: [
      { exerciseId: "ex_1", name: "Bench Press", sets: [{setNumber:1, reps:10, weight:60}, {setNumber:2, reps:8, weight:65}, {setNumber:3, reps:6, weight:70}] },
      { exerciseId: "ex_5", name: "Overhead Press", sets: [{setNumber:1, reps:12, weight:30}, {setNumber:2, reps:10, weight:35}, {setNumber:3, reps:8, weight:40}] },
      { exerciseId: "ex_6", name: "Incline DB Press", sets: [{setNumber:1, reps:12, weight:20}, {setNumber:2, reps:10, weight:22}, {setNumber:3, reps:8, weight:24}] },
      { exerciseId: "ex_9", name: "Tricep Pushdown", sets: [{setNumber:1, reps:15, weight:15}, {setNumber:2, reps:12, weight:20}, {setNumber:3, reps:10, weight:25}] }
    ]
  },
  {
    id: "log_w1_d2", date: "2025-09-02", userId: "user_123",
    exercises: [
      { exerciseId: "ex_11", name: "Lat Pulldown", sets: [{setNumber:1, reps:12, weight:40}, {setNumber:2, reps:10, weight:45}, {setNumber:3, reps:8, weight:50}] },
      { exerciseId: "ex_12", name: "Barbell Row", sets: [{setNumber:1, reps:10, weight:50}, {setNumber:2, reps:8, weight:55}, {setNumber:3, reps:6, weight:60}] },
      { exerciseId: "ex_4", name: "Dumbbell Curl", sets: [{setNumber:1, reps:12, weight:10}, {setNumber:2, reps:10, weight:12}, {setNumber:3, reps:8, weight:14}] },
      { exerciseId: "ex_13", name: "Face Pull", sets: [{setNumber:1, reps:15, weight:15}, {setNumber:2, reps:15, weight:17}, {setNumber:3, reps:15, weight:20}] }
    ]
  },
  {
    id: "log_w1_d3", date: "2025-09-03", userId: "user_123",
    exercises: [
      { exerciseId: "ex_2", name: "Squat", sets: [{setNumber:1, reps:10, weight:80}, {setNumber:2, reps:8, weight:90}, {setNumber:3, reps:5, weight:100}] },
      { exerciseId: "ex_7", name: "Leg Press", sets: [{setNumber:1, reps:12, weight:120}, {setNumber:2, reps:10, weight:140}, {setNumber:3, reps:8, weight:160}] },
      { exerciseId: "ex_8", name: "Leg Extension", sets: [{setNumber:1, reps:15, weight:30}, {setNumber:2, reps:12, weight:35}, {setNumber:3, reps:10, weight:40}] },
      { exerciseId: "ex_14", name: "Calf Raise", sets: [{setNumber:1, reps:20, weight:40}, {setNumber:2, reps:15, weight:50}, {setNumber:3, reps:15, weight:60}] }
    ]
  },
  {
    id: "log_w1_d4", date: "2025-09-04", userId: "user_123",
    exercises: [
      { exerciseId: "ex_5", name: "Overhead Press", sets: [{setNumber:1, reps:10, weight:35}, {setNumber:2, reps:8, weight:40}, {setNumber:3, reps:6, weight:45}] },
      { exerciseId: "ex_1", name: "Bench Press", sets: [{setNumber:1, reps:10, weight:60}, {setNumber:2, reps:10, weight:60}, {setNumber:3, reps:10, weight:60}] },
      { exerciseId: "ex_10", name: "Lateral Raise", sets: [{setNumber:1, reps:15, weight:8}, {setNumber:2, reps:15, weight:9}, {setNumber:3, reps:12, weight:10}] },
      { exerciseId: "ex_9", name: "Tricep Pushdown", sets: [{setNumber:1, reps:12, weight:20}, {setNumber:2, reps:12, weight:20}, {setNumber:3, reps:12, weight:20}] }
    ]
  },
  {
    id: "log_w1_d5", date: "2025-09-05", userId: "user_123",
    exercises: [
      { exerciseId: "ex_11", name: "Lat Pulldown", sets: [{setNumber:1, reps:12, weight:40}, {setNumber:2, reps:12, weight:40}, {setNumber:3, reps:12, weight:40}] },
      { exerciseId: "ex_4", name: "Dumbbell Curl", sets: [{setNumber:1, reps:10, weight:12}, {setNumber:2, reps:10, weight:12}, {setNumber:3, reps:10, weight:12}] },
      { exerciseId: "ex_12", name: "Barbell Row", sets: [{setNumber:1, reps:10, weight:50}, {setNumber:2, reps:10, weight:50}, {setNumber:3, reps:10, weight:50}] },
      { exerciseId: "ex_3", name: "Treadmill Run", cardioData: { incline: 1, speed: 9, minutes: 20, distance: 3, calories: 250 } }
    ]
  },
  {
    id: "log_w1_d6", date: "2025-09-06", userId: "user_123",
    exercises: [
      { exerciseId: "ex_7", name: "Leg Press", sets: [{setNumber:1, reps:12, weight:130}, {setNumber:2, reps:12, weight:140}, {setNumber:3, reps:12, weight:150}] },
      { exerciseId: "ex_2", name: "Squat", sets: [{setNumber:1, reps:8, weight:85}, {setNumber:2, reps:8, weight:85}, {setNumber:3, reps:8, weight:85}] },
      { exerciseId: "ex_14", name: "Calf Raise", sets: [{setNumber:1, reps:20, weight:40}, {setNumber:2, reps:20, weight:40}] },
      { exerciseId: "ex_8", name: "Leg Extension", sets: [{setNumber:1, reps:15, weight:35}, {setNumber:2, reps:15, weight:35}] }
    ]
  },
  // Week 2
  {
    id: "log_w2_d1", date: "2025-09-08", userId: "user_123",
    exercises: [
      { exerciseId: "ex_1", name: "Bench Press", sets: [{setNumber:1, reps:10, weight:62.5}, {setNumber:2, reps:8, weight:67.5}, {setNumber:3, reps:6, weight:72.5}] },
      { exerciseId: "ex_5", name: "Overhead Press", sets: [{setNumber:1, reps:12, weight:32.5}, {setNumber:2, reps:10, weight:37.5}, {setNumber:3, reps:8, weight:42.5}] },
      { exerciseId: "ex_6", name: "Incline DB Press", sets: [{setNumber:1, reps:12, weight:22}, {setNumber:2, reps:10, weight:24}, {setNumber:3, reps:8, weight:26}] },
      { exerciseId: "ex_9", name: "Tricep Pushdown", sets: [{setNumber:1, reps:15, weight:17.5}, {setNumber:2, reps:12, weight:22.5}, {setNumber:3, reps:10, weight:27.5}] }
    ]
  },
  {
    id: "log_w2_d2", date: "2025-09-09", userId: "user_123",
    exercises: [
      { exerciseId: "ex_11", name: "Lat Pulldown", sets: [{setNumber:1, reps:12, weight:42.5}, {setNumber:2, reps:10, weight:47.5}, {setNumber:3, reps:8, weight:52.5}] },
      { exerciseId: "ex_12", name: "Barbell Row", sets: [{setNumber:1, reps:10, weight:52.5}, {setNumber:2, reps:8, weight:57.5}, {setNumber:3, reps:6, weight:62.5}] },
      { exerciseId: "ex_4", name: "Dumbbell Curl", sets: [{setNumber:1, reps:12, weight:12}, {setNumber:2, reps:10, weight:14}, {setNumber:3, reps:8, weight:16}] },
      { exerciseId: "ex_13", name: "Face Pull", sets: [{setNumber:1, reps:15, weight:17.5}, {setNumber:2, reps:15, weight:20}, {setNumber:3, reps:15, weight:22.5}] }
    ]
  },
  {
    id: "log_w2_d3", date: "2025-09-10", userId: "user_123",
    exercises: [
      { exerciseId: "ex_2", name: "Squat", sets: [{setNumber:1, reps:10, weight:85}, {setNumber:2, reps:8, weight:95}, {setNumber:3, reps:5, weight:105}] },
      { exerciseId: "ex_7", name: "Leg Press", sets: [{setNumber:1, reps:12, weight:130}, {setNumber:2, reps:10, weight:150}, {setNumber:3, reps:8, weight:170}] },
      { exerciseId: "ex_8", name: "Leg Extension", sets: [{setNumber:1, reps:15, weight:32.5}, {setNumber:2, reps:12, weight:37.5}, {setNumber:3, reps:10, weight:42.5}] },
      { exerciseId: "ex_14", name: "Calf Raise", sets: [{setNumber:1, reps:20, weight:45}, {setNumber:2, reps:15, weight:55}, {setNumber:3, reps:15, weight:65}] }
    ]
  },
  { id: "log_w2_d4", date: "2025-09-11", userId: "user_123", exercises: [ { exerciseId: "ex_5", name: "Overhead Press", sets: [{setNumber:1, reps:10, weight:37.5}] }, { exerciseId: "ex_1", name: "Bench Press", sets: [{setNumber:1, reps:10, weight:62.5}] }, { exerciseId: "ex_10", name: "Lateral Raise", sets: [{setNumber:1, reps:15, weight:9}] }, { exerciseId: "ex_9", name: "Tricep Pushdown", sets: [{setNumber:1, reps:12, weight:22.5}] } ] },
  { id: "log_w2_d5", date: "2025-09-12", userId: "user_123", exercises: [ { exerciseId: "ex_11", name: "Lat Pulldown", sets: [{setNumber:1, reps:12, weight:45}] }, { exerciseId: "ex_4", name: "Dumbbell Curl", sets: [{setNumber:1, reps:10, weight:14}] }, { exerciseId: "ex_12", name: "Barbell Row", sets: [{setNumber:1, reps:10, weight:55}] }, { exerciseId: "ex_3", name: "Treadmill Run", cardioData: { incline: 1, speed: 9, minutes: 22, distance: 3.2, calories: 270 } } ] },
  { id: "log_w2_d6", date: "2025-09-13", userId: "user_123", exercises: [ { exerciseId: "ex_2", name: "Squat", sets: [{setNumber:1, reps:8, weight:90}] }, { exerciseId: "ex_7", name: "Leg Press", sets: [{setNumber:1, reps:12, weight:150}] }, { exerciseId: "ex_14", name: "Calf Raise", sets: [{setNumber:1, reps:20, weight:45}] }, { exerciseId: "ex_8", name: "Leg Extension", sets: [{setNumber:1, reps:15, weight:40}] } ] },
  // Week 3
  {
    id: "log_w3_d1", date: "2025-09-15", userId: "user_123",
    exercises: [
      { exerciseId: "ex_1", name: "Bench Press", sets: [{setNumber:1, reps:10, weight:65}, {setNumber:2, reps:8, weight:70}, {setNumber:3, reps:6, weight:75}] },
      { exerciseId: "ex_5", name: "Overhead Press", sets: [{setNumber:1, reps:12, weight:35}, {setNumber:2, reps:10, weight:40}, {setNumber:3, reps:8, weight:45}] },
      { exerciseId: "ex_6", name: "Incline DB Press", sets: [{setNumber:1, reps:12, weight:24}, {setNumber:2, reps:10, weight:26}, {setNumber:3, reps:8, weight:28}] },
      { exerciseId: "ex_9", name: "Tricep Pushdown", sets: [{setNumber:1, reps:15, weight:20}, {setNumber:2, reps:12, weight:25}, {setNumber:3, reps:10, weight:30}] }
    ]
  },
  {
    id: "log_w3_d2", date: "2025-09-16", userId: "user_123",
    exercises: [
      { exerciseId: "ex_11", name: "Lat Pulldown", sets: [{setNumber:1, reps:12, weight:45}, {setNumber:2, reps:10, weight:50}, {setNumber:3, reps:8, weight:55}] },
      { exerciseId: "ex_12", name: "Barbell Row", sets: [{setNumber:1, reps:10, weight:55}, {setNumber:2, reps:8, weight:60}, {setNumber:3, reps:6, weight:65}] },
      { exerciseId: "ex_4", name: "Dumbbell Curl", sets: [{setNumber:1, reps:12, weight:14}, {setNumber:2, reps:10, weight:16}, {setNumber:3, reps:8, weight:18}] },
      { exerciseId: "ex_13", name: "Face Pull", sets: [{setNumber:1, reps:15, weight:20}, {setNumber:2, reps:15, weight:22.5}, {setNumber:3, reps:15, weight:25}] }
    ]
  },
  {
    id: "log_w3_d3", date: "2025-09-17", userId: "user_123",
    exercises: [
      { exerciseId: "ex_2", name: "Squat", sets: [{setNumber:1, reps:10, weight:90}, {setNumber:2, reps:8, weight:100}, {setNumber:3, reps:5, weight:110}] },
      { exerciseId: "ex_7", name: "Leg Press", sets: [{setNumber:1, reps:12, weight:140}, {setNumber:2, reps:10, weight:160}, {setNumber:3, reps:8, weight:180}] },
      { exerciseId: "ex_8", name: "Leg Extension", sets: [{setNumber:1, reps:15, weight:35}, {setNumber:2, reps:12, weight:40}, {setNumber:3, reps:10, weight:45}] },
      { exerciseId: "ex_14", name: "Calf Raise", sets: [{setNumber:1, reps:20, weight:50}, {setNumber:2, reps:15, weight:60}, {setNumber:3, reps:15, weight:70}] }
    ]
  },
  { id: "log_w3_d4", date: "2025-09-18", userId: "user_123", exercises: [ { exerciseId: "ex_5", name: "Overhead Press", sets: [{setNumber:1, reps:10, weight:40}] }, { exerciseId: "ex_1", name: "Bench Press", sets: [{setNumber:1, reps:10, weight:65}] }, { exerciseId: "ex_10", name: "Lateral Raise", sets: [{setNumber:1, reps:15, weight:10}] }, { exerciseId: "ex_9", name: "Tricep Pushdown", sets: [{setNumber:1, reps:12, weight:25}] } ] },
  { id: "log_w3_d5", date: "2025-09-19", userId: "user_123", exercises: [ { exerciseId: "ex_11", name: "Lat Pulldown", sets: [{setNumber:1, reps:12, weight:47.5}] }, { exerciseId: "ex_4", name: "Dumbbell Curl", sets: [{setNumber:1, reps:10, weight:16}] }, { exerciseId: "ex_12", name: "Barbell Row", sets: [{setNumber:1, reps:10, weight:60}] }, { exerciseId: "ex_3", name: "Treadmill Run", cardioData: { incline: 2, speed: 9.5, minutes: 25, distance: 4.0, calories: 300 } } ] },
  { id: "log_w3_d6", date: "2025-09-20", userId: "user_123", exercises: [ { exerciseId: "ex_2", name: "Squat", sets: [{setNumber:1, reps:8, weight:95}] }, { exerciseId: "ex_7", name: "Leg Press", sets: [{setNumber:1, reps:12, weight:160}] }, { exerciseId: "ex_14", name: "Calf Raise", sets: [{setNumber:1, reps:20, weight:50}] }, { exerciseId: "ex_8", name: "Leg Extension", sets: [{setNumber:1, reps:15, weight:45}] } ] },
  // Week 4
  {
    id: "log_w4_d1", date: "2025-09-22", userId: "user_123",
    exercises: [
      { exerciseId: "ex_1", name: "Bench Press", sets: [{setNumber:1, reps:10, weight:65}, {setNumber:2, reps:8, weight:70}, {setNumber:3, reps:6, weight:75}] },
      { exerciseId: "ex_5", name: "Overhead Press", sets: [{setNumber:1, reps:12, weight:35}, {setNumber:2, reps:10, weight:40}, {setNumber:3, reps:8, weight:45}] },
      { exerciseId: "ex_6", name: "Incline DB Press", sets: [{setNumber:1, reps:12, weight:24}, {setNumber:2, reps:10, weight:26}, {setNumber:3, reps:8, weight:28}] },
      { exerciseId: "ex_9", name: "Tricep Pushdown", sets: [{setNumber:1, reps:15, weight:20}, {setNumber:2, reps:12, weight:25}, {setNumber:3, reps:10, weight:30}] }
    ]
  },
  {
    id: "log_w4_d2", date: "2025-09-23", userId: "user_123",
    exercises: [
      { exerciseId: "ex_11", name: "Lat Pulldown", sets: [{setNumber:1, reps:12, weight:45}, {setNumber:2, reps:10, weight:50}, {setNumber:3, reps:8, weight:55}] },
      { exerciseId: "ex_12", name: "Barbell Row", sets: [{setNumber:1, reps:10, weight:55}, {setNumber:2, reps:8, weight:60}, {setNumber:3, reps:6, weight:65}] },
      { exerciseId: "ex_4", name: "Dumbbell Curl", sets: [{setNumber:1, reps:12, weight:14}, {setNumber:2, reps:10, weight:16}, {setNumber:3, reps:8, weight:18}] },
      { exerciseId: "ex_13", name: "Face Pull", sets: [{setNumber:1, reps:15, weight:20}, {setNumber:2, reps:15, weight:22.5}, {setNumber:3, reps:15, weight:25}] }
    ]
  },
  {
    id: "log_w4_d3", date: "2025-09-24", userId: "user_123",
    exercises: [
      { exerciseId: "ex_2", name: "Squat", sets: [{setNumber:1, reps:10, weight:90}, {setNumber:2, reps:8, weight:100}, {setNumber:3, reps:5, weight:110}] },
      { exerciseId: "ex_7", name: "Leg Press", sets: [{setNumber:1, reps:12, weight:140}, {setNumber:2, reps:10, weight:160}, {setNumber:3, reps:8, weight:180}] },
      { exerciseId: "ex_8", name: "Leg Extension", sets: [{setNumber:1, reps:15, weight:35}, {setNumber:2, reps:12, weight:40}, {setNumber:3, reps:10, weight:45}] },
      { exerciseId: "ex_14", name: "Calf Raise", sets: [{setNumber:1, reps:20, weight:50}, {setNumber:2, reps:15, weight:60}, {setNumber:3, reps:15, weight:70}] }
    ]
  },

  // ========================== JANUARY 2026 DATA (Current) ==========================
  // 1. Jan 2 (Fri) - Push
  {
    id: "log_jan26_1", date: "2026-01-02", userId: "user_123",
    exercises: [
      { exerciseId: "ex_1", name: "Bench Press", sets: [{setNumber:1, reps:10, weight:70}, {setNumber:2, reps:8, weight:75}, {setNumber:3, reps:5, weight:80}] },
      { exerciseId: "ex_5", name: "Overhead Press", sets: [{setNumber:1, reps:12, weight:40}, {setNumber:2, reps:10, weight:45}] },
      { exerciseId: "ex_9", name: "Tricep Pushdown", sets: [{setNumber:1, reps:15, weight:25}, {setNumber:2, reps:12, weight:30}] }
    ]
  },
  // 2. Jan 3 (Sat) - Pull
  {
    id: "log_jan26_2", date: "2026-01-03", userId: "user_123",
    exercises: [
      { exerciseId: "ex_11", name: "Lat Pulldown", sets: [{setNumber:1, reps:12, weight:50}, {setNumber:2, reps:10, weight:55}, {setNumber:3, reps:8, weight:60}] },
      { exerciseId: "ex_12", name: "Barbell Row", sets: [{setNumber:1, reps:10, weight:60}, {setNumber:2, reps:8, weight:65}] },
      { exerciseId: "ex_4", name: "Dumbbell Curl", sets: [{setNumber:1, reps:12, weight:16}, {setNumber:2, reps:10, weight:18}] }
    ]
  },
  // 3. Jan 4 (Sun) - Legs
  {
    id: "log_jan26_3", date: "2026-01-09", userId: "user_123",
    exercises: [
      { exerciseId: "ex_2", name: "Squat", sets: [{setNumber:1, reps:10, weight:100}, {setNumber:2, reps:8, weight:110}, {setNumber:3, reps:5, weight:120}] },
      { exerciseId: "ex_7", name: "Leg Press", sets: [{setNumber:1, reps:12, weight:180}, {setNumber:2, reps:10, weight:200}] },
      { exerciseId: "ex_14", name: "Calf Raise", sets: [{setNumber:1, reps:20, weight:60}, {setNumber:2, reps:15, weight:70}] }
    ]
  },
  // 4. Jan 6 (Tue) - Push (Monday was Rest)
  {
    id: "log_jan26_4", date: "2026-01-06", userId: "user_123",
    exercises: [
      { exerciseId: "ex_1", name: "Bench Press", sets: [{setNumber:1, reps:8, weight:75}, {setNumber:2, reps:6, weight:80}] },
      { exerciseId: "ex_6", name: "Incline DB Press", sets: [{setNumber:1, reps:10, weight:28}, {setNumber:2, reps:8, weight:30}] },
      { exerciseId: "ex_10", name: "Lateral Raise", sets: [{setNumber:1, reps:15, weight:10}, {setNumber:2, reps:15, weight:10}] }
    ]
  },
  // 5. Jan 7 (Wed) - Pull
  {
    id: "log_jan26_5", date: "2026-01-07", userId: "user_123",
    exercises: [
      { exerciseId: "ex_11", name: "Lat Pulldown", sets: [{setNumber:1, reps:10, weight:55}, {setNumber:2, reps:8, weight:60}] },
      { exerciseId: "ex_13", name: "Face Pull", sets: [{setNumber:1, reps:15, weight:25}, {setNumber:2, reps:15, weight:30}] },
      { exerciseId: "ex_4", name: "Dumbbell Curl", sets: [{setNumber:1, reps:12, weight:18}] }
    ]
  },
  // 6. Jan 8 (Thu) - Legs
  {
    id: "log_jan26_6", date: "2026-01-08", userId: "user_123",
    exercises: [
      { exerciseId: "ex_2", name: "Squat", sets: [{setNumber:1, reps:5, weight:115}, {setNumber:2, reps:5, weight:120}, {setNumber:3, reps:3, weight:125}] },
      { exerciseId: "ex_8", name: "Leg Extension", sets: [{setNumber:1, reps:15, weight:45}, {setNumber:2, reps:12, weight:50}] }
    ]
  },
  // 7. Jan 10 (Sat) - Cardio / Active Recovery
  {
    id: "log_jan26_7", date: "2026-01-10", userId: "user_123",
    exercises: [
      { 
        exerciseId: "ex_3", 
        name: "Treadmill Run", 
        cardioData: { incline: 1.5, speed: 10, minutes: 30, distance: 5, calories: 350 } 
      }
    ]
  },

    // ========================== JANUARY 2026 DATA (Recent Week) ==========================
  // Sunday Jan 11 — REST (intentionally skipped)

  // 8. Jan 12 (Mon) - Push
  {
    id: "log_jan26_8",
    date: "2026-01-12",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_1",
        name: "Bench Press",
        sets: [
          { setNumber: 1, reps: 8, weight: 77.5 },
          { setNumber: 2, reps: 6, weight: 82.5 },
          { setNumber: 3, reps: 4, weight: 85 }
        ]
      },
      {
        exerciseId: "ex_5",
        name: "Overhead Press",
        sets: [
          { setNumber: 1, reps: 10, weight: 45 },
          { setNumber: 2, reps: 8, weight: 50 }
        ]
      },
      {
        exerciseId: "ex_9",
        name: "Tricep Pushdown",
        sets: [
          { setNumber: 1, reps: 15, weight: 30 },
          { setNumber: 2, reps: 12, weight: 35 }
        ]
      }
    ]
  },

  // 9. Jan 13 (Tue) - Pull
  {
    id: "log_jan26_9",
    date: "2026-01-13",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_11",
        name: "Lat Pulldown",
        sets: [
          { setNumber: 1, reps: 10, weight: 60 },
          { setNumber: 2, reps: 8, weight: 65 }
        ]
      },
      {
        exerciseId: "ex_12",
        name: "Barbell Row",
        sets: [
          { setNumber: 1, reps: 8, weight: 70 },
          { setNumber: 2, reps: 6, weight: 75 }
        ]
      },
      {
        exerciseId: "ex_4",
        name: "Dumbbell Curl",
        sets: [
          { setNumber: 1, reps: 12, weight: 18 },
          { setNumber: 2, reps: 10, weight: 20 }
        ]
      }
    ]
  },

  // 10. Jan 14 (Wed) - Legs
  {
    id: "log_jan26_10",
    date: "2026-01-14",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_2",
        name: "Squat",
        sets: [
          { setNumber: 1, reps: 5, weight: 120 },
          { setNumber: 2, reps: 5, weight: 125 },
          { setNumber: 3, reps: 3, weight: 130 }
        ]
      },
      {
        exerciseId: "ex_7",
        name: "Leg Press",
        sets: [
          { setNumber: 1, reps: 10, weight: 200 },
          { setNumber: 2, reps: 8, weight: 220 }
        ]
      },
      {
        exerciseId: "ex_14",
        name: "Calf Raise",
        sets: [
          { setNumber: 1, reps: 20, weight: 70 },
          { setNumber: 2, reps: 15, weight: 80 }
        ]
      }
    ]
  },

  // 11. Jan 15 (Thu) - Push (Hypertrophy Focus)
  {
    id: "log_jan26_11",
    date: "2026-01-15",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_6",
        name: "Incline DB Press",
        sets: [
          { setNumber: 1, reps: 12, weight: 30 },
          { setNumber: 2, reps: 10, weight: 32 }
        ]
      },
      {
        exerciseId: "ex_10",
        name: "Lateral Raise",
        sets: [
          { setNumber: 1, reps: 15, weight: 10 },
          { setNumber: 2, reps: 15, weight: 12 }
        ]
      },
      {
        exerciseId: "ex_9",
        name: "Tricep Pushdown",
        sets: [
          { setNumber: 1, reps: 15, weight: 32.5 },
          { setNumber: 2, reps: 12, weight: 37.5 }
        ]
      }
    ]
  },

  // 12. Jan 16 (Fri) - Pull
  {
    id: "log_jan26_12",
    date: "2026-01-16",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_11",
        name: "Lat Pulldown",
        sets: [
          { setNumber: 1, reps: 8, weight: 67.5 },
          { setNumber: 2, reps: 6, weight: 70 }
        ]
      },
      {
        exerciseId: "ex_13",
        name: "Face Pull",
        sets: [
          { setNumber: 1, reps: 15, weight: 30 },
          { setNumber: 2, reps: 15, weight: 32.5 }
        ]
      }
    ]
  },

  // 13. Jan 17 (Sat) - Cardio / Conditioning
  {
    id: "log_jan26_13",
    date: "2026-01-17",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_3",
        name: "Treadmill Run",
        cardioData: {
          incline: 2,
          speed: 10.5,
          minutes: 35,
          distance: 6,
          calories: 420
        }
      }
    ]
  },
    // ========================== JANUARY 2026 DATA (Till Today) ==========================
  // Sunday Jan 18 — REST (skipped)

  // 14. Jan 19 (Mon) - Push
  {
    id: "log_jan26_14",
    date: "2026-01-19",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_1",
        name: "Bench Press",
        sets: [
          { setNumber: 1, reps: 8, weight: 80 },
          { setNumber: 2, reps: 6, weight: 85 },
          { setNumber: 3, reps: 3, weight: 87.5 }
        ]
      },
      {
        exerciseId: "ex_5",
        name: "Overhead Press",
        sets: [
          { setNumber: 1, reps: 8, weight: 50 },
          { setNumber: 2, reps: 6, weight: 52.5 }
        ]
      },
      {
        exerciseId: "ex_9",
        name: "Tricep Pushdown",
        sets: [
          { setNumber: 1, reps: 12, weight: 35 },
          { setNumber: 2, reps: 10, weight: 40 }
        ]
      }
    ]
  },

  // 15. Jan 20 (Tue) - Pull
  {
    id: "log_jan26_15",
    date: "2026-01-20",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_11",
        name: "Lat Pulldown",
        sets: [
          { setNumber: 1, reps: 8, weight: 65 },
          { setNumber: 2, reps: 6, weight: 70 }
        ]
      },
      {
        exerciseId: "ex_12",
        name: "Barbell Row",
        sets: [
          { setNumber: 1, reps: 8, weight: 75 },
          { setNumber: 2, reps: 6, weight: 80 }
        ]
      },
      {
        exerciseId: "ex_4",
        name: "Dumbbell Curl",
        sets: [
          { setNumber: 1, reps: 10, weight: 20 },
          { setNumber: 2, reps: 8, weight: 22 }
        ]
      }
    ]
  },

  // 16. Jan 21 (Wed) - Legs
  {
    id: "log_jan26_16",
    date: "2026-01-21",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_2",
        name: "Squat",
        sets: [
          { setNumber: 1, reps: 5, weight: 125 },
          { setNumber: 2, reps: 3, weight: 130 },
          { setNumber: 3, reps: 2, weight: 135 }
        ]
      },
      {
        exerciseId: "ex_7",
        name: "Leg Press",
        sets: [
          { setNumber: 1, reps: 10, weight: 220 },
          { setNumber: 2, reps: 8, weight: 240 }
        ]
      },
      {
        exerciseId: "ex_14",
        name: "Calf Raise",
        sets: [
          { setNumber: 1, reps: 20, weight: 80 },
          { setNumber: 2, reps: 15, weight: 90 }
        ]
      }
    ]
  },

  // 17. Jan 22 (Thu) - Push (Volume / Accessory)
  {
    id: "log_jan26_17",
    date: "2026-01-22",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_6",
        name: "Incline DB Press",
        sets: [
          { setNumber: 1, reps: 12, weight: 32 },
          { setNumber: 2, reps: 10, weight: 34 }
        ]
      },
      {
        exerciseId: "ex_10",
        name: "Lateral Raise",
        sets: [
          { setNumber: 1, reps: 15, weight: 12 },
          { setNumber: 2, reps: 15, weight: 12 }
        ]
      },
      {
        exerciseId: "ex_9",
        name: "Tricep Pushdown",
        sets: [
          { setNumber: 1, reps: 15, weight: 37.5 },
          { setNumber: 2, reps: 12, weight: 42.5 }
        ]
      }
    ]
  },

  // 18. Jan 23 (Fri) - Pull (Today)
  {
    id: "log_jan26_18",
    date: "2026-01-23",
    userId: "user_123",
    exercises: [
      {
        exerciseId: "ex_11",
        name: "Lat Pulldown",
        sets: [
          { setNumber: 1, reps: 8, weight: 70 },
          { setNumber: 2, reps: 6, weight: 75 }
        ]
      },
      {
        exerciseId: "ex_13",
        name: "Face Pull",
        sets: [
          { setNumber: 1, reps: 15, weight: 32.5 },
          { setNumber: 2, reps: 15, weight: 35 }
        ]
      },
      {
        exerciseId: "ex_4",
        name: "Dumbbell Curl",
        sets: [
          { setNumber: 1, reps: 10, weight: 22 }
        ]
      }
    ]
  }


];