const asyncRequest = require('async-request');
const express = require('express');
const port = 7000;
const path = require('path');
const hbs = require('hbs');

const app = express();

const getInfoWeather = async location => {
	const API_KEY = '1ef9141883ee2eaa2dbb49fe526e489b';
	const url = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${location}`;
	try {
		const res = await asyncRequest(url);
		const { location, current } = JSON.parse(res.body);
		return {
			isSuccess: true,
			region: location.region,
			country: location.country,
			temperature: current.temperature,
			wind_speed: current.wind_speed,
			precip: current.precip,
			cloudcover: current.cloudcover,
		};
	} catch (error) {
		return {
			isSuccess: false,
			error,
		};
	}
};

const pathImg = path.join(__dirname, './public');

app.use(express.static(pathImg));

app.get('/', async (req, res) => {
	const location = req.query.address;
	const weather = await getInfoWeather(location);
	if (location) {
		res.render('weather', {
			status: true,
			region: weather.region,
			country: weather.country,
			temperature: weather.temperature,
			wind_speed: weather.wind_speed,
			precip: weather.precip,
			cloudcover: weather.cloudcover,
		});
	} else {
		res.render('weather', {
			status: false,
		});
	}
});

app.set('view engine', 'hbs');

app.listen(port, () => {
	console.log('hello world');
});
