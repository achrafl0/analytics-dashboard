const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Settings
const SERVER_PORT = 5000; // Listening port
const REQUEST_SUCCESS_RATE = 1; // Optional challenge: set this to have requests to backend randomly failing

// Load data

// Client Information
const clientData = require('./data/clients.json');

// Raw data
const audienceData = new Map([
  [0, require('./data/audience1.json')],
  [1, require('./data/audience2.json')],
  [2, { audience: [] }],
]);

const bandwidthData = new Map([
  [0, require('./data/bandwidth1.json')],
  [1, require('./data/bandwidth2.json')],
  [2, { cdn: [], p2p: [] }],
]);

const streamData = new Map([
  [0, require('./data/streams1.json')],
  [1, require('./data/streams2.json')],
  [2, []],
]);

const notificationData = require('./data/notifications.json');
let countryData = require('./data/country.json');
let ispData = require('./data/isp.json');
let platformData = require('./data/platform.json');

console.log('[INIT] Loaded data...');

// Process data

// Shift all audience timestamps to end on Date.now() instead
const nowTimestamp = Date.now();
for (const data of audienceData.values()) {
  // Calculate time offset
  const lastEntry = data.audience.slice(-1)[0];
  if (lastEntry != null) {
    const offset = nowTimestamp - lastEntry[0];
    // Shift all timestamps
    for (const entry of data.audience) {
      entry[0] += offset;
    }
  }
}

// Shift all bandwidth timestamp to end on Date.now() instead
for (const data of bandwidthData.values()) {
  for (const subkey of ['cdn', 'p2p']) {
    // Calculate time offset
    const dataArray = data[subkey];
    const lastEntry = dataArray.slice(-1)[0];
    if (lastEntry) {
      const offset = nowTimestamp - lastEntry[0];
      // Shift all timestamps
      for (const entry of dataArray) {
        entry[0] += offset;
      }
    }
  }
}


// Remove unused fields from raw data
countryData = countryData.map((entry) => {
  return {
    cdn: entry.cdn,
    p2p: entry.p2p,
    country: entry.country,
  };
});

ispData = ispData.map((entry) => {
  return {
    cdn: entry.cdn,
    p2p: entry.p2p,
    isp: entry.isp,
  }
});

platformData = platformData.map((entry) => {
  return {
    platform: entry.platform,
    cdn: entry.cdn,
    p2p: entry.p2p,
    upload: entry.upload,
    max_viewers: entry.maxViewers,
    average_viewers: entry.averageViewers,
  }
});

// Filter data on each key
for (const key of streamData.keys()) {
  const rawData = streamData.get(key);
  const processedData = rawData.map((entry) => {
    return {
      cdn: entry.cdn,
      p2p: entry.p2p,
      manifest: entry.manifest,
      max_viewers: entry.maxViewers,
      average_viewers: entry.averageViewers,
    };
  });
  streamData.set(key, processedData);
}

console.log('[INIT] Processed data...');
console.log('[INFO] Finished processing data, data available from ' + `${new Date(audienceData.get(0).audience[0][0]).toString()}` + ' to ' + `${new Date(Date.now()).toString()}`);

// Failure dice rollin'
function rollDice() {
  return Math.random() < REQUEST_SUCCESS_RATE;
}

// Initialize initial server states
const authMap = new Map();
const userSet = new Set();

// Handling request routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.send('<pre>Check out README.md for more details on this mock backend server :D</pre>');
  console.log('GET, / 200');
});

// Authhentication route
app.post('/auth', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /auth 503');
    return;
  }

  // Check parameters
  if (!request.body.identifiant || !request.body.password) {
    response.status(400).send();
    console.log('POST, /auth 400');
    return;
  }

  // Authenticate user
  const userData = clientData[request.body.identifiant];
  if (userData && userData.password === request.body.password) {
    // Check if user has already logged in
    if (userSet.has(request.body.identifiant)) {
      response.status(403).send("User already logged in");
      console.log('POST, /auth 403');
      return;
    }

    // Generate and store token
    const token = Math.round(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);

    // Add user to authentication map
    authMap.set(token, request.body.identifiant);
    userSet.add(request.body.identifiant);

    // Return token to User
    response.send({ session_token: token });
  } else {
    response.status(404).send();
    console.log('POST, /auth 404');
  }
});

