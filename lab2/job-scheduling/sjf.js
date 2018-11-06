stringData = localStorage.getItem('listData');
// data = $.parseJSON(stringData);

// data = data.map(d => {
//     d.process = parseInt(d.process);
//     d.burstTime = parseInt(d.process);
//     return d;
// });

var table = document.getElementById('scheduling-table');
var tr;

class SJF {
    constructor() {
        this.waitingTime = [];
        this.turnAroundTime = [];
        this.timespan = 0;
        this.burstTimeStart = false;
        this.initial = 0;
        data.sort((d1, d2) => d1.burstTime - d2.burstTime);
    }

    getAverageWaitingTime() {
        return (this.waitingTime.reduce((t1, t2) => t1 + t2, 0) / this.waitingTime.length).toFixed(2);
    }
    
    getAverageTurnAroundTime() {
        return (this.turnAroundTime.reduce((t1, t2) => t1 + t2, 0) / this.turnAroundTime.length).toFixed(2);
    }
}

function startSJF(sjf) {
    if (data.length > 0) {
    
        if (!sjf.burstTimeStart) {
            sjf.waitingTime.push(sjf.timespan);
            sjf.initial = sjf.timespan;
            sjf.burstTimeStart = true;
        }
    
        if(data[0].burstTime == 0) {
            tr = document.createElement('tr');
            $($.parseHTML('<td>'+data[0].process+'</td><td>'+sjf.initial+'</td><td>'+sjf.timespan+'</td>')).appendTo(tr);
            table.appendChild(tr);

            drawGraph(data[0].process, sjf.timespan-sjf.initial, random_color(),sjf.initial, sjf.timespan);

            sjf.turnAroundTime.push(sjf.timespan);
            data.shift();
            sjf.burstTimeStart = false;

        } else {
            data[0].burstTime--;
            sjf.timespan++;
            console.log('This is process: ' + data[0].process + ' and its burst time: ' + data[0].burstTime + ' ' + sjf.timespan);    
        }
    } else {
        tr = document.createElement('tr');
        $($.parseHTML('<th>Average</th><th>'+sjf.getAverageWaitingTime()+'</th><th>'+sjf.getAverageTurnAroundTime()+'</th>')).appendTo(tr);
        table.appendChild(tr);

        clearInterval(timer);
    }
}