-- Function to create sample data for list view
function createSampleDataForListView()
    return {
        { Name = "String value", Value = "This is a single line string value" },
        { Name = "Boolean value", Value = true },
        { Name = "Integer value", Value = 818 },
        { Name = "Float number", Value = 99.33 },
        { Name = "Long string value", Value = [[This is a long string value.
A second line here.]] }
    }
end

-- Function to create sample data for tree view
function createSampleDataForTreeView()
    return {
        name = "Parent item",
        child =
        {
            -- First child
            {
                name = "Child item",
                child =
                {
                    { name = "Grand child 1 item", },
                    { name = "Grand child 2 item", },
                }
            }
        }
    }
end

-- Function to create sample data for tree list view
function createSampleDataForTreeListView()
    return
    {
        Name = "Parent item",
        Value = "Parent value",
        child = {
            {
                Name = "Child item",
                Value = "Child value",
                child = {
                {
                    Name = "Grand child 1 item",
                    Value = "Grand child 1 value"
                },
                {
                    Name = "Grand child 2 item",
                    Value = "Grand child 2 value"
                },
                }
            }
        }
    }
end

-- Function to create sample data for chart view
function createSamepleDataForColumnChart()
    return {
        labels = { "January", "February", "March", "April", "May", "June", "July" },
        dataset_1 = { 3, 2.5, 1.2, 3, 4, 5, 1 },
        dataset_2 = { 1, 1.33, 2.5, 2, 3, 1.8, 0.4 },
        dataset_3 = { 2.3, 0.5, 1.5, 4, 1, 0.5, 0.4 }
    }
end
