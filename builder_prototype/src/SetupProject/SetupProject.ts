import * as shell from 'shelljs';

export class Project {
	constructor() {}

	setupProject(projectName: string) {
		const projectID = '124';
		const projectDirName = `${projectName}_${projectID}`;
		const targetPathProject = 'bit_backet/' + projectDirName;
		shell.mkdir(targetPathProject);
		shell.cd(targetPathProject);
		shell.exec('npm init -y');
		shell.cd('../../');
		shell.mkdir(targetPathProject + '/controllers');
		shell.mkdir(targetPathProject + '/router');
		return targetPathProject;
	}
}
