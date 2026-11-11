export type Project = {
  id: number;
  title: string;
  summary: string;
  category: string;
  skills: string[];
  openRoles: number;
  teamSize: number;
  stage: 'Planning' | 'Building' | 'Testing';
  owner: string;
};

// Demo-only data for Phase 1. Replace with Prisma + PostgreSQL in Phase 2.
export const projects: Project[] = [
  { id: 1, title: 'Campus Navigation Assistant', summary: 'Accessible wayfinding and building discovery for university students.', category: 'AI & Data', skills: ['React', 'Python', 'Maps'], openRoles: 2, teamSize: 3, stage: 'Building', owner: 'Student developer' },
  { id: 2, title: 'Urban Garden IoT', summary: 'Smart sensors that help small urban farms monitor water and soil health.', category: 'IoT', skills: ['Arduino', 'Node.js', 'PostgreSQL'], openRoles: 3, teamSize: 2, stage: 'Planning', owner: 'Student innovator' },
  { id: 3, title: 'Study Sprint', summary: 'A collaborative study planner with focused sessions and accountability.', category: 'Web Apps', skills: ['TypeScript', 'React', 'Express'], openRoles: 1, teamSize: 4, stage: 'Testing', owner: 'Student creator' },
  { id: 4, title: 'Open Source Skill Map', summary: 'Discover beginner-friendly GitHub projects based on technology interests.', category: 'Developer Tools', skills: ['GitHub API', 'Node.js', 'UI/UX'], openRoles: 2, teamSize: 2, stage: 'Building', owner: 'Student maintainer' },
];
