import { join } from 'path';
import DJSCollection from '@discordjs/collection';
import FolderDB from './folder-db';
import Document from './document';
import { checkDir, validateFolder } from '../utils';
import { readdirSync } from 'fs';

class Collection {
	public readonly directory: string;
	private _documents = new DJSCollection<string, Document>();

	public constructor(
		public readonly db: FolderDB,
		public readonly name: string
	) {
		validateFolder(name);

		this.directory = join(db.baseDirectory, name);
		checkDir(this.directory);

		// Load existing documents
		const docFolders = readdirSync(this.directory);
		for (const uuid of docFolders) {
			const doc = new Document(this, uuid);
			const docFields = readdirSync(doc.directory);

			for (const key of docFields) {
				const [value] = readdirSync(join(doc.directory, key));
				doc.set(key, value);
			}

			this.insertNew(doc);
		}
	}

	private _arrayFilter(filter: Record<string, string>) {
		const keys = Object.keys(filter);
		return (doc: Document) =>
			keys.every(key => doc.has(key) && doc.get(key) === filter[key]);
	}

	public find(filter: Record<string, string> = {}): Document[] {
		return this._documents.filter(this._arrayFilter(filter)).array();
	}

	public findOne(filter: Record<string, string> = {}) {
		return this._documents.find(this._arrayFilter(filter));
	}

	public findByUUID(uuid: string) {
		return this._documents.get(uuid);
	}

	public insertNew(document?: Document): Document {
		document ||= new Document(this);

		if (this._documents.has(document.uuid))
			throw new Error('Document already exists');

		this._documents.set(document.uuid, document);
		return document;
	}

	public deleteOne(filter: Record<string, string>): boolean {
		const uuid = this._documents.findKey(this._arrayFilter(filter));
		if (uuid === undefined) return false;

		return this._documents.delete(uuid);
	}

	public deleteMany(filter: Record<string, string>): number {
		return this._documents.sweep(this._arrayFilter(filter));
	}

	public get size() {
		return this._documents.size;
	}
}

export default Collection;
