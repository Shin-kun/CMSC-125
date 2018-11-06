function random_color() {
    let color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
    return color;
}

function drawGraph(id, width=10, color, init, end) {
    let graph = document.getElementById('graph');
    
    if (width < 5) { width = 5; }
    else if (width > 20) { width = 15; }
    
    width = width * 10;
    $($.parseHTML('<div class="block-cont"><div style="background:'+ color +'; width:'+width+'px" class="graph-block"><p>P'+id+'</p><div/><p class="tooltiptext left">'+init+'</p><p class="tooltiptext right">'+end+'</p><div>')).appendTo(graph);
}
