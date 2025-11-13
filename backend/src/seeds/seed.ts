import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { Member } from '../members/entities/member.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Membership } from '../memberships/entities/membership.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { AttendanceDevice } from '../attendance-devices/entities/attendance-device.entity';
import { AttendanceLog } from '../attendance-logs/entities/attendance-log.entity';
import { Progress } from '../progress/entities/progress.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { WorkoutProgram } from '../workout-programs/entities/workout-program.entity';
import { WorkoutProgramExercise } from '../workout-program-exercises/entities/workout-program-exercise.entity';
import { WorkoutLog } from '../workout-logs/entities/workout-log.entity';
import { WorkoutLogSet } from '../workout-log-sets/entities/workout-log-set.entity';
import { AiExerciseAnalysis } from '../ai-exercise-analysis/entities/ai-exercise-analysis.entity';
import { AiInsight } from '../ai-insights/entities/ai-insight.entity';

const DEFAULT_DATABASE_URL =
  'postgresql://neondb_owner:npg_RDXSMap62Cyr@ep-green-fire-adbswa69-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
  entities: [
    Organization,
    Member,
    Plan,
    Membership,
    Transaction,
    AttendanceDevice,
    AttendanceLog,
    Progress,
    Exercise,
    WorkoutProgram,
    WorkoutProgramExercise,
    WorkoutLog,
    WorkoutLogSet,
    AiExerciseAnalysis,
    AiInsight,
  ],
  synchronize: false,
  logging: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('📦 Database connection established');
  try {
    await dataSource.synchronize();
    console.log('🛠️ Schema synchronized (ensured tables exist)');
  } catch (syncError) {
    console.warn('⚠️ Schema synchronization skipped', syncError);
  }

  const organizationRepo = dataSource.getRepository(Organization);
  const planRepo = dataSource.getRepository(Plan);
  const memberRepo = dataSource.getRepository(Member);
  const membershipRepo = dataSource.getRepository(Membership);
  const transactionRepo = dataSource.getRepository(Transaction);
  const attendanceDeviceRepo = dataSource.getRepository(AttendanceDevice);
  const attendanceLogRepo = dataSource.getRepository(AttendanceLog);
  const progressRepo = dataSource.getRepository(Progress);
  const exerciseRepo = dataSource.getRepository(Exercise);
  const workoutProgramRepo = dataSource.getRepository(WorkoutProgram);
  const workoutProgramExerciseRepo = dataSource.getRepository(WorkoutProgramExercise);
  const workoutLogRepo = dataSource.getRepository(WorkoutLog);
  const workoutLogSetRepo = dataSource.getRepository(WorkoutLogSet);
  const aiExerciseAnalysisRepo = dataSource.getRepository(AiExerciseAnalysis);
  const aiInsightRepo = dataSource.getRepository(AiInsight);

  const organizations =
    (await organizationRepo.count()) > 0
      ? await organizationRepo.find()
      : await organizationRepo.save(
          organizationRepo.create([
            {
              name: 'Downtown Strength Center',
              owner_id: 101,
              address: '123 Fitness Blvd, Suite 200',
              phone: '555-1000',
            },
            {
              name: 'Peak Performance Lab',
              owner_id: 202,
              address: '987 Athlete Ave, Level 3',
              phone: '555-2000',
            },
          ]),
        );

  const plans =
    (await planRepo.count()) > 0
      ? await planRepo.find({ relations: ['organization'] })
      : await planRepo.save(
          planRepo.create([
            {
              organization: organizations[0],
              name: 'Unlimited Access',
              duration_days: 30,
              price: 99.0,
              description: 'Unlimited classes and open gym access',
            },
            {
              organization: organizations[0],
              name: 'Weekend Warrior',
              duration_days: 30,
              price: 59.0,
              description: 'Friday through Sunday access',
            },
            {
              organization: organizations[1],
              name: 'Elite Coaching',
              duration_days: 60,
              price: 199.0,
              description: 'Includes personal coaching sessions',
            },
          ]),
        );

  const members =
    (await memberRepo.count()) > 0
      ? await memberRepo.find({ relations: ['organization'] })
      : await memberRepo.save(
          memberRepo.create([
            {
              organization: organizations[0],
              first_name: 'Alice',
              last_name: 'Nguyen',
              gender: 'female',
              birth_date: new Date('1990-04-12'),
              phone: '555-1101',
              email: 'alice.nguyen@example.com',
              join_date: new Date('2024-01-10'),
              goal: 'Build strength',
              weight: 65,
              height: 165,
              ai_profile: { preferred_classes: ['Strength', 'Mobility'] },
            },
            {
              organization: organizations[0],
              first_name: 'Marcus',
              last_name: 'Jensen',
              gender: 'male',
              birth_date: new Date('1986-11-03'),
              phone: '555-1102',
              email: 'marcus.jensen@example.com',
              join_date: new Date('2024-03-05'),
              goal: 'Increase endurance',
              weight: 82,
              height: 178,
              ai_profile: { preferred_classes: ['Cardio', 'HIIT'] },
            },
            {
              organization: organizations[1],
              first_name: 'Priya',
              last_name: 'Desai',
              gender: 'female',
              birth_date: new Date('1995-07-22'),
              phone: '555-2203',
              email: 'priya.desai@example.com',
              join_date: new Date('2024-02-15'),
              goal: 'Improve mobility',
              weight: 58,
              height: 160,
              ai_profile: { preferred_classes: ['Yoga', 'Pilates'] },
            },
          ]),
        );

  const memberships =
    (await membershipRepo.count()) > 0
      ? await membershipRepo.find({ relations: ['organization', 'member', 'plan'] })
      : await membershipRepo.save(
          membershipRepo.create([
            {
              organization: organizations[0],
              member: members[0],
              plan: plans[0],
              start_date: new Date('2024-01-10'),
              end_date: new Date('2024-02-09'),
              status: 'active',
              total_amount: 99.0,
              paid_amount: 99.0,
              remaining_amount: 0,
            },
            {
              organization: organizations[0],
              member: members[1],
              plan: plans[1],
              start_date: new Date('2024-03-05'),
              end_date: new Date('2024-04-04'),
              status: 'active',
              total_amount: 59.0,
              paid_amount: 40.0,
              remaining_amount: 19.0,
            },
            {
              organization: organizations[1],
              member: members[2],
              plan: plans[2],
              start_date: new Date('2024-02-15'),
              end_date: new Date('2024-04-15'),
              status: 'cancelled',
              total_amount: 199.0,
              paid_amount: 199.0,
              remaining_amount: 0,
            },
          ]),
        );

  if ((await transactionRepo.count()) === 0) {
    await transactionRepo.save(
      transactionRepo.create([
        {
          organization: organizations[0],
          membership: memberships[0],
          member: members[0],
          type: 'payment',
          category: 'membership',
          description: 'Initial membership payment',
          amount: 99.0,
          currency: 'USD',
          payment_method: 'credit_card',
          status: 'completed',
        },
        {
          organization: organizations[0],
          membership: memberships[1],
          member: members[1],
          type: 'payment',
          category: 'membership',
          description: 'Partial payment for Weekend Warrior plan',
          amount: 40.0,
          currency: 'USD',
          payment_method: 'cash',
          status: 'pending',
        },
        {
          organization: organizations[1],
          membership: memberships[2],
          member: members[2],
          type: 'refund',
          category: 'membership',
          description: 'Refund after plan cancellation',
          amount: 50.0,
          currency: 'USD',
          payment_method: 'credit_card',
          status: 'completed',
        },
      ]),
    );
  }

  const attendanceDevices =
    (await attendanceDeviceRepo.count()) > 0
      ? await attendanceDeviceRepo.find({ relations: ['organization'] })
      : await attendanceDeviceRepo.save(
          attendanceDeviceRepo.create([
            {
              organization: organizations[0],
              name: 'Front Door Scanner',
              serial_number: 'DEV-001-A',
              ip_address: '192.168.1.10',
              status: 'online',
            },
            {
              organization: organizations[1],
              name: 'Studio Entry Pad',
              serial_number: 'DEV-102-B',
              ip_address: '192.168.2.20',
              status: 'maintenance',
            },
          ]),
        );

  if ((await attendanceLogRepo.count()) === 0) {
    await attendanceLogRepo.save(
      attendanceLogRepo.create([
        {
          organization: organizations[0],
          member: members[0],
          device: attendanceDevices[0],
          check_in: new Date('2024-10-01T07:30:00Z'),
          check_out: new Date('2024-10-01T09:00:00Z'),
          status: 'completed',
          notes: 'Morning strength session',
        },
        {
          organization: organizations[0],
          member: members[1],
          device: attendanceDevices[0],
          check_in: new Date('2024-10-05T18:00:00Z'),
          check_out: new Date('2024-10-05T19:15:00Z'),
          status: 'completed',
        },
        {
          organization: organizations[1],
          member: members[2],
          device: attendanceDevices[1],
          check_in: new Date('2024-10-07T06:45:00Z'),
          check_out: new Date('2024-10-07T07:30:00Z'),
          status: 'completed',
          notes: 'Mobility class',
        },
      ]),
    );
  }

  if ((await progressRepo.count()) === 0) {
    await progressRepo.save(
      progressRepo.create([
        {
          member: members[0],
          date: new Date('2024-09-01'),
          weight: 66.5,
          body_fat: 25.4,
          muscle_mass: 45.2,
          ai_feedback: 'Focus on lower body stability.',
        },
        {
          member: members[0],
          date: new Date('2024-10-01'),
          weight: 64.8,
          body_fat: 23.9,
          muscle_mass: 46.1,
          ai_feedback: 'Great progress on strength metrics!',
        },
        {
          member: members[1],
          date: new Date('2024-10-12'),
          weight: 81.2,
          body_fat: 18.3,
          muscle_mass: 52.6,
        },
      ]),
    );
  }

  const exercises =
    (await exerciseRepo.count()) > 0
      ? await exerciseRepo.find()
      : await exerciseRepo.save(
          exerciseRepo.create([
            {
              name: 'Back Squat',
              description: 'Barbell squat focusing on posterior chain.',
              category: 'Strength',
              equipment: 'Barbell',
              instructions:
                'Keep chest up, drive through heels, descend until thighs are parallel to the floor.',
              metadata: { muscle_groups: ['quadriceps', 'glutes'], difficulty: 'intermediate' },
            },
            {
              name: 'Rowing Machine',
              description: 'Cardio workout on a Concept2 rower.',
              category: 'Cardio',
              equipment: 'Rower',
              instructions:
                'Maintain consistent stroke rate, keep back neutral, drive with legs then pull.',
              metadata: { target_heart_rate_zone: '70-80%' },
            },
            {
              name: 'Sun Salutation Flow',
              description: 'Dynamic yoga sequence for flexibility.',
              category: 'Mobility',
              equipment: 'Mat',
              instructions:
                'Move fluidly through poses, synchronize breath with movement, focus on alignment.',
              metadata: { duration_minutes: 10 },
            },
          ]),
        );

  const workoutPrograms =
    (await workoutProgramRepo.count()) > 0
      ? await workoutProgramRepo.find({ relations: ['member'] })
      : await workoutProgramRepo.save(
          workoutProgramRepo.create([
            {
              member: members[0],
              name: 'Strength Foundations',
              goal: 'Improve squat and deadlift totals',
            },
            {
              member: members[1],
              name: 'Endurance Builder',
              goal: 'Boost cardiovascular endurance',
            },
            {
              member: members[2],
              name: 'Mobility Reset',
              goal: 'Enhance joint mobility and stability',
            },
          ]),
        );

  const workoutProgramExercises =
    (await workoutProgramExerciseRepo.count()) > 0
      ? await workoutProgramExerciseRepo.find({
          relations: ['program', 'exercise'],
        })
      : await workoutProgramExerciseRepo.save(
          workoutProgramExerciseRepo.create([
            {
              program: workoutPrograms[0],
              exercise: exercises[0],
              sets: 5,
              reps: 5,
              target_weight: 80,
              day_of_week: 'Monday',
            },
            {
              program: workoutPrograms[1],
              exercise: exercises[1],
              sets: 4,
              reps: 12,
              target_weight: 0,
              day_of_week: 'Wednesday',
            },
            {
              program: workoutPrograms[2],
              exercise: exercises[2],
              sets: 3,
              reps: 8,
              target_weight: 0,
              day_of_week: 'Friday',
            },
          ]),
        );

  const workoutLogs =
    (await workoutLogRepo.count()) > 0
      ? await workoutLogRepo.find({ relations: ['member', 'program'] })
      : await workoutLogRepo.save(
          workoutLogRepo.create([
            {
              member: members[0],
              program: workoutPrograms[0],
              date: new Date('2024-10-01'),
              ai_summary: 'Strong hip drive and stable posture throughout sets.',
            },
            {
              member: members[1],
              program: workoutPrograms[1],
              date: new Date('2024-10-05'),
              ai_summary: 'Consistent pacing, recommend longer warm-up.',
            },
            {
              member: members[2],
              program: workoutPrograms[2],
              date: new Date('2024-10-07'),
              ai_summary: 'Improved flexibility noted in forward fold.',
            },
          ]),
        );

  if ((await workoutLogSetRepo.count()) === 0) {
    await workoutLogSetRepo.save(
      workoutLogSetRepo.create([
        {
          workout_log: workoutLogs[0],
          exercise: exercises[0],
          set_number: 1,
          reps: 5,
          weight: 80,
          rpe: 7.5,
        },
        {
          workout_log: workoutLogs[1],
          exercise: exercises[1],
          set_number: 1,
          reps: 12,
          weight: 0,
          rpe: 6,
        },
        {
          workout_log: workoutLogs[2],
          exercise: exercises[2],
          set_number: 1,
          reps: 8,
          weight: 0,
          rpe: 4,
        },
      ]),
    );
  }

  if ((await aiExerciseAnalysisRepo.count()) === 0) {
    await aiExerciseAnalysisRepo.save(
      aiExerciseAnalysisRepo.create([
        {
          member: members[0],
          workout_log: workoutLogs[0],
          exercise: exercises[0],
          posture_score: 86.5,
          stability_score: 90.2,
          movement_efficiency: 88.1,
          risk_level: 'low',
          detected_errors: [{ set: 3, issue: 'Knee valgus', severity: 'moderate' }],
          recommended_fix: 'Cue "knees out" and use resistance band for warm-up.',
        },
        {
          member: members[1],
          workout_log: workoutLogs[1],
          exercise: exercises[1],
          posture_score: 78.3,
          stability_score: 82.7,
          movement_efficiency: 80.0,
          risk_level: 'medium',
          detected_errors: [{ interval: '500m', issue: 'Rounded shoulders', severity: 'low' }],
          recommended_fix: 'Focus on keeping chest lifted, incorporate thoracic mobility drills.',
        },
        {
          member: members[2],
          workout_log: workoutLogs[2],
          exercise: exercises[2],
          posture_score: 92.1,
          stability_score: 88.9,
          movement_efficiency: 91.4,
          risk_level: 'low',
          detected_errors: [],
          recommended_fix: 'Maintain current routine and monitor weekly.',
        },
      ]),
    );
  }

  if ((await aiInsightRepo.count()) === 0) {
    await aiInsightRepo.save(
      aiInsightRepo.create([
        {
          member: members[0],
          category: 'Strength Progression',
          input_data: { squat_1rm: 110, deadlift_1rm: 145 },
          ai_recommendation: 'Increase accessory work for posterior chain twice per week.',
          predicted_goal_date: new Date('2024-12-01'),
        },
        {
          member: members[1],
          category: 'Endurance Tracking',
          input_data: { '2k_row_time': '07:45', vo2max: 45 },
          ai_recommendation: 'Add one extra low-intensity steady state session weekly.',
          predicted_goal_date: new Date('2025-01-15'),
          risk_alert: 'Monitor knee discomfort reported after long runs.',
        },
        {
          member: members[2],
          category: 'Mobility Focus',
          input_data: { shoulder_flexion: 'Improved', hamstring_test: 'Tightness' },
          ai_recommendation: 'Introduce PNF stretching twice per week.',
          predicted_goal_date: new Date('2024-11-20'),
        },
      ]),
    );
  }

  console.log('✅ Seeding completed');
}

seed()
  .catch(error => {
    console.error('❌ Seeding failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  });