// Logout route
app.post('/logout', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /logout 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token) {
    response.status(400).send();
    console.log('POST, /logout 400');
    return;
  }

  // End the session
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    userSet.delete(userId);
    authMap.delete(request.body.session_token);
    response.send();
  } else {
    response.status(403).send();
    console.log('POST, /logout 403');
  }
});

// User info route
app.post('/myinfo', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /myinfo 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token) {
    response.status(400).send();
    console.log('POST, /myinfo 400');
    return;
  }

  // Extract and return user information
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    // Remove undesired fields
    const clientDataClone = JSON.parse(JSON.stringify(clientData[userId]));
    for (const fieldname of ['password']) {
      delete clientDataClone.password;
    }
    response.send(clientDataClone);
  } else {
    response.status(403).send();
    console.log('POST, /myinfo 403');
  }
});

// Password update route
app.post('/updatepwd', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /updatepwd 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token || !request.body.old_password || !request.body.new_password) {
    response.status(400).send();
    console.log('POST, /updatepwd 400');
    return;
  }

  // Check session validity
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    // Check old password
    const userData = clientData[userId];
    if (userData.password === request.body.old_password) {
      // We are pretty sure this is the right guy, change his password
      userData.password = request.body.new_password;
      response.send();
    } else {
      response.status(400).send("Bad old password");
      console.log('POST, /updatepwd 403');
    }
  } else {
    response.status(403).send();
    console.log('POST, /updatepwd 403');
  }
});

// User profile update route
app.post('/updateinfo', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /updateinfo 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token) {
    response.status(400).send();
    console.log('POST, /updateinfo 400');
    return;
  }

  // Check session validity
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    // We are pretty sure this is the right guy, update his profile
    const allowedNames = new Set(['company', 'fname', 'lname', 'email', 'website', 'description']);
    const userData = clientData[userId];
    for (const key of Object.keys(request.body)) {
      if (allowedNames.has(key)) {
        userData[key] = request.body[key];
      }
    }
    response.send();
  } else {
    response.status(403).send();
    console.log('POST, /updateinfo 403');
  }
});

// User notification routes
app.post('/notifications', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /notifications 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token) {
    response.status(400).send();
    console.log('POST, /notifications 400');
    return;
  }

  // Check session validity
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    response.send(notificationData[clientData[userId].clientid]);
  } else {
    response.status(403).send();
    console.log('POST, /notifications 403');
  }
});

// Same-for-all users data route

// Stats by country
app.post('/countries', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /countries 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token) {
    response.status(400).send();
    console.log('POST, /countries 400');
    return;
  }

  // Check session validity
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    response.send(countryData);
  } else {
    response.status(403).send();
    console.log('POST, /countries 403');
  }
});

// Stats by ISP
app.post('/isps', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /isps 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token) {
    response.status(400).send();
    console.log('POST, /isps 400');
    return;
  }

  // Check session validity
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    response.send(ispData);
  } else {
    response.status(403).send();
    console.log('POST, /isps 403');
  }
});

// Stats by platform
app.post('/platforms', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /platforms 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token) {
    response.status(400).send();
    console.log('POST, /platforms 400');
    return;
  }

  // Check session validity
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    response.send(platformData);
  } else {
    response.status(403).send();
    console.log('POST, /platforms 403');
  }
});

// Stats by stream
app.post('/streams', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /streams 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token) {
    response.status(400).send();
    console.log('POST, /streams 400');
    return;
  }

  // Check session validity
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    response.send(streamData.get(clientData[userId].clientid));
  } else {
    response.status(403).send();
    console.log('POST, /streams 403');
  }
});

