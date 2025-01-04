var simulation = null;

function GenerateDataForForceSimularion(parentBase, parentCount, childBase, childCount, extraCount)
{
    function getSourceIndex()
    {
        var sourceIndex = Math.floor(Math.random() * (parentCount + childCount));
        if (sourceIndex < parentCount)
        {
            return parentBase + sourceIndex;
        }
        else
        {
            return childBase + sourceIndex - parentCount;
        }
    }
    
    // Generate random number of target IDs that will be connected to the specified source ID
    function getTargetIndices(sourceIndex, maxCount)
    {
        return Array.from({ length: 1 + Math.floor(Math.random() * maxCount) }, () => {
            var targetIndex = sourceIndex;
            while (targetIndex == sourceIndex)
            {
                targetIndex = Math.floor(Math.random() * childCount);
            }
            return childBase + targetIndex;
        });
    }

    var data =
    {
        nodes: [].concat(
            Array.from({ length: parentCount }, (v, i) => {
                return { id: '' + (parentBase + i), group: 'parent' };
            }),
            Array.from({ length: childCount }, (v, i) => {
                return { id: '' + (childBase + i), group: 'child' };
            })
        ),
        links: [].concat(
            Array.from({ length: parentCount }, (v, i) => {
                return { source: '' + (parentBase + i), target: '' + (childBase + i), value: 2 };
            }),
            Array.from({ length: childCount - parentCount }, (v, i) => {
                return {
                    source: '' + (parentBase + (i % parentCount)),
                    target: '' + (childBase + parentCount + i),
                    value: 2 };
            })
        )
    };

    for (var index = 0; index < extraCount; index ++)
    {
        var sourceIndex = getSourceIndex();
        var targetIndices = getTargetIndices(sourceIndex, extraCount * 2);
        var extraLinks = Array.from(targetIndices, (targetIndex) => {
            return { source: '' + sourceIndex, target: '' + targetIndex, value: 2 };
        });
        data.links = data.links.concat(extraLinks);
    }

    return data;
}

// Event handler - reheat the simulation when drag starts, and fix the subject position.
function onForceSimulationDragStarted(event)
{
    if (!event.active)
    {
        simulation.alphaTarget(0.3).restart();
    }

    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}
  
// Event handler - update the subject (dragged node) position during drag.
function onForceSimulationDragged(event)
{
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}
  
// Event handler - restore the target alpha so the simulation cools after dragging ends.
// Reset the subject position.
function onForceSimulationDragEnded(event)
{
    if (!event.active)
    {
        simulation.alphaTarget(0);
    }

    event.subject.fx = null;
    event.subject.fy = null;
}

function initializeScatterplot(sigma, xoffset, yoffset, count)
{
    const svg = d3.select('#container');
    const borderDelta = document.documentElement.clientWidth - svg.node().clientWidth + 4;
    function getWidth() { return document.documentElement.clientWidth - borderDelta; }
    function getHeight() { return document.documentElement.clientHeight - borderDelta; }

    const g = svg.append("g").attr("stroke-linecap", "round").attr("stroke-width", 5);
    var data = [];
    var color = null;

    window.onresize = function(event)
    {
        var graphWidth = getWidth();
        var graphHeight = getHeight();
        svg.attr("width", graphWidth).attr("height", graphHeight)
            .attr("viewBox", [- graphWidth / 2, - graphHeight / 2, graphWidth, graphHeight])
        if (g && data && data.length > 0)
        {
            g.selectAll("path").data(data).join("path")
            .attr("d", d => "M" + (d[0] * graphWidth / 2) + "," + (d[1] * graphHeight / 2) + "h0")
            .attr("stroke", d => color(d[2]));
        }
    };

    const random = d3.randomNormal(0, sigma);

    data = [].concat(
    Array.from({length: count}, () => [random() + xoffset, random() - yoffset, 0]),
    Array.from({length: count}, () => [random() - xoffset, random() - yoffset, 1]),
    Array.from({length: count}, () => [random() + xoffset, random() + yoffset, 2]),
    Array.from({length: count}, () => [random() - xoffset, random() + yoffset, 3])
    );
    color = d3.scaleOrdinal().domain(data.map(d => d[2])).range(d3.schemeCategory10);

    window.onresize();
}

function initializeForceDirectedGraph(parentCount, childCount, extraCount)
{
    const parentBase = 1000;
    const childBase = Math.floor((parentBase + parentCount) / parentBase + 1) * parentBase;

    const svg = d3.select('#container');
    const borderDelta = document.documentElement.clientWidth - svg.node().clientWidth + 4;
    function getWidth() { return document.documentElement.clientWidth - borderDelta; }
    function getHeight() { return document.documentElement.clientHeight - borderDelta; }

    const linkGroup = svg.append("g").attr("stroke", "#999").attr("stroke-opacity", 0.6);
    const nodeGroup = svg.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    window.onresize = function(event)
    {
    var graphWidth = getWidth();
    var graphHeight = getHeight();
    svg.attr("width", graphWidth).attr("height", graphHeight)
        .attr("viewBox", [- graphWidth / 2, - graphHeight / 2, graphWidth, graphHeight])
    }

    var data = GenerateDataForForceSimularion(parentBase, parentCount, childBase, childCount, extraCount);
    simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX())
    .force("y", d3.forceY());
    var links = linkGroup.selectAll("line").data(data.links)
    .join("line").attr("stroke-width", d => Math.sqrt(d.value));
    var nodes = nodeGroup.selectAll("circle").data(data.nodes)
    .join("circle").attr("r", 5).attr("fill", d => color(d.group));
    nodes.append("title").text(d => d.id);
    nodes.call(d3.drag()
    .on("start", onForceSimulationDragStarted)
    .on("drag", onForceSimulationDragged)
    .on("end", onForceSimulationDragEnded));
    
    simulation.on("tick", () => {
    links.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
    nodes.attr("cx", d => d.x).attr("cy", d => d.y);
    });
    
    window.onresize();
}

