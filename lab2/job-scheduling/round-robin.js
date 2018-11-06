stringData = localStorage.getItem('listData');
// data = $.parseJSON(stringData);

// data = data.map(d => {
//     d.process = parseInt(d.process);
//     d.burstTime = parseInt(d.process);
//     return d;
// });

var table = document.getElementById('scheduling-table');
const universalQuantumTime = 4;

class RoundRobin {
    constructor() {
        this.timespan = 0;
        this.currentDataIndex = 0;
        this.quantumTime = universalQuantumTime;
        this.initial = 0;

        this.burstTimeStart = false;
        this.isFinishProcessing = false;
        this.initializeTimeProcesses();
    }

    initializeTimeProcesses() {
        data = data.map(d => {
            d.waitingTime = 0;
            d.timesProcessWait = 0
            d.turnAroundTime = 0;
            d.color = random_color();
            return d;
        });
    }

    getAverageWaitingTime() {
        return (data.reduce((sum, d) => sum + d.waitingTime, 0) / data.length).toFixed(2);
    }
    
    getAverageTurnAroundTime() {
        return (data.reduce((sum, d) => sum + d.turnAroundTime, 0) / data.length).toFixed(2);
    }

    displayRoundRobinTable() {
        let tr;
        data.forEach(process => {
            tr = document.createElement('tr');
            $($.parseHTML('<td>'+process.process+'</td><td>'+process.waitingTime+'</td><td>'+process.turnAroundTime+'</td>')).appendTo(tr);
            table.appendChild(tr);    
        })
        tr = document.createElement('tr');
        $($.parseHTML('<th>Average</th><th>'+this.getAverageWaitingTime()+'</th><th>'+this.getAverageTurnAroundTime()+'</th>')).appendTo(tr);
        table.appendChild(tr);
    }


    shiftToNewProcess() {
        if (this.quantumTime === 0 || data[this.currentDataIndex].burstTime === 0) {
            this.burstTimeStart = false;
            
            if (data[this.currentDataIndex].burstTime === 0) {
                data[this.currentDataIndex].turnAroundTime = this.timespan;
                data[this.currentDataIndex].waitingTime = this.initial - data[this.currentDataIndex].timesProcessWait * universalQuantumTime;                
            }
            
            this.quantumTime = universalQuantumTime;
            for(let i = this.currentDataIndex + 1; i < data.length; i++) {
                if (data[i].burstTime > 0) {
                    drawGraph(data[this.currentDataIndex].process, this.timespan - this.initial, data[this.currentDataIndex].color, this.initial, this.timespan);
                    data[this.currentDataIndex].timesProcessWait += 1;
                    this.currentDataIndex = i;
                    return ;
                }
            }
            for (let i = 0; i < this.currentDataIndex; i++) {
                if (data[i].burstTime > 0) {
                    drawGraph(data[this.currentDataIndex].process, this.timespan - this.initial, data[this.currentDataIndex].color, this.initial, this.timespan);
                    data[this.currentDataIndex].timesProcessWait += 1;
                    this.currentDataIndex = i;
                    return ;
                }
            }
            if (data[this.currentDataIndex].burstTime > 0) {
                this.burstTimeStart = true;
                return ;
            }
            this.isFinishProcessing = true;
            console.log(this.isFinishProcessing + ' this is finishProcessing');
        }
    }
}

function startRoundRobin(rr) {
    if (!rr.isFinishProcessing) {
        if (!rr.burstTimeStart) {
            rr.burstTimeStart = true;
            rr.initial = rr.timespan;
        }

        data[rr.currentDataIndex].burstTime--;
        rr.timespan++;
        rr.quantumTime--;
        console.log('This is process: ' + data[rr.currentDataIndex].process + ' and its burst time: ' + data[rr.currentDataIndex].burstTime + ' ' + rr.timespan + ' Quantum time: ' + rr.quantumTime);

        rr.shiftToNewProcess();
    }
    else {
        drawGraph(data[rr.currentDataIndex].process, rr.timespan - rr.initial, data[rr.currentDataIndex].color, rr.initial, rr.timespan);
        rr.displayRoundRobinTable();
        clearInterval(timer);
    }
}
