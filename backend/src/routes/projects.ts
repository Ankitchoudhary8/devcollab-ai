import { Router } from 'express';
import { projects } from '../data/projects.js';

export const projectsRouter = Router();

projectsRouter.get('/', (req, res) => {
  const search = String(req.query.search ?? '').trim().toLowerCase();
  const category = String(req.query.category ?? '').trim().toLowerCase();

  const matches = projects.filter((project) => {
    const text = [project.title, project.summary, ...project.skills].join(' ').toLowerCase();
    return (!search || text.includes(search)) && (!category || project.category.toLowerCase() === category);
  });

  res.json({ projects: matches, total: matches.length, demo: true });
});
