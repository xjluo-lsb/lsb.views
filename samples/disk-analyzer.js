function Node(name, path)
{
    this.name = name;
    this.path = path;
    this.size = 0;                  // This is the actual size of the folder, including child folders
    this.value = undefined;         // This is the value field for treemap
    this.children = [];             // This is for visible children
    this.hidden = undefined;        // This is for hidden children (that does not meet size filter)
}

Node.prototype.getOrCreateChild = function(paths)
{
    if (paths == null || paths.length == 0)
    {
        return this;
    }

    var activeNode = null;
    var name = paths[0];
    for (var index = 0; index < this.children.length; index ++)
    {
        if (this.children[index].name == name)
        {
            activeNode = this.children[index];
            break;
        }
    }

    if (activeNode == null)
    {
        var childPath = this.path.startsWith('/') ?
            (this.path + (this.path.endsWith('/') ? '' : '/') + name) :
            (this.path + (this.path.endsWith('\\') ? '' : '\\') + name);
        activeNode = new Node(name, childPath);
        this.children.push(activeNode);
    }

    return activeNode.getOrCreateChild(paths.slice(1));
};

Node.prototype.setSize = function(size)
{
    this.size = (typeof size == 'number') ? size : parseInt(size);
};

Node.prototype.filter = function(threshold)
{
    var childrenVisible = false;

    // If there is children visible, filter the children list with new threshold and also check if the children should be vsibile
    if (this.children !== undefined)
    {
        for (var index = 0; index < this.children.length; index ++)
        {
            this.children[index].filter(threshold);
            childrenVisible = childrenVisible || (this.children[index].size >= threshold);
        }
    }

    // If there is no children visible, filter the hidden children list with new threshold and also check if the children shoud be visible
    if (this.hidden != undefined)
    {
        for (var index = 0; index < this.hidden.length; index ++)
        {
            this.hidden[index].filter(threshold);
            childrenVisible = childrenVisible || (this.hidden[index].size >= threshold);
        }
    }

    if (childrenVisible)
    {
        // If children should be visible but currently not visible, make children visible
        if (this.hidden !== undefined && this.children === undefined)
        {
            this.children = this.hidden;
            delete this.hidden;
            delete this.value;
        }
    }
    else
    {
        // If children shoud not be visible but current visible, make child hidden
        if (this.hidden === undefined && this.children !== undefined)
        {
            this.value = this.size;
            this.hidden = this.children;
            delete this.children;
        }
    }

    // If current node is a leaf node, then update the size to value to be used by treemap
    if (this.children === undefined && this.hidden === undefined)
    {
        this.value = this.size;
    }
};

Node.buildTree = function(arrayData, rootIndex)
{
    var treeRoot = null;
    if (arrayData.length > 0)
    {
        var rootData = arrayData[rootIndex];
        var rootPath = rootData.path;
        var pathLength = rootPath.length;
        var delimeter = rootPath.startsWith('/') ? '/' : '\\';
        var nameIndex = rootPath.lastIndexOf(delimeter);

        // In case the root node is /, we want to use the / as name. Otherwise, we extract the last directory as name
        var rootPathLen, name;
        if (nameIndex == pathLength - 1)
        {
            rootPathLen = rootPath.length;
            name = rootPath;
        }
        else
        {
            rootPathLen = rootPath.length + 1;
            name = rootPath.slice(nameIndex + 1);
        }

        treeRoot = new Node(name, rootPath);
        treeRoot.setSize(rootData.size);
        for (var index = 0; index < arrayData.length; index ++)
        {
            if (index == rootIndex)
            {
                continue;
            }

            var itemData = arrayData[index];

            // First remove the root path and then extra each segments from the path
            var paths = itemData.path.substring(rootPathLen).split(delimeter);
            var treeNode = treeRoot.getOrCreateChild(paths);
            treeNode.setSize(itemData.size);
        }
    }

    return treeRoot;
};

Node._count = 1;

Node.getId = function(name)
{
    var id = "O-" + (name == null ? "" : name + "-") + Node._count;

    var result = {};
    result.id = id;
    result.href = new URL(`#${id}`, location) + "";
    result.toString = function() { return "url(" + this.href + ")"; };

    Node._count ++;

    return result;
};

function getColor(index)
{
    var schemes = [
        d3.schemeCategory10, d3.schemeAccent, d3.schemeDark2, d3.schemeObservable10, d3.schemePaired,
        d3.schemePastel1, d3.schemePastel2, d3.schemeSet1, d3.schemeSet2, d3.schemeSet3, d3.schemeTableau10
    ];
    return (index >= 0 && index < schemes.length) ? schemes[index] : schemes[0];
}

function renderTreemap(tree, schemeIndex)
{
    const container = d3.select('#container');
    const borderDelta = document.documentElement.clientWidth - container.node().clientWidth + 4;
    const width = document.documentElement.clientWidth - borderDelta;
    const height = document.documentElement.clientHeight - borderDelta;
    const color = d3.scaleOrdinal(tree.children.map(d => d.name), getColor(schemeIndex));

    // Update the SVG container.
    const svg = d3.select('#svg')
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Compute the layout.
    const root = d3.treemap()
        .tile(d3.treemapBinary) // e.g., d3.treemapSquarify
        .size([width, height])
        .padding(1)
        .round(true)
        (d3.hierarchy(tree)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value));

    // Add a cell for each leaf of the hierarchy.
    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .join("g").attr("transform", d => `translate(${d.x0},${d.y0})`);
    leaf.on("click", function(event, d) { lsb.sendValue('path', d.data.path); });

    // Append a tooltip.
    const format = d3.format(",d");
    leaf.append("title").text(d => d.data.path + ' : ' + d.data.value + ' MB');

    // Append a color rectangle. 
    leaf.append("rect")
        .attr("id", d => (d.leafUid = Node.getId("leaf")).id)
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    // Append a clipPath to ensure text does not overflow.
    leaf.append("clipPath").attr("id", d => (d.clipUid = Node.getId("clip")).id)
        .append("use").attr("xlink:href", d => d.leafUid.href);

    // Append multiline text. The last line shows the value and has a specific formatting.
    leaf.append("text").attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value) + ' MB'))
    .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);

    Object.assign(svg.node(), {scales: {color}});
};

var tree = null;

function safeRender(threshold, schemeIndex)
{
    var messageText = document.getElementById("message");

    // If the data is not ready yet, output message and return
    if (data == null || data.length == 0)
    {
        messageText.innerHTML = "There is no data loaded!";
        messageText.style.color = "#800000";
        return;
    }

    // If the tree data is not built yet, build the tree now
    if (tree == null)
    {
        data.sort((a, b) => a.path.localeCompare(b.path));
        tree = Node.buildTree(data, 0);
    }

    tree.filter(threshold * 1024);

    // If there is no children, it means all folder sizes are below the threshold
    if (tree.children == undefined)
    {
        messageText.innerHTML = "No folder has size above the threshold, please adjust the threshold and retry.";
        messageText.style.color = "#808000";
    }
    else
    {
        messageText.innerHTML = "";
        renderTreemap(tree, schemeIndex);
    }
}