// Sliced bandwidth
app.post('/bandwidth', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /bandwidth 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token || !request.body.from || !request.body.to) {
    response.status(400).send();
    console.log('POST, /bandwidth 400');
    return;
  }

  // Check session validity
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    // Slice out the data we need"
    const wholeData = bandwidthData.get(clientData[userId].clientid);
    const fromTimestamp = request.body.from;
    const toTimestamp = request.body.to;
    const slicedData = { cdn: [], p2p: []};
    for (const key of ['cdn', 'p2p']) {
      for (const entry of wholeData[key]) {
        if (entry[0] >= fromTimestamp && entry[0] <= toTimestamp) {
          slicedData[key].push(entry);
        }
      }
    }

    // Different responses depending on aggregation (or not)
    if (!request.body.aggregate) {
      response.send(slicedData);
    } else {
      if (slicedData.cdn.length === 0 || slicedData.p2p.length === 0) {
        response.status(404).send("No data available in requested time range");
        console.log('POST, /bandwidth 404');
        return;
      }

      let aggregateFunc;
      switch (request.body.aggregate) {
        case 'sum':
          aggregateFunc = (arr) => {
            return arr.reduce((accumulator, value) => {
              return accumulator + value;
            }, 0);
          };
          break;
        case 'max':
          aggregateFunc = (arr) => {
            return arr.reduce((accumulator, value) => {
              return accumulator < value ? value : accumulator;
            }, Number.MIN_SAFE_INTEGER);
          };
          break;
        case 'min':
        aggregateFunc = (arr) => {
          return arr.reduce((accumulator, value) => {
            return accumulator > value ? value : accumulator;
          }, Number.MAX_SAFE_INTEGER);
        };
          break;
        case 'average':
          aggregateFunc = (arr) => {
            return arr.length ? arr.reduce((accumulator, value) => {
              return accumulator + value;
            }, 0) / arr.length : 0;
          };
          break;
        default:
          response.status(403).send();
          console.log('POST, /bandwidth 403');
          return;
      }
      response.send({
        cdn: aggregateFunc(slicedData.cdn.map((entry) => entry[1])),
        p2p: aggregateFunc(slicedData.p2p.map((entry) => entry[1])),
      });
    }
  } else {
    response.status(403).send();
    console.log('POST, /bandwidth 403');
  }
});

// Sliced audience
app.post('/audience', (request, response) => {
  // Dice of death
  if (!rollDice()) {
    response.status(503).send("Server failure");
    console.log('POST, /audience 503');
    return;
  }

  // Check parameters
  if (!request.body.session_token || !request.body.from || !request.body.to) {
    response.status(400).send();
    console.log('POST, /audience 400');
    return;
  }

  // Check session validity
  const userId = authMap.get(request.body.session_token);
  if (userId) {
    // Slice out the data we need
    const wholeData = audienceData.get(clientData[userId].clientid);
    const fromTimestamp = request.body.from;
    const toTimestamp = request.body.to;
    const slicedData = { audience: [] };
    for (const key of ['audience']) {
      for (const entry of wholeData[key]) {
        if (entry[0] >= fromTimestamp && entry[0] <= toTimestamp) {
          slicedData[key].push(entry);
        }
      }
    }

    // Different responses depending on aggregation (or not)
    if (!request.body.aggregate) {
      response.send(slicedData);
    } else {
      if (slicedData.audience.length === 0) {
        response.status(404).send("No data available in requested time range");
        console.log('POST, /audience 404');
        return;
      }

      let aggregateFunc;
      switch (request.body.aggregate) {
        case 'sum':
          aggregateFunc = (arr) => {
            return arr.reduce((accumulator, value) => {
              return accumulator + value;
            }, 0);
          };
          break;
        case 'max':
          aggregateFunc = (arr) => {
            return arr.reduce((accumulator, value) => {
              return accumulator < value ? value : accumulator;
            }, Number.MIN_SAFE_INTEGER);
          };
          break;
        case 'min':
        aggregateFunc = (arr) => {
          return arr.reduce((accumulator, value) => {
            return accumulator > value ? value : accumulator;
          }, Number.MAX_SAFE_INTEGER);
        };
          break;
        case 'average':
          aggregateFunc = (arr) => {
            return arr.length ? arr.reduce((accumulator, value) => {
              return accumulator + value;
            }, 0) / arr.length : 0;
          };
          break;
        default:
          response.status(403).send();
          console.log('POST, /audience 403');
          return;
      }
      response.send({
        audience: aggregateFunc(slicedData.audience.map((entry) => entry[1])),
      });
    }
  } else {
    response.status(403).send();
    console.log('POST, /audience 403');
  }
});

// Start listen to requests
app.listen(SERVER_PORT, () => {
  console.log(`[INFO] Mock Streamroot API rock and rollin' at port ${SERVER_PORT}!!!`);
});
