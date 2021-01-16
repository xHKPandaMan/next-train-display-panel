const stationKey = {
    "HUH": "紅磡",
    "ETS": "尖東",
    "AUS": "柯士甸",
    "NAC": "南昌",
    "MEF": "Mei Foo",
    "TWW": "荃灣西",
    "KSR": "錦上路",
    "YUL": "元朗",
    "LOP": "朗屏",
    "TIS": "天水圍",
    "SIH": "兆康",
    "TUM": "屯門"
}

function duration(arrivalTime) {
    const currentMinutes = new Date().getMinutes();
    const arrivalMinutes = arrivalTime.split(" ")[1].split(':')[1]
    const current = parseInt(currentMinutes);
    const arrival = parseInt(arrivalMinutes)
    if (arrival - current >= 0) {
        return arrival - current
    } else {
        return arrival + 60 - current
    }
}

async function getTrainData(line, sta) {
    const response = await fetch(`https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${line}&sta=${sta}`);
    const data = await response.json();
    // const data =
    // {
    //     "status": 1,
    //     "message": "successful",
    //     "curr_time": "2021-01-15 23:59:41",
    //     "sys_time": "2021-01-15 23:59:41",
    //     "isdelay": "N",
    //     "data": {
    //         "WRL-ETS": {
    //             "curr_time": "2021-01-15 23:59:41",
    //             "sys_time": "2021-01-15 23:59:41",
    //             "UP": [
    //                 {
    //                     "ttnt": "5",
    //                     "valid": "Y",
    //                     "plat": "1",
    //                     "time": "2021-01-15 23:53:00",
    //                     "source": "-",
    //                     "dest": "TUM",
    //                     "seq": "1"
    //                 },
    //                 {
    //                     "ttnt": "12",
    //                     "valid": "Y",
    //                     "plat": "1",
    //                     "time": "2021-01-16 00:00:00",
    //                     "source": "-",
    //                     "dest": "TUM",
    //                     "seq": "2"
    //                 },
    //                 {
    //                     "ttnt": "17",
    //                     "valid": "Y",
    //                     "plat": "1",
    //                     "time": "2021-01-16 00:05:00",
    //                     "source": "-",
    //                     "dest": "TUM",
    //                     "seq": "3"
    //                 },
    //                 {
    //                     "ttnt": "22",
    //                     "valid": "Y",
    //                     "plat": "1",
    //                     "time": "2021-01-16 00:10:00",
    //                     "source": "-",
    //                     "dest": "TUM",
    //                     "seq": "4"
    //                 },
    //                 {
    //                     "ttnt": "31",
    //                     "valid": "Y",
    //                     "plat": "1",
    //                     "time": "2021-01-16 00:19:00",
    //                     "source": "-",
    //                     "dest": "TUM",
    //                     "seq": "5"
    //                 }
    //             ]
    //         }
    //     }
    // };


    let up = `<div class='time'>
        <div>${stationKey[sta]}</div>
        <div>${new Date().toTimeString().substring(0, 5)}</div>
        </div>`

    let down = `<div class='time'>
        <div>${stationKey[sta]}</div>
        <div>${new Date().toTimeString().substring(0, 5)}</div>
        </div>`
    if (data.data[`${line}-${sta}`]["UP"]) {
        data.data[`${line}-${sta}`]["UP"].map((item, index) => {
            let background;
            if (index % 2 === 0) {
                background = "light-time-box"
            } else {
                background = "dark-time-box"
            }

            up += `<div class="time-box ${background}"> 
                    <div class="destination">${stationKey[item.dest]}</div> 
                    <div class="platform-box">
                        <div class="platform-indicator">${item.plat}</div> 
                        <div class="duration">${duration(item.time)}<span class="minute">分鐘</span></div>
                    </div>
                </div>`
        })
    }
    if (data.data[`${line}-${sta}`]["DOWN"]) {
        data.data[`${line}-${sta}`]["DOWN"].map((item, index) => {
            let background;
            if (index % 2 === 0) {
                background = "light-time-box"
            } else {
                background = "dark-time-box"
            }

            let remainingTime=duration(item.time)
            down += `<div class="time-box ${background}"> 
                    <div class="destination">${stationKey[item.dest]}</div> 
                    <div class="platform-box">
                        <div class="platform-indicator">${item.plat}</div> 
                        <div class="duration">${remainingTime}<span class="minute">分鐘</span></div>
                    </div>
                </div>`
        })
    }

    document.getElementById('box-up').innerHTML = up
    document.getElementById('box-down').innerHTML = down
}

getTrainData("WRL", "HUH")

const handleChangeStation = (line, sta) => {
  getTrainData(line, sta)
}
