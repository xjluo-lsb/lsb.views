function createBarChart(d2010, d2011, d2012, d2013, d2014, d2015, d2016)
{
  const ctx = document.getElementById('container');
  const data = [
    { year: 2010, count: d2010 },
    { year: 2011, count: d2011 },
    { year: 2012, count: d2012 },
    { year: 2013, count: d2013 },
    { year: 2014, count: d2014 },
    { year: 2015, count: d2015 },
    { year: 2016, count: d2016 },
  ];
    
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(row => row.year),
      datasets: [
        {
          label: 'Acquisitions by year',
          data: data.map(row => row.count),
          borderWidth: 1
        }
      ]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

function createBubbleChart(xrange, yrange, rrange, count)
{
  const ctx = document.getElementById('container');

  function getRadius(x, y)
  {
    var r = Math.round(Math.random() * rrange * 20 / Math.sqrt(x * x + y * y));
    return r < 1 ? 1 : (r > rrange / 2 ? (rrange / 2) : r);
  }

  const data = [].concat(
    Array.from({ length: count * 2 / 3 }, () => {
      var x = Math.random() * xrange;
      var y = Math.random() * yrange;
      var d = (y - x) / 3;
      return { x: Math.round(x + d), y: Math.round(y - d), r: getRadius(x, y) };
    }),
    Array.from({ length: count / 3 }, () => {
      var m = Math.min(xrange, yrange);
      var x = Math.round(Math.random() * m);
      return { x: x, y: x, r: getRadius(x, x) };
    })
  );

  new Chart(ctx, {
    type: 'bubble',
    options: {
      aspectRatio: 1,
      scales: { x: { max: xrange }, y: { max: yrange } }
    },
    data: {
      label: "Dimensions",
      datasets: [
        { label: 'x = y', data: data.filter(row => row.x === row.y) },
        { label: 'x > y', data: data.filter(row => row.x > row.y) },
        { label: 'x < y', data: data.filter(row => row.x < row.y) }
      ]
    }
  });
}
