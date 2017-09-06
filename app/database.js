const Realm = require('realm')
let uuidv4 = require('uuid/v4')

let PostSchema = {
  name: 'Post',
  properties: {
    timestamp: 'date',
    title: 'string',
    content: 'string'
  }
}

let UsersSchema = {
  name: 'User',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    username: 'string',
    age: 'int',
    role: 'string',
    created_at: 'date'
  }
}

let schema = [PostSchema, UsersSchema]

console.log('#### DATABSE ####')
// #### The 'new' should be placed to create Realm connection.
// https://realm.io/docs/javascript/latest/
//
// ===> Setting dbPath = 'database.realm' creates database file
//       at project directory while debug.
//       The location is not at the same location as this database.js src.
//
// ===> After making electronquickstart.app with npm run release,
//      the app halts with error.
//
//      terminating with uncaught exception of type
//    realm::util::File::PermissionDenied: make_dir() failed: Permission denied
//
// ===> Change current working directory of the launched app to userData.
//
/*
const electron = require('electron')
const app = electron.app
let userData = app.getPath('userData')
// #############################################
// https://github.com/realm/realm-js/issues/818
process.chdir(userData)
// #############################################
const path = require('path')
let dbPath = path.join(userData, 'database.realm')
console.log('Database Path', dbPath)
// /Users/codepropagator/Library/Application Support/electronquickstart/database.realm
*/

let dbPath = 'default.realm'

let testDB = (path) => {
  dbPath = path
  // Synchronously open the Realm at first.
  let realm = new Realm({
    path: dbPath,
    schema: schema
  })

  // Observe Realm Notifications
  realm.addListener('change', () => {
    console.log('### realm changed')
  })

  // ..later remove the listener
  // realm.removeListener('change', ...)

  // ..or unregister all listeners
  // realm.removeAllListeners()

  let posts = realm.objects('Post').sorted('timestamp', true)

  posts.addListener((arr, changes) => {
    console.log('posts changed')

    // Update UI in response to inserted objects
    changes.insertions.forEach((index) => {
      let inserted = arr[index]
      console.log('---> inserted', inserted)
    })
    // Update UI in response to modified objects
    changes.modifications.forEach((index) => {
      let modified = arr[index]
      console.log('---> modified', modified)
    })
    // Update UI in response to deleted objects
    changes.deletions.forEach((index) => {
      // Deleted objects cannot be accessed directly
      // Support for accessing deleted objects coming soon...
      console.log('---> deleted')
    })
  })

  let users = realm.objects('User').sorted('created_at', true)

  users.addListener((arr, changes) => {
    console.log('users changed')

    // Update UI in response to inserted objects
    changes.insertions.forEach((index) => {
      let inserted = arr[index]
      console.log('---> inserted', inserted)
    })
    // Update UI in response to modified objects
    changes.modifications.forEach((index) => {
      let modified = arr[index]
      console.log('---> modified', modified)
    })
    // Update UI in response to deleted objects
    changes.deletions.forEach((index) => {
      // Deleted objects cannot be accessed directly
      // Support for accessing deleted objects coming soon...
      console.log('---> deleted')
    })
  })

  // Do someting with database.
  let getBlog = () => {
    return {
      posts: posts,
      users: users
    }
  }

  let putPost = (title, content, timestamp) => {
    realm.write(() => {
      realm.create('Post', {
        title: title,
        content: content,
        timestamp: timestamp
      })
    })
  }

  let putUser = (username, age, role, timestamp) => {
    // Take care of primary key so that not to get error.
    // Error: Attempting to create an object of type 'User' with an existing primary key value.
    // https://www.npmjs.com/package/uuid
    realm.write(() => {
      realm.create('User', {
        uuid: uuidv4(),
        username: username,
        age: age,
        role: role,
        created_at: timestamp
      })
    })
  }

  let myAsyncTask1 = async () => {
    try {
      const res = await (() => {
        return new Promise(
          (resolve, reject) => {
            try {
              let timestamp = new Date()
              putPost('Test', 'Hello. Electron can handle Realm for JavaScript!', timestamp)
              putUser('Me', 3, 'user', timestamp)
              return console.log(resolve('Task1 OK'))
            } catch (err) {
              return reject(err)
            }
          }
        )
      })()

      return console.log('DONE myAsyncTask1', res)
    } catch (err) {
      return console.error('ERROR in myAsyncTask1', err)
    }
  }

  let myAsyncTask2 = async () => {
    try {
      const res = await (() => {
        return new Promise(
          (resolve, reject) => {
            try {
              let blog = getBlog()
              /*
              blog.posts.forEach((post) => {
                console.log('POST', post)
              })
              blog.users.forEach((user) => {
                console.log('USER', user)
              })
              */
              console.log('blog.posts.length', blog.posts.length)
              console.log('blog.users.length', blog.users.length)
              return console.log(resolve('Task2 OK'))
            } catch (err) {
              return reject(err)
            }
          }
        )
      })()

      return console.log('DONE myAsyncTask2', res)
    } catch (err) {
      return console.error('ERROR in myAsyncTask2', err)
    }
  }

  myAsyncTask1().catch((err) => {
    console.log('CAUGHT ERROR', err)
  })

  myAsyncTask2().catch((err) => {
    console.log('CAUGHT ERROR', err)
  })
}

let allData = (path) => {
  dbPath = path
  // Synchronously open the Realm at first.
  let realm = new Realm({
    path: dbPath,
    schema: schema
  })

  let posts = realm.objects('Post').sorted('timestamp', true)
  let users = realm.objects('User').sorted('created_at', true)

  let blog = {
    posts: posts,
    users: users
  }

  return blog
}

let subscribeChange = (path, monitor) => {
  dbPath = path
  // Synchronously open the Realm at first.
  let realm = new Realm({
    path: dbPath,
    schema: schema
  })

  realm.addListener('change', monitor)
}

let unsubscribeChange = (path, monitor) => {
  dbPath = path
  // Synchronously open the Realm at first.
  let realm = new Realm({
    path: dbPath,
    schema: schema
  })

  realm.removeListener('change', monitor)
}

module.exports.dbPath = dbPath
module.exports.testDB = testDB
module.exports.allData = allData
module.exports.subscribeChange = subscribeChange
module.exports.unsubscribeChange = unsubscribeChange
