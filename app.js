/**
 * Created by sammyroberts on 7/24/17.
 */
//google key is in my dotenv
require("dotenv").config();

//my http request lib TODO create a custom axios instance that automatically sends the headers for me.
const axios = require("axios");

const Nightmare = require('nightmare');
const nightmare = Nightmare();

//navigate to my site wait for the div to load, then get the important data
nightmare.goto("http://www.bjjhq.com/")
.wait(".right>h1")
.evaluate(function () {
    return {
        name: document.querySelector('.right>h1').innerHTML,
        price: document.querySelector('#buyButton>em').innerHTML
    }
})
.end()
.then(function (result) {
    console.log(result);

    //create my GCM request
    const data = {
        "to" : "/topics/bjjhq",
        "notification" : {
            "body" : `${result.name} for ${result.price}`,
            "title" : "New deal from BJJHQ!",
        }
    };

    //send GCM request - this creates the notification on my phone
    axios({
        url: "https://fcm.googleapis.com/fcm/send",
        method: "POST",
        headers: {
            'Authorization': `key=${process.env.FB_GCM_KEY}`,
            "Content-Type": "application/json"
        },
        data: data

    }).then(res => {
        console.log("done", res);
    })
    .catch( err => {
        console.error(err);
    })
});
