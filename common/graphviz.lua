-- This is the Lua script file for the graphviz view. Functions defined here can be directly used in the view.

-- \brief Function to create default content for a graphviz file
-- @param none
-- @return The object that contains initial content for graphviz and the file path (empty)
function createDefaultContent()
  return {
    filePath = "",
    fileContent = [[
digraph
{
    node1 -> node2
}
]]
  }
end

-- \brief Function to launch open file dialog and select a file to open
-- @param none
-- @return An object that contains the file path and file content, or nil if no file is selected
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

-- \brief Function to save the specified content into a file specified through save dialog
-- @param content The graphviz content
-- @return none
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

-- \brief Function to convert the specified Graphviz content into SVG graph.
-- When the conversion is successfully done, then the SVG file path will be returned, other error message will be shown
-- and then nil is returned.
-- @param content The graphviz document content to be rendered into SVG
-- @return none
function graphvizToSvg(content)
  local sourceFile = lsb.getTempFile("intermediate.dot")
  local targetFile = lsb.getTempFile("result.svg")
  local file = io.open(sourceFile, "w")
  if file then
    file:write(content)
    file:close()
  end

  -- The file paths might contain space, wrap them with double quotes
  local command = "dot -Tsvg \"" .. sourceFile .. "\" -o \"" .. targetFile .. "\""
  local ok, why, code = os.execute(command)
  if ok then
    return targetFile:gsub("\\", "/")
  else
    local message = "Command execution failed: " .. why .. ", error code: " .. code .. "\n\t" .. command;
    lsb.showError(message)
    return nil
  end  
end
