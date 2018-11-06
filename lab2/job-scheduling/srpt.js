stringData = localStorage.getItem('listData');
// data = $.parseJSON(stringData);
// data = data.map(d => {
//     d.process = parseInt(d.process, 10);
//     d.burstTime = parseInt(d.process, 10);
//     return d;
// });

var table = document.getElementById('scheduling-table');

class SRPT {
    constructor() {
        this.timespan = 0;
        this.queue = [];
        this.initial = 0;
        this.currentDataIndex = 0;
        this.burstTimeStart = false;
        this.isDrawGraphOnceChangeProcess = true;
        this.initializeDataProcesses();
    }

    initializeDataProcesses() {
        data = data.map(d => { 
            d.waitingTime = 0;
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

    srptSortQueue() {
        this.queue.sort((p1, p2) => p1.burstTime - p2.burstTime);
    }

    srptUpdateCurrentDataIndex(currentProcess, processListWithZeroArrivalTime) {
        let isProcessListHasMoreElems = false;
        if (processListWithZeroArrivalTime.length > 1) {
            processListWithZeroArrivalTime.sort((p1, p2) => p1.burstTime - p2.burstTime);
            isProcessListHasMoreElems = true;
        }

        let processWaiting = {
            process: 0,
            waitingTime: 0,
            burstTime: 0
        }
    
        // these lines of code are too long. Find a much shorter way
        if (currentProcess.burstTime > processListWithZeroArrivalTime[0].burstTime) {
            if (this.isDrawGraphOnceChangeProcess) {
                drawGraph(currentProcess.process, this.timespan-this.initial, currentProcess.color,this.initial, this.timespan);
            }
            
            processWaiting.process = currentProcess.process;
            processWaiting.burstTime = currentProcess.burstTime;
            
            this.queue.push(processWaiting);
            this.currentDataIndex = processListWithZeroArrivalTime[0].process - 1;
            this.burstTimeStart = false;

            processListWithZeroArrivalTime.shift();
        
        } else if(currentProcess.burstTime <= processListWithZeroArrivalTime[0].burstTime) {

            processWaiting.process = processListWithZeroArrivalTime[0].process
            processWaiting.burstTime = processListWithZeroArrivalTime[0].burstTime;
            this.queue.push(processWaiting);

            processListWithZeroArrivalTime.shift();
        }

        if (isProcessListHasMoreElems) {
            processListWithZeroArrivalTime.forEach(process => {
                processWaiting = {
                    process: 0,
                    waitingTime: 0,
                    burstTime: 0
                };
                processWaiting.process = process.process;
                processWaiting.burstTime = process.burstTime;
                this.queue.push(processWaiting);      
            });
        }
        this.isDrawGraphOnceChangeProcess = true;
    }

    srptUpdateWaitingTimeInQueue() {
        if (this.queue.length > 0) {
            this.queue = this.queue.map(
                p => {
                    p.waitingTime++;
                    return p;
                }
            )
        }
    }

    srptBurstTimeFinish() {
        drawGraph(data[this.currentDataIndex].process, this.timespan-this.initial, data[this.currentDataIndex].color, this.initial, this.timespan);
        data[this.currentDataIndex].turnAroundTime = this.timespan;

        const process = this.queue.shift();
        this.burstTimeStart = false;
        this.currentDataIndex = process.process - 1;
        this.isDrawGraphOnceChangeProcess = false;
        data[this.currentDataIndex].waitingTime = process.waitingTime;
    }

    srptUpdateTable() {
        let tr;
        data.forEach(process => {
            tr = document.createElement('tr');
            $($.parseHTML('<td>'+process.process+'</td><td>'+process.waitingTime+'</td><td>'+process.turnAroundTime+'</td>')).appendTo(tr);
            table.appendChild(tr);
        });
        tr = document.createElement('tr');
        $($.parseHTML('<th>Average</th><th>'+this.getAverageWaitingTime()+'</th><th>'+this.getAverageTurnAroundTime()+'</th>')).appendTo(tr);
        table.appendChild(tr);
    }
}

function startSRPT(srpt) {
    if (data[srpt.currentDataIndex].burstTime > 0) {        
        if (!srpt.burstTimeStart) {
            srpt.initial = srpt.timespan;
            srpt.burstTimeStart = true;
        }
        data[srpt.currentDataIndex].burstTime--;
        srpt.timespan++;
        srpt.srptUpdateWaitingTimeInQueue();

        console.log('This is process: ' + data[srpt.currentDataIndex].process + ' and its burst time: ' + data[srpt.currentDataIndex].burstTime + ' ' + srpt.timespan);
    
        data = data.map( d => { if (d.arrival >= 0) { d.arrival--; } return d; })
        let dataListWithZeroArrivalTime = data.filter( proc => proc.arrival === 0 );


        if (data[srpt.currentDataIndex].burstTime == 0 && srpt.queue.length > 0) {
            srpt.srptBurstTimeFinish();
        }

        if (dataListWithZeroArrivalTime.length > 0) {
            srpt.srptUpdateCurrentDataIndex(data[srpt.currentDataIndex], dataListWithZeroArrivalTime);
        }
        srpt.srptSortQueue();

    } else {
        data[srpt.currentDataIndex].turnAroundTime = srpt.timespan;
        drawGraph(data[srpt.currentDataIndex].process, eval(srpt.timespan-srpt.initial), data[srpt.currentDataIndex].color,srpt.initial, srpt.timespan);

        srpt.srptUpdateTable();

        clearInterval(timer);
    }
}
