public class HighestElevation
{
    public string Location { get; set; }
    public decimal Elevation { get; set; }

    public HighestElevation(string location, decimal elevation)
    {
        this.Location = location;
        this.Elevation = elevation;
    }
};

public class State
{
    public required string Name { get; set;}
    public required string Capital { get; set; }
    public decimal Population { get; set; }
    public decimal Area { get; set; }
    public required HighestElevation Highest { get; set; }
};

public class SaleRecord
{
    public required string County { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    public decimal PostalCode { get; set; }
    public decimal Year { get; set; }
    public required string Make { get; set; }
    public required string Model { get; set; }
}