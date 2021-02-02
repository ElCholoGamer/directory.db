import { existsSync, mkdirSync, readdirSync, rmdirSync, rmSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { checkDir, validateFolder } from '../utils';
import Collection from './collection';

class Document {
	public readonly uuid: string;
	public readonly directory: string;

	public constructor(public readonly collection: Collection, uuid?: string) {
		this.uuid = uuid ?? uuidv4();
		this.directory = join(collection.directory, this.uuid);

		checkDir(this.directory);
	}

	public set(key: string, value: string) {
		validateFolder(value);
		const folder = join(this.directory, key);

		// Remove existing stuff
		if (!checkDir(folder)) {
			const inside = readdirSync(folder);
			inside.forEach(file => rmdirSync(join(folder, file)));
		}

		mkdirSync(join(folder, value));

		return this;
	}

	public get(key: string): string | undefined {
		const folder = join(this.directory, key);
		if (!checkDir(folder)) return undefined;

		const [value] = readdirSync(folder);
		return value;
	}

	public has(key: string): boolean {
		const folder = join(this.directory, key);
		const inside = readdirSync(folder);

		return inside.length > 0;
	}

	public delete(key: string): boolean {
		const folder = join(this.directory, key);
		if (!existsSync(folder)) return false;

		rmSync(folder, { recursive: true, force: true });
		return true;
	}

	public get size(): number {
		const files = readdirSync(this.directory);
		return files.length;
	}
}

export default Document;
