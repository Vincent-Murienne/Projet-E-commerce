import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import { Data } from "../../../services/api";
import { ToastQueue } from "@react-spectrum/toast";


const TrackSales = () => {

    const getDateStartEnd = () => {
        const date_end = new Date();
        date_end.setDate(date_end.getDate() - getWeekChart1*7);
        const date_end_string = date_end.getDate() + "/" + (date_end.getMonth()+1) + "/" + date_end.getFullYear() + " 23:59:59";
    
        const date_start = new Date();
        date_start.setDate(date_end.getDate() - 6);
        const date_start_string = date_start.getDate() + "/" + (date_start.getMonth()+1) + "/" + date_start.getFullYear() + " 00:00:00";
        
        return [date_start, date_start_string, date_end, date_end_string];
    };

    const getDateArray = (date_start) => {
        const array = [];
        for(let i = 0; i < 7; i++) {
            let day = date_start.getDate().toString();
            let month = (date_start.getMonth()+1).toString();
            let year = date_start.getFullYear();
    
            array.push(((day.length === 1) ? "0" + day : day) + "/" + ((month.length === 1) ? "0" + month : month) + "/" + year);
            date_start.setDate(date_start.getDate() + 1);
        };
    
        return array;
    };

    // Initialisation of use states
    const echartsDom = useRef(null);
    const [getWeekChart1, setWeekChart1] = useState(0);
    const [getChart1Data, setChart1Data] = useState(undefined);
    const [getDatesArrayChart1, setDatesArrayChart1] = useState([]);
    const [getValuesChart1, setValuesChart1] = useState([]);

    // Creating the value array to match the dates array
    useEffect(() => {
        if(getChart1Data !== undefined) {
            const values = [];
            for(let i = 0; i < 7; i++) {
                if(getChart1Data[getDatesArrayChart1[i]]) {
                    values.push(getChart1Data[getDatesArrayChart1[i]]);
                } else {
                    values.push(0);
                }
            }

            setValuesChart1(values);
        }
    }, [getChart1Data]);

    useEffect(() => {
        // Retrieve the data from the database with the right dates
        const dates = getDateStartEnd();

        // Get the array of all dates between the start and end date
        setDatesArrayChart1(getDateArray(dates[0]));

        let data = {
            "date_start": dates[1],
            "date_end": dates[3]
        };

        Data("panelAdmin", "getChart1Data", data).then(response => {
            if (response.success === true)
            {
                const chartData = {}
                response.data.forEach(element => {
                    let date = element.date
                    date = date.split(" ")[0]
                    let newDate = date.split("-")[2] + "/" + date.split("-")[1] + "/" + date.split("-")[0];
                    chartData[newDate] = element.total_price
                });

                setChart1Data(chartData);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
                setValuesChart1([]);
            }
        });
    }, [getWeekChart1]);

    const addOneWeek = () => {
        if(getWeekChart1 < 4) {
            setWeekChart1(getWeekChart1+1);
        }
    };

    const removeOneWeek = () => {
        if(getWeekChart1 > 0) {
            setWeekChart1(getWeekChart1-1);
        }
    };

    // Setting the chart options
    useEffect(() => {
        const myChart = echarts.init(echartsDom.current);
        const options = {
            grid: { top: 20, right: 40, bottom: 20, left: 40 },
            xAxis: {
                type: "category",
                data: getDatesArrayChart1
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                data: getValuesChart1,
                type: "bar",
                smooth: true
                }
            ],
            tooltip: {
                trigger: "axis"
            }
        };
    
        myChart.setOption(options);
    }, [getDatesArrayChart1, getValuesChart1]);

    return(
        <>
            <div className="trackSales">
                <h1>Suivi des ventes par semaine: Semaine n-{getWeekChart1} </h1>
                <div ref={echartsDom} style={{height: 400, width: 700, marginRight: "auto", marginLeft: "auto"}}></div>
                <div className="buttons">
                    <button disabled={getWeekChart1 === 4} className={getWeekChart1 === 4 ? "btn-inactive": "btn-active"} onClick={addOneWeek}>Semaine précédente</button>
                    <button disabled={getWeekChart1 === 0} className={getWeekChart1 === 0 ? "btn-inactive": "btn-active"} onClick={removeOneWeek}>Semaine Suivante</button>
                </div>
            </div>
        </>
    );
};

export default TrackSales;