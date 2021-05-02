import { format } from 'date-fns';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Chart from 'react-google-charts';
import { CityAQIHistory } from '../../types';
import AQILoader from '../AQILoader/AQILoader';

const CityDetails: FC<{open: boolean, cityData: CityAQIHistory, onClose: Function}> = (props) => {
  
  const ref = useRef();
  const [show, setShow] = useState(false);
  const [chartData, setChartData] = useState([] as any);

  useEffect(() => {
    setShow(props.open);
    if(props.open) {
      generateChartData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  const generateChartData = () => {
    const dupCount:any = {};
    const mappedData = props.cityData.aqiHistory.map((d) => {
      return [format(d.updatedAt, "eeee"), d.aqi];
    }).reduce((acc, curr) => {
      const cidx = acc.findIndex((c) => c[0] === curr[0]);
      dupCount[curr[0]] = dupCount[curr[0]] === undefined ? 0 : dupCount[curr[0]];
      if(cidx > -1) {
        const c = acc[cidx];
        c[1] = (c[1] as number) + (curr[1] as number);
        acc.splice(cidx, 1, c);
      } else {
        acc.push(curr);
      }
      dupCount[curr[0]]++;
      return acc;
    }, [] as Array<Array<string | number>>).map((e) => {
      e[1] = (e[1] as number)/dupCount[e[0]];
      return e;
    });
    mappedData.unshift(['Day', 'AQI']);
    setChartData(mappedData);
  }

  return (
    <>
      <Modal ref={ref} show={show} onHide={props.onClose} centered={true} size="lg">
        <Modal.Body>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="text-center py-2 mb-3">
              <h4>{props.cityData ? props.cityData.city : 'City'}'s Air Quality Index</h4>
            </div>
            <Chart
              width={'500px'}
              height={'300px'}
              chartType="Bar"
              loader={<AQILoader/>}
              data={chartData}
              options={{
                // Material design options
                chart: {
                  
                },
                legend: { position: "none" },
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={() => props.onClose()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CityDetails;