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
