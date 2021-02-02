import { resolve } from 'path';
import { checkDir, validateFolder } from '../utils';
import Collection from './collection';

class FolderDB {
	public readonly baseDirectory: string;

	private readonly _collections = new Map<string, Collection>();

	public constructor(baseDirectory: string) {
		this.baseDirectory = resolve(baseDirectory);
		checkDir(this.baseDirectory);
	}

	public getCollection(name: string): Collection {
		validateFolder(name);
		return this._collections.get(name) ?? new Collection(this, name);
	}

	public removeCollection(name: string): boolean {
		return this._collections.delete(name);
	}
}

export default FolderDB;
