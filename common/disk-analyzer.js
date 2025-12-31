//! \brief This function can be recognized as constructor of the Node class
//! @param name Name of the node
//! @param path Path to the folder for the node
function Node(name, path)
{
    this.name = name;
    this.path = path;
    this.size = 0;                  // This is the actual size of the folder, including child folders
    this.value = undefined;         // This is the value field for treemap
    this.children = [];             // This is for visible children
    this.hidden = undefined;        // This is for hidden children (that does not meet size filter)
}

//! \brief This method tries to find or creates the node specified by paths
//! @param paths Name of each folder in the path, from top to leaf
//! @return The found or the created node
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

//! \brief Set the size for the node
//! @param size The size of the node. It could be either integer or string, which will be always stored as integer.
Node.prototype.setSize = function(size)
{
    this.size = (typeof size == 'number') ? size : parseInt(size);
};

//! \brief Filter the tree from current node based on the threshold to see if it should be visible or not in the treemap
//! @param threshold This is the threshold on size to determine if current node and it's child nodes shoule be visible
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

//! \brief Function to build a tree presentation from the input data in form of array
//! @param arrayData Data for all nodes in the form of array
//! @param rootIndex The index of the root node in the array data
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

//! Default count to 1, this is used to generated ID
Node._count = 1;

//! \brief Static function to generate ID for node with specified name
//! @param name Unique name part to be included in the ID
//! @return The generated ID
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

//! \brief Function to get colour for node with specified index. When the index is greater than available colour count, then
//! duplicated colour could be used and returned.
//! @param index Index of colour to be retrieved
//! @return The found colour value
function getColor(index)
{
    var schemes = [
        d3.schemeCategory10, d3.schemeAccent, d3.schemeDark2, d3.schemeObservable10, d3.schemePaired,
        d3.schemePastel1, d3.schemePastel2, d3.schemeSet1, d3.schemeSet2, d3.schemeSet3, d3.schemeTableau10
    ];
    return (index >= 0 && index < schemes.length) ? schemes[index] : schemes[0];
}

//! \brief Function to render the treemap with specified scheme
//! @param tree        The tree data
//! @param schemeIndex Index of the scheme to be used
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
    leaf.append("title").text(d => d.data.path + ' : ' + d.data.value + ' KB');

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
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value) + ' KB'))
    .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);

    Object.assign(svg.node(), {scales: {color}});
};

var tree = null;

//! \brief Render the treemap safely. Error cases are handled automatically.
//! @param threshold   Threshold on size to select noded in the treemap
//! @param schemeIndex Index of the color scheme to be used
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

    tree.filter(threshold);

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
