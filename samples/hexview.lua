-- Function to select a file from file system
function selectFile()
  local filePath = lsb.openFile("Open file", "Open binary file (*.bin)|*.bin")
  if (filePath ~= nil and filePath ~= '') then
    return { filePath = filePath }
  else
    return nil
  end
end

-- Function to load content from specified file and return the content as hexadecimal string
function loadFileContentAsHexString(filePath)
  -- r read mode and b binary mode
  local fileHandle = io.open(filePath, "rb")
  if (fileHandle ~= nil) then
    -- *a or *all reads the whole file
    local fileContent = fileHandle:read("*a")
    fileHandle:close()

    if (fileContent ~= nil) then
      local result = ""
      -- gfind has been replaced by gmatch since from Lua 5.1
	    for b in string.gmatch(fileContent, ".") do
        result = result .. string.format("%02X", string.byte(b))
	    end
	    return result
    end
  end

  return nil
end
