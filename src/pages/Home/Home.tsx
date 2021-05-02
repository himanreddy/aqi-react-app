import React, { useState } from 'react';
import Websocket from 'react-websocket';
import AQICard from '../../components/AQICard/AQICard';
import AQILoader from '../../components/AQILoader/AQILoader';
import CityDetails from '../../components/CityDetails/CityDetails';
import { CityAQIData, CityAQIHistory, CityAQIType } from '../../types';

import './Home.css';

const Home = () => {

  const [loadingData, setLoadingData] = useState(true);
  const [aqiHistory, setAqiHistory] = useState([] as CityAQIHistory[]);
  const [aqiData, setAqiData] = useState([] as CityAQIData[]);
  const [selectedCity, setSelectedCity] = useState(null as unknown as CityAQIHistory);
  const [openModal, setOpenModal] = useState(false);

  const handleCityAQIData = (data: string) => {
    setLoadingData(false);
    const parsedData: CityAQIType[] = JSON.parse(data).map((d: CityAQIType) => { d.aqi = Number(Number(d.aqi).toFixed(2)); return d; });
    const mappedData: CityAQIData[] = [...aqiData];
    const historyData: CityAQIHistory[] = [...aqiHistory];
    parsedData.forEach((cityAqi) => {
      const existingCityIndex = mappedData.findIndex((d) => cityAqi.city === d.city);
      const cityHistoryIndex = historyData.findIndex((d) => cityAqi.city === d.city)
      const updatedAt = Date.now();
      if(existingCityIndex > -1 || cityHistoryIndex > -1) {
        if(existingCityIndex > -1) {
          mappedData.splice(existingCityIndex, 1, { ...cityAqi, updatedAt});
        }
        if(cityHistoryIndex > -1) historyData[existingCityIndex].aqiHistory.push({aqi: cityAqi.aqi, updatedAt});
      } else {
        mappedData.push({...cityAqi, updatedAt});
        historyData.push({...cityAqi, aqiHistory: [{aqi: cityAqi.aqi, updatedAt}]});
      }
    });
    setAqiData(mappedData);
    setAqiHistory(historyData);
  }

  return (
    <div className="container py-3 px-1">
      <Websocket url='ws://city-ws.herokuapp.com/' onMessage={handleCityAQIData}/>
      <div className="sticky-top text-center bg-custom-gray py-2">
        <h1>Air Quality Index</h1>
        <p className="text-secondary my-0">Real time data of 12 Indian cities.</p>
      </div>
      <div className="row mx-0 mt-4">
        {
          loadingData ? <AQILoader/>
          : aqiData.map((d, idx) => {
            return (
              <div key={`aqi-card-${idx}`} className="col-12 col-md-6 mb-3 px-3 animate__animated animate__fadeInUp" 
                onClick={(e) => { 
                  const sc = aqiHistory.find((h) => h.city === d.city) as CityAQIHistory;
                  setOpenModal(true);
                  setSelectedCity(sc);
                }}>
                <AQICard details={d}/>
              </div>
            )
          })
        }
      </div>
      <CityDetails open={openModal} cityData={selectedCity} onClose={() => { setOpenModal(false) }}/>
    </div>
  );
}

export default Home;