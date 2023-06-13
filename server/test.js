const getToken = require('./getToken.js');

getToken().then((data) => {
  console.log(data); // Log the resolved value of the Promise
}).catch((error) => {
  console.error(error); // Log any errors that occurred
});
