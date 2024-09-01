import React, { useEffect, useRef, useState } from 'react';
import { Input, message, Card, Image, Space, Typography } from 'antd';
import searchImage from '../assets/search.png'; 
import clear from '../assets/clear.png';
import humidityIcon from '../assets/humidity.png';
import windIcon from '../assets/wind.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';

const { Title, Text } = Typography;
const { Search } = Input;

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);

  const allIcons = {
    '01d': clear,
    '01n': clear,
    '02d': cloud,
    '02n': cloud,
    '03d': cloud,
    '03n': cloud,
    '04d': drizzle,
    '04n': drizzle,
    '09d': rain,
    '09n': rain,
    '10d': rain,
    '10n': rain,
    '13d': snow,
    '13n': snow,
  };

  const search = async (city) => {
    if (city === '') {
      message.error('Enter city name');
      return;
    } else {
      message.success('Fetching weather data...');
      
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const icon = allIcons[data.weather[0].icon] || clear;
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
        });
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching weather data', error);
      message.error('Failed to fetch weather data');
    }
  };

  useEffect(() => {
    search('Mingora');
  }, []);

  return (
    <div className="weather">
      <div className="search-bar" >
        <Search
          placeholder="Enter city name"
          enterButton="Search"
          size="large"
          onSearch={search}
          ref={inputRef}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {weatherData && (
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Image
            src={weatherData.icon}
            alt="weather-icon"
            preview={false}
            style={{ width: 100, height: 100, margin: 'auto' }}
          />
          <Title level={3}>{weatherData.temperature}&deg;C</Title>
          <Text type="secondary">{weatherData.location}</Text>

          <Space direction="vertical" style={{ marginTop: '20px' }}>
            <Space>
              <Image
                src={humidityIcon}
                alt="humidity"
                width={20}
                preview={false}
              />
              <Text>{weatherData.humidity} % Humidity</Text>
            </Space>
            <Space>
              <Image
                src={windIcon}
                alt="wind"
                width={20}
                preview={false}
              />
              <Text>{weatherData.windSpeed} Km/h Wind Speed</Text>
            </Space>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default Weather;
