const contrib = require('blessed-contrib');
const errorView = require('./errorView')


module.exports = function (screen, chart, chartData, table, hashes, refresh) {
  var line, data;
  if (!chart) {
    line = contrib.line(
     { width: '70%'
     , height: '50%-1'
     , border: {type: "line", fg: "cyan"}
     , left: '0'
     , top: '50%'
     , xPadding: 5
     , label: 'Torrent Transfer rate (KB/sec) - Download is the blue line and Upload the red one'
     , showLegend: false})
     screen.append(line) //must append before setting data
 } else {
   line = chart;
 }

   var currentRecord = null;
   var currentHash = '';
   data = chartData;
   if (table && table.rows && hashes.length && Number.isInteger(table.rows.selected) && hashes.length > table.rows.selected) {
     currentRecord = hashes[table.rows.selected].all
     currentHash = hashes[table.rows.selected].hash
   }
   if ((!data) || (!currentRecord) || refresh) { //init or reinit
     data = [
       {
         x: [],
         y: [],
         style: {line: 'blue'}
       },
       {
         x: [],
         y: [],
         style: {line: 'red'}
       }
      ]
   }
   if (currentRecord) {
     if (data[0].x.length == 0) { // empty array
       for ( var i = 0; i < 61; i++) { // initiate the array
       if (data[0].x.length == 0) {
         data[0].x.unshift('0')
         data[1].x.unshift('0')
       } else {
         data[0].x.unshift('-'+data[0].x.length)
         data[1].x.unshift('-'+data[1].x.length)
       }       
         data[0].y.unshift(0) //inserting blank data to upload and download
         data[1].y.unshift(0)
       }
     } else { //following records
       if (data[0].x.length > 60) { // maximum length
         data[0].y.shift()
         data[1].y.shift()
       } else {
         data[0].x.unshift('-'+data[0].x.length)
         data[1].x.unshift('-'+data[1].x.length)
       }
     }
     data[0].y.push(currentRecord['downloadspeedBytesSec']/1000)
     data[1].y.push(currentRecord['uploadspeedBytesSec']/1000)
   }
   line.setData(data)


  return {chart: line, chartData: data, currentHash: currentHash}
}
