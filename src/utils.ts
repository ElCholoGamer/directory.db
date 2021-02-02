import { existsSync, mkdirSync, statSync } from 'fs';

export function checkDir(dir: string): boolean {
	const exists = existsSync(dir);
	if (exists) {
		const stat = statSync(dir);
		if (stat.isDirectory()) return false;
	}

	mkdirSync(dir);
	return true;
}

export function validateFolder(folder: string) {
	if (/[^a-z0-9_-{}()]/i.test(folder))
		throw new Error(`Invalid folder name: "${folder}"`);
}
