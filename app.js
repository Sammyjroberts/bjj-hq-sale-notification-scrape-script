/**
 * Created by sammyroberts on 7/24/17.
 */
require("dotenv").config();
const axios = require("axios");
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

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
    const data = {
        "to" : "/topics/bjjhq",
        "notification" : {
            "body" : `${result.name} for ${result.price}`,
            "title" : "New deal from BJJHQ!",
        }
    };
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
