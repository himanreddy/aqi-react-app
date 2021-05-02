import { formatDistance } from 'date-fns';
import React, { FC } from 'react';
import { getAQIIndexType } from '../../services/common';
import { CityAQIData } from '../../types';
import SpeedometerIcon from '../SpeedometerIcon/SpeedometerIcon';

import './AQICard.css';

const AQICard: FC<{details: CityAQIData}> = (props) => {
  return (
    <div className="aqi-parent cursor-pointer">
      <div className="card position-relate">
        <div className="card-body">
          <div className="row mx-0">
            <div className="aqi-icon p-0">
              <div className={`aqi-type flex-column bg-${getAQIIndexType(Number(props.details.aqi))}`}>
                <SpeedometerIcon/>
                <small className="text-white">{Math.round(props.details.aqi)} AQI</small>
              </div>
            </div>
            <div className="col p-0">
              <h5 className="m-0">{props.details.city}</h5>
              <p className="text-custom-secondary m-0"><small><strong>AQI:</strong> <span className={`${getAQIIndexType(Number(props.details.aqi))}`}>{props.details.aqi}</span></small></p>
              <p className="m-0"><small className="text-muted">Updated {formatDistance(props.details.updatedAt, new Date(), {addSuffix: true})}</small></p>
            </div>
          </div>
          <p className="m-0 mt-2 text-bold">Air quality is <span className={`${getAQIIndexType(Number(props.details.aqi))}`}>{getAQIIndexType(Number(props.details.aqi))?.replace('-', ' ')}</span> today.</p>
        </div>
      </div>
    </div>
  )
}

export default AQICard;