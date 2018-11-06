var data;
var timer;

function readFile(processString) {
    const fileRead = 'files/' + processString + '.csv';
    readCSVFile(fileRead);
    data = $.csv.toObjects(csv);
    localStorage.setItem('listData', JSON.stringify(data)); 
}

const nextPageListener = (event) => {
    const currentPage = $(event.target).parent().parent();
    const nextPage = currentPage.next();

    currentPage.hide();
    nextPage.fadeIn();
}

const processJob = (event) => {
    data = data.map(d => {
        d.process = parseInt(d.process);
        d.burstTime = parseInt(d.burstTime);
        d.priority = parseInt(d.priority)
        return d;
    });
    switch ($(event.target).text()) {
        case 'FCFS':
            let fcfs = new FCFS();
            timer = setInterval(startFCFS, 25, fcfs);
            break;
        case 'SJF':
            let sjf = new SJF();
            timer = setInterval(startSJF, 25, sjf);
            break;
        case 'Priority':
            let pr = new Priority();
            timer = setInterval(startPriority, 25, pr);
            break;
        case 'SRPT':
            let srpt = new SRPT();
            timer = setInterval(startSRPT, 25, srpt);
            break;
        case 'Round Robin':
            let rr = new RoundRobin();
            timer = setInterval(startRoundRobin, 25, rr);
            break;
        default:
            break;
    }
}

$('.process').on('click', function(event) {
    readFile($(event.target).text());
    nextPageListener(event);
});

$('.job').on('click', function(event) {
    processJob(event);
    nextPageListener(event);
});
