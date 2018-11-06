stringData = localStorage.getItem('listData');
// data = $.parseJSON(stringData);

// data = data.map(d => {
//     d.process = parseInt(d.process);
//     d.burstTime = parseInt(d.process);
//     return d;
// });

var table = document.getElementById('scheduling-table');
var tr;

class Priority {
    constructor() {
        this.waitingTime = [];
        this.turnAroundTime = [];
        this.timespan = 0;
        this.burstTimeStart = false;
        this.initial = 0;
        data.sort((d1, d2) => d1.priority - d2.priority);
    }

    getAverageWaitingTime() {
        return (this.waitingTime.reduce((t1, t2) => t1 + t2, 0) / this.waitingTime.length).toFixed(2);
    }
    
    getAverageTurnAroundTime() {
        return (this.turnAroundTime.reduce((t1, t2) => t1 + t2, 0) / this.turnAroundTime.length).toFixed(2);
    }
}

function startPriority(pr) {
    if (data.length > 0) {    
        if (!pr.burstTimeStart) {
            pr.waitingTime.push(pr.timespan);
            pr.initial = pr.timespan;
            pr.burstTimeStart = true;
        }
    
        if(data[0].burstTime === 0) {
            tr = document.createElement('tr');
            $($.parseHTML('<td>'+data[0].process+'</td><td>'+pr.initial+'</td><td>'+pr.timespan+'</td>')).appendTo(tr);
            table.appendChild(tr);

            drawGraph(data[0].process, pr.timespan-pr.initial, random_color(),pr.initial, pr.timespan);
            pr.turnAroundTime.push(pr.timespan);
            data.shift();
            pr.burstTimeStart = false;
        
        } else {
            data[0].burstTime--;
            pr.timespan++;
            console.log('This is process: ' + data[0].process + ' and its burst time: ' + data[0].burstTime + ' ' + pr.timespan);    
        }
    } else {
        tr = document.createElement('tr');
        $($.parseHTML('<th>Average</th><th>'+pr.getAverageWaitingTime()+'</th><th>'+pr.getAverageTurnAroundTime()+'</th>')).appendTo(tr);
        table.appendChild(tr);

        clearInterval(timer);
    }
}