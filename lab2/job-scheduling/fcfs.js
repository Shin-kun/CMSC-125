stringData = localStorage.getItem('listData');
// data = $.parseJSON(stringData);

// data = data.map(d => {
//     d.process = parseInt(d.process);
//     d.burstTime = parseInt(d.process);
//     return d;
// });

var table = document.getElementById('scheduling-table');
var tr;

class FCFS {
    constructor() {
        this.waitingTime = [];
        this.turnAroundTime = [];
        this.timespan = 0;
        this.burstTimeStart = false;
        this.initial = 0;
    }

    getAverageWaitingTime() {
        return (this.waitingTime.reduce((t1, t2) => t1 + t2, 0) / this.waitingTime.length).toFixed(2);
    }
    
    getAverageTurnAroundTime() {
        return (this.turnAroundTime.reduce((t1, t2) => t1 + t2, 0) / this.turnAroundTime.length).toFixed(2);
    }
}

function startFCFS(fcfs) {
    if(data.length > 0) {
        if (!fcfs.burstTimeStart) {
            fcfs.waitingTime.push(fcfs.timespan);
            fcfs.burstTimeStart = true;
            fcfs.initial = fcfs.timespan;
        }
    
        if(data[0].burstTime == 0) {
            fcfs.turnAroundTime.push(fcfs.timespan);
            
            tr = document.createElement('tr');
            $($.parseHTML('<td>'+data[0].process+'</td><td>'+fcfs.initial+'</td><td>'+fcfs.timespan+'</td>')).appendTo(tr);
            table.appendChild(tr);

            drawGraph(data[0].process, fcfs.timespan-fcfs.initial, random_color(),fcfs.initial, fcfs.timespan);
            data.shift();
            fcfs.burstTimeStart = false;
        } else {
            data[0].burstTime--;
            fcfs.timespan++;
            console.log('This is process: ' + data[0].process + ' and its burst time: ' + data[0].burstTime + ' ' + fcfs.timespan);        
        }
    } else {
        tr = document.createElement('tr');
        $($.parseHTML('<th>Average</th><th>'+fcfs.getAverageWaitingTime()+'</th><th>'+fcfs.getAverageTurnAroundTime()+'</th>')).appendTo(tr);
        table.appendChild(tr);

        clearInterval(timer);
    }
}
