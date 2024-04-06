const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const cityList = require(__dirname + '/city-list.json');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/background', (req, res) => {
    res.sendFile(__dirname + "/background.jpg")
})

app.post('/cities', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(cityList);
})

app.post('/', (req, res) => {
    const apiKey = "60ba2350fa72c6ca9c2b67a1adca4522";
    const city = req.body.city;
    const units = "metric";

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}&units=${units}`;

    https.get(apiUrl, (response) => {
        response.on('data', (data) => {
            const weatherData = JSON.parse(data);

            if (response.statusCode === 200) {
                const temp = weatherData.main.temp;
                const desc = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imgUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                
                res.set('Content-Type', 'text/html');
                res.write(`
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Weather App</title>
                    <style>
                      * {
                        padding: 0;
                        margin: 0;
                        box-sizing: border-box;
                      }
                      body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        min-height: 100vh;
                        max-width: 100vw;
                        position: relative;
                        font-family: sans-serif;
                      }
                      div.background {
                        position: absolute;
                        top: 0;
                        left: 0;
                        overflow: hidden;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: -1;
                
                        img {
                          width: 100%;
                          min-width: 100vw;
                          min-height: 100vh;
                          min-width: 100vw;
                          min-height: 100vh;
                        }
                      }
                      .container {
                        backdrop-filter: blur(10px);
                        padding: 50px;
                        border-radius: 50px;
                        box-shadow: 0px 0px 10px -5px;
                        max-width: 400px;
                        text-align: center;
                
                        h1 {
                          margin-bottom: 50px;
                        }
                
                        form {
                          display: flex;
                          flex-direction: column;
                          width: 400px;
                
                          label {
                            margin-bottom: 10px;
                            font-weight: 500;
                          }
                
                          input {
                            width: 100%;
                            padding: 10px;
                            border-radius: 10px;
                            border: 1px solid rgba(0, 0, 0, 0.2);
                
                            &:focus {
                              outline: none;
                            }
                          }
                
                          div#city {
                            max-height: 200px;
                            max-width: 100%;
                            overflow-y: auto;
                            background: #6eb2b96b;
                            border-radius: 10px;
                            scrollbar-width: thin;
                            display: flex;
                            flex-direction: column;
                            align-items: start;
                            padding: 0 10px;
                
                            p {
                              width: 100%;
                              padding: 2.5px 0;
                              margin: 2.5px 0;
                              border-bottom: 1px solid #dfdfdf;
                              cursor: pointer;
                            }
                          }
                
                          button {
                            width: 50%;
                            padding: 10px;
                            border: none;
                            border-radius: 50px;
                            background-color: gold;
                            margin: 30px auto 0;
                            font-size: 1.15rem;
                            font-weight: 900;
                            box-shadow: 0 0 10px #818181;
                            cursor: pointer;
                          }
                        }
                      }
                    </style>
                  </head>
                  <body>
                    <div class="background">
                      <img src="/background" alt="background" />
                    </div>
                    <div class="container">
                      <h1>Weather Application</h1>
                      <h3>The Weather is currently ${desc}.</h3>
                        <h1>The Temperature in ${city} is ${temp} deg celesius.</h1>
                        <div><img src="${imgUrl}" alt="weather icon" /></div>
                        <a href="/">Explore other Cities ;)</a>
                    </div>
                  </body>
                </html>
                `)
                res.send()
            } else {
                res.write(`<h1>The City is not valid :(</h1>`);
                res.write(`<a href="/">Try again ;)</a>`)
    
                res.send()
            }
        })
    })
})

app.listen(8080, (err) => {
    if (err) throw err;
})