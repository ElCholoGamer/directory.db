# directory.db

Flexible, elegant and blazing-fast data storage.

## Installation

Using npm:

```
$ npm i directory.db
```

Using Yarn:

```
$ yarn add directory.db
```

## Example usage

```js
import FolderDB from 'directory.db'; // ES Module
const FolderDB = require('directory.db').default; // CommonJS

// Create a database
const db = new FolderDB('./storage/user_data');

// Get a collection from the database
const users = db.getCollection('users');

// Get a document by UUID
const someUser = users.findByUUID('ee5dc2da-3211-4894-b0bb-7bb03fc1d0a0');
const username = someUser.get('username'); // Get a document property

// Get all documents that match a filter
const dogOwners = users.find({ pet: 'dog' });

// Insert a new document
const newUser = users.insertNew();
newUser.set('username', 'Deez_Nuts');
newUser.set('password', '123456');
newUser.set('pet', 'cat');
```
