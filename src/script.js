const h = 700;
const w = 1000;
const p = 60;

const svg = d3.select('#container')
  .append('svg')
  .attr('height', h)
  .attr('width', w)
  .attr("viewBox", [0, 0, w, h])
  .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(obj => {
  
  const data = obj.data;
  
  const stringToDate = () => {
    let min = d3.min(data, d => d[0]);
    let max = d3.max(data, d => d[0]);
    
    min = new Date(min.slice(0, 4), 0);
    max = new Date(max.slice(0, 4), Number(max.slice(5, 7)) + 1);
    
    return [min, max];
  }
  
  const x = d3.scaleTime()
    .domain(stringToDate())
    .range([p, w - p]);
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[1])])
    .range([h - p, p]);
  
  const xAxis = d3.axisBottom(x);
  
  const yAxis = d3.axisLeft(y);
  
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + (h - p) + ')')
    .call(xAxis);
  
  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + p + ', 0)')
    .call(yAxis);
  
  svg.append('text')
  .style('font-size', '23px')
  .attr('transform', 'rotate(-90)')
  .attr('x', -(h / 2))
  .attr('y', p + (p/2))
  .text('Billions of Dollars')
  
  const tooltip = d3.select('body')
    .append("div")
    .attr('id', 'tooltip')
  
  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', d => d[0])
    .attr('data-gdp', d => d[1])
    .attr('x', d => x(new Date(d[0])))
    .attr('y', d => y(d[1]))
    .attr('height', d => y(0) - y(d[1]))
    .attr('width', d => w / data.length)
    .on('mouseover', (event, d) => {
      const left = event.pageX;
      const top = event.pageY;
      
      tooltip.attr('data-date', d[0].toString())
        .transition()
        .duration(100)
        .style('opacity', 1);

      tooltip.html('$' + d[1] + ' Billion' + '<br>' + d[0])
        .style('left', left + 'px')		
        .style('top', top + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0)})
})