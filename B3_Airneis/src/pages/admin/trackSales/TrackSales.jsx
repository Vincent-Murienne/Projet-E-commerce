import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import { Data } from "../../../services/api";
import { ToastQueue } from "@react-spectrum/toast";


const TrackSales = () => {

    // Creating start and end dates for the timeframe of the chart
    const getDateStartEnd = (chart) => {
        let week;
        if(chart === 1) {
            week = getWeekChart1;
        } else if(chart === 2) {
            week = getWeekChart2;
        } else if(chart === 3) {
            week = getWeekChart3;
        }

        const date_end = new Date();
        date_end.setDate(date_end.getDate() - week*7);
        const date_end_string = date_end.getDate() + "/" + (date_end.getMonth()+1) + "/" + date_end.getFullYear() + " 23:59:59";
    
        const date_start = new Date();
        date_start.setDate(date_start.getDate() - week*7 - 6);
        const date_start_string = date_start.getDate() + "/" + (date_start.getMonth()+1) + "/" + date_start.getFullYear() + " 00:00:00";
        
        return [date_start, date_start_string, date_end, date_end_string];
    };

    // From the date start, get the next 7 days date into an array
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

    // Setting use states
    const chart1Dom = useRef(null);
    const [getWeekChart1, setWeekChart1] = useState(0);
    const [getChart1Data, setChart1Data] = useState(undefined);
    const [getDatesArrayChart1, setDatesArrayChart1] = useState([]);
    const [getValuesChart1, setValuesChart1] = useState([]);

    const chart2Dom = useRef(null);
    const [getWeekChart2, setWeekChart2] = useState(0);
    const [getChart2Data, setChart2Data] = useState(undefined);
    const [getDatesArrayChart2, setDatesArrayChart2] = useState([]);
    const [getValuesChart2, setValuesChart2] = useState(undefined);

    const chart3Dom = useRef(null);
    const [getWeekChart3, setWeekChart3] = useState(0);
    const [getChart3Data, setChart3Data] = useState(undefined);

    // Format correctly the values for the first chart 
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

    // Format correctly the values for the second chart 
    useEffect(() => {
        if(getChart2Data !== undefined) {
            const values = [];
            for(let i = 0; i < 7; i++) {
                if(getChart2Data[getDatesArrayChart2[i]]) {
                    values.push(getChart2Data[getDatesArrayChart2[i]]);
                } else {
                    values.push(0);
                }
            }

            let categories = [];
            values.forEach(element => {
                if(element !== 0) {
                    element.forEach(element2 => {
                        if(!categories.includes(element2.name)) {
                            categories.push(element2.name);
                        }
                    });
                }
            });

            const series = [];
            for(let i = 0; i < categories.length; i++) {
                let obj = {};
                obj["type"] = "bar";
                obj["stack"] = "a";
                obj["name"] = categories[i];

                let data = [];
                values.forEach(element => {
                    if(element === 0) {
                        data.push(0);
                    } else {
                        let temp_data = 0;
                        element.forEach(element2 => {
                            if(element2.name === categories[i]) {
                                temp_data = element2.total_price;
                            }
                        });
                        data.push(temp_data);
                    }
                });

                obj["data"] = data;
                series.push(obj);
            }

            setValuesChart2(series);
        }
    }, [getChart2Data]);

    // Make an API call to get the data for the first chart
    useEffect(() => {
        // Retrieve the data from the database with the right dates
        const dates = getDateStartEnd(1);

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

    // Make an API call to get the data for the second chart
    useEffect(() => {
        // Retrieve the data from the database with the right dates
        const dates = getDateStartEnd(2);

        // Get the array of all dates between the start and end date
        setDatesArrayChart2(getDateArray(dates[0]));

        let data = {
            "date_start": dates[1],
            "date_end": dates[3]
        };

        Data("panelAdmin", "getChart2Data", data).then(response => {
            if (response.success === true)
            {
                const chartData = {}
                response.data.forEach(element => {
                    let date = element.date
                    date = date.split(" ")[0]
                    let newDate = date.split("-")[2] + "/" + date.split("-")[1] + "/" + date.split("-")[0];
                    if(chartData.hasOwnProperty(newDate)) {
                        chartData[newDate].push({name: element.name, total_price: element.total_price});
                    } else {
                        chartData[newDate] = [{name: element.name, total_price: element.total_price}];
                    }
                });

                setChart2Data(chartData);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
                setValuesChart2(undefined);
            }
        });
    }, [getWeekChart2]);

    // Make an API call to get the data for the third chart
    useEffect(() => {
        // Retrieve the data from the database with the right dates
        const dates = getDateStartEnd(3);

        let data = {
            "date_start": dates[1],
            "date_end": dates[3]
        };

        Data("panelAdmin", "getChart3Data", data).then(response => {
            if (response.success === true)
            {
                setChart3Data(response.data);
            }
            else
            {
                ToastQueue.negative(response.error, {timeout: 5000});
                setChart3Data(undefined);
            }
        });
    }, [getWeekChart3]);

    // Go one week further the dates
    const addOneWeek = (chart) => {
        if(chart === 1) {
            if(getWeekChart1 < 4) {
                setWeekChart1(getWeekChart1+1);
            }
        } else if(chart === 2) {
            if(getWeekChart2 < 4) {
                setWeekChart2(getWeekChart2+1);
            }
        } else if(chart === 3) {
            if(getWeekChart3 < 4) {
                setWeekChart3(getWeekChart3+1);
            }
        }
    };

    // Go one week back into the dates
    const removeOneWeek = (chart) => {
        if(chart === 1) {
            if(getWeekChart1 > 0) {
                setWeekChart1(getWeekChart1-1);
            }
        } else if(chart === 2) {
            if(getWeekChart2 > 0) {
                setWeekChart2(getWeekChart2-1);
            }
        } else if(chart === 3) {
            if(getWeekChart3 > 0) {
                setWeekChart3(getWeekChart3-1);
            }
        }
    };

    // Setting the first chart options
    useEffect(() => {
        const myChart = echarts.init(chart1Dom.current);
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

    // Format correctly the data of the second chart
    useEffect(() => {
        const myChart = echarts.init(chart2Dom.current);
        var series;
        if(getValuesChart2 !== undefined) {
            series = getValuesChart2;

            const stackInfo = {};
            for (let i = 0; i < series[0].data.length; ++i) {
                for (let j = 0; j < series.length; ++j) {
                    const stackName = series[j].stack;
                    if (!stackName) {
                        continue;
                    }
                    if (!stackInfo[stackName]) {
                        stackInfo[stackName] = {
                        stackStart: [],
                        stackEnd: []
                        };
                    }
                    const info = stackInfo[stackName];
                    const data = series[j].data[i];
                    if (data && data !== '-') {
                        if (info.stackStart[i] == null) {
                        info.stackStart[i] = j;
                        }
                        info.stackEnd[i] = j;
                    }
                }
            }
            for (let i = 0; i < series.length; ++i) {
                const data = series[i].data;
                const info = stackInfo[series[i].stack];
                for (let j = 0; j < series[i].data.length; ++j) {
                    const isEnd = info.stackEnd[j] === i;
                    const topBorder = isEnd ? 20 : 0;
                    const bottomBorder = 0;
                    data[j] = {
                        value: data[j],
                        itemStyle: {
                        borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
                        }
                    };
                }
            }
        } else {
            series = {};
        }

        const options = {
            legend: {
                selectedMode: false
            },
            xAxis: {
                type: 'category',
                data: getDatesArrayChart2
            },
            yAxis: {
                type: 'value'
            },
            series: series,
            tooltip: {
                trigger: 'axis'
            }
        };
    
        myChart.setOption(options);
    }, [getDatesArrayChart2, getValuesChart2]);

    // Format correctly the values for the third chart 
    useEffect(() => {
        const myChart = echarts.init(chart3Dom.current);
        let chartData = [];
        if(getChart3Data !== undefined) {
            chartData = getChart3Data;
        }
        const options = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Volume des ventes',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 30,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: chartData
                }
            ]
        };
    
        myChart.setOption(options);
    }, [getChart3Data]);

    return(
        <>
            <div className="trackSales">
                <h1>Suivi des ventes par semaine: Semaine n-{getWeekChart1} </h1>
                <div ref={chart1Dom} style={{height: 400, width: 800, marginRight: "auto", marginLeft: "auto"}}></div>
                <div className="buttons">
                    <button disabled={getWeekChart1 === 4} className={getWeekChart1 === 4 ? "btn-inactive": "btn-active"} onClick={() => addOneWeek(1)}>Semaine précédente</button>
                    <button disabled={getWeekChart1 === 0} className={getWeekChart1 === 0 ? "btn-inactive": "btn-active"} onClick={() => removeOneWeek(1)}>Semaine Suivante</button>
                </div>

                <h1>Suivi des ventes par semaine et par catégorie: Semaine n-{getWeekChart2} </h1>
                <div ref={chart2Dom} style={{height: 400, width: 800, marginRight: "auto", marginLeft: "auto"}}></div>
                <div className="buttons">
                    <button disabled={getWeekChart2 === 4} className={getWeekChart2 === 4 ? "btn-inactive": "btn-active"} onClick={() => addOneWeek(2)}>Semaine précédente</button>
                    <button disabled={getWeekChart2 === 0} className={getWeekChart2 === 0 ? "btn-inactive": "btn-active"} onClick={() => removeOneWeek(2)}>Semaine Suivante</button>
                </div>

                <h1>Suivi du volume des ventes par catégorie: Semaine n-{getWeekChart3} </h1>
                <div ref={chart3Dom} style={{height: 400, width: 800, marginRight: "auto", marginLeft: "auto"}}></div>
                <div className="buttons">
                    <button disabled={getWeekChart3 === 4} className={getWeekChart3 === 4 ? "btn-inactive": "btn-active"} onClick={() => addOneWeek(3)}>Semaine précédente</button>
                    <button disabled={getWeekChart3 === 0} className={getWeekChart3 === 0 ? "btn-inactive": "btn-active"} onClick={() => removeOneWeek(3)}>Semaine Suivante</button>
                </div>
            </div>
        </>
    );
};

export default TrackSales;