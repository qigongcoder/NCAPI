const app = require("./app.js");
const { PORT = 9090 } = process.env;

app.listen(PORT, (error) =>{

    if (error){
        console.log(error);
    }else{
        console.log(`Listening on ${PORT}...`)
    }
});