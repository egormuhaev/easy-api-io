import { Project } from './SetupProject/SetupProject';

const pr = new Project();

const targetPath = pr.setupProject('project_1');

console.log(targetPath);
