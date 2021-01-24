const signUpController = require("./routes/signUp/signUp.controller")

indexedDB.js => signUpController.router =>signUpController.controller =>signUpController.service(DB operations)






const test1 = await function(returns result of db operation);// promise(pending)
const test2 = fucntion(writes into DB test1 result); //writing into db const test1= promise(undfined).......does line 11 wait for line 10?

test1= promise(pending)