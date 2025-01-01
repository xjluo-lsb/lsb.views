-- Function to create default content for a graphviz file
function createDefaultContent()
  return {
    content = [[
digraph
{
    node1 -> node2
}
]],
    fileName = ""
  }
end

-- Function to launch open file dialog and select a file to open
function openGraphvizFile()
  local filePath = lsb.openFile("Open file", "Open GraphViz file (*.dot;*.gv)|*.dot;*.gv")
  if (filePath ~= nil and filePath ~= '') then
    local fileHandle = io.open(filePath, "rb")    -- r read mode and b binary mode
    if (fileHandle ~= nil) then
      local fileContent = fileHandle:read("*a")   -- *a or *all reads the whole file
      fileHandle:close()
      return {
        filePath = filePath,
        fileContent = fileContent
      }
    end
  end

  return nil
end

-- Function to save the specified content into a file specified through save dialog
function saveGraphvizFile(content)
  local filePath = lsb.saveFile("Save file", "Save GraphViz file (*.dot;*.gv)|*.dot;*.gv")
  if (filePath ~= nil and filePath ~= '') then
    local fileHandle = io.open(filePath, "w")     -- w write mode
    if (fileHandle ~= nil) then
      fileHandle:write(content)
      fileHandle:close()
    end
  end
end

-- Function to convert the specified Graphviz content into SVG graph
function graphvizToSvg(content)
  local sourceFile = lsb.getTempFile("intermediate.dot")
  local targetFile = lsb.getTempFile("result.svg")
  local file = io.open(sourceFile, "w")
  if file then
    file:write(content)
    file:close()
  end

  local command = "dot -Tsvg " .. sourceFile .. " -o " .. targetFile
  os.execute(command)
  return targetFile:gsub("\\", "/")
end
