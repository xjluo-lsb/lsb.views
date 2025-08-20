using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var states = new List<State>
{
    new State { Name = "Alabama", Capital = "Montgomery", Population = 5_074_296, Area = 52_420, Highest = new HighestElevation("Cheaha Mountain", 2_413) },
    new State { Name = "Alaska", Capital = "Juneau", Population = 733_406, Area = 665_384, Highest = new HighestElevation("Denali", 20_310) },
    new State { Name = "Arizona", Capital = "Phoenix", Population = 7_359_191, Area = 113_990, Highest = new HighestElevation("Humphreys Peak", 12_637) },
    new State { Name = "Arkansas", Capital = "Little Rock", Population = 3_050_334, Area = 53_179, Highest = new HighestElevation("Magazine Mountain", 2_753) },
    new State { Name = "California", Capital = "Sacramento", Population = 39_431_000, Area = 163_696, Highest = new HighestElevation("Mount Whitney", 14_494) },
    new State { Name = "Colorado", Capital = "Denver", Population = 5_987_073, Area = 104_094, Highest = new HighestElevation("Mount Elbert", 14_440) },
    new State { Name = "Connecticut", Capital = "Hartford", Population = 3_640_329, Area = 5_543, Highest = new HighestElevation("Mount Frissell (slope)", 2_380) },
    new State { Name = "Delaware", Capital = "Dover", Population = 1_036_036, Area = 2_489, Highest = new HighestElevation("Ebright Azimuth", 448) },
    new State { Name = "Florida", Capital = "Tallahassee", Population = 23_372_000, Area = 65_758, Highest = new HighestElevation("Britton Hill", 345) },
    new State { Name = "Georgia", Capital = "Atlanta", Population = 11_021_634, Area = 59_425, Highest = new HighestElevation("Brasstown Bald", 4_784) },
    new State { Name = "Hawaii", Capital = "Honolulu", Population = 1_420_491, Area = 10_931, Highest = new HighestElevation("Mauna Kea (from sea level)", 13_796) },
    new State { Name = "Idaho", Capital = "Boise", Population = 1_932_866, Area = 83_569, Highest = new HighestElevation("Borah Peak", 12_662) },
    new State { Name = "Illinois", Capital = "Springfield", Population = 12_569_321, Area = 57_914, Highest = new HighestElevation("Charles Mound", 1_235) },
    new State { Name = "Indiana", Capital = "Indianapolis", Population = 6_858_986, Area = 36_420, Highest = new HighestElevation("Hoosier Hill", 1_257) },
    new State { Name = "Iowa", Capital = "Des Moines", Population = 3_179_849, Area = 56_272, Highest = new HighestElevation("Hawkeye Point", 1_670) },
    new State { Name = "Kansas", Capital = "Topeka", Population = 2_937_880, Area = 82_278, Highest = new HighestElevation("Mount Sunflower", 4_039) },
    new State { Name = "Kentucky", Capital = "Frankfort", Population = 4_569_305, Area = 40_408, Highest = new HighestElevation("Black Mountain", 4_145) },
    new State { Name = "Louisiana", Capital = "Baton Rouge", Population = 4_628_797, Area = 52_378, Highest = new HighestElevation("Driskill Mountain", 535) },
    new State { Name = "Maine", Capital = "Augusta", Population = 1_360_260, Area = 35_380, Highest = new HighestElevation("Mount Katahdin", 5_268) },
    new State { Name = "Maryland", Capital = "Annapolis", Population = 6_177_224, Area = 12_406, Highest = new HighestElevation("Backbone Mountain", 3_360) },
    new State { Name = "Massachusetts", Capital = "Boston", Population = 7_200_000, Area = 10_565, Highest = new HighestElevation("Mount Greylock", 3_491) },
    new State { Name = "Michigan", Capital = "Lansing", Population = 10_034_113, Area = 96_716, Highest = new HighestElevation("Mount Arvon", 1_979) },
    new State { Name = "Minnesota", Capital = "Saint Paul", Population = 5_800_000, Area = 86_936, Highest = new HighestElevation("Eagle Mountain", 2_301) },
    new State { Name = "Mississippi", Capital = "Jackson", Population = 2_930_472, Area = 48_430, Highest = new HighestElevation("Woodall Mountain", 807) },
    new State { Name = "Missouri", Capital = "Jefferson City", Population = 6_200_000, Area = 69_715, Highest = new HighestElevation("Taum Sauk Mountain", 1_772) },
    new State { Name = "Montana", Capital = "Helena", Population = 1_139_449, Area = 147_040, Highest = new HighestElevation("Granite Peak", 12_807) },
    new State { Name = "Nebraska", Capital = "Lincoln", Population = 1_969_845, Area = 77_358, Highest = new HighestElevation("Panorama Point", 5_424) },
    new State { Name = "Nevada", Capital = "Carson City", Population = 3_100_000, Area = 110_572, Highest = new HighestElevation("Boundary Peak", 13_147) },
    new State { Name = "New Hampshire", Capital = "Concord", Population = 1_395_231, Area = 9_349, Highest = new HighestElevation("Mount Washington", 6_288) },
    new State { Name = "New Jersey", Capital = "Trenton", Population = 9_300_000, Area = 8_723, Highest = new HighestElevation("High Point", 1_803) },
    new State { Name = "New Mexico", Capital = "Santa Fe", Population = 2_100_000, Area = 121_590, Highest = new HighestElevation("Wheeler Peak", 13_161) },
    new State { Name = "New York", Capital = "Albany", Population = 19_867_000, Area = 54_555, Highest = new HighestElevation("Mount Marcy", 5_344) },
    new State { Name = "North Carolina", Capital = "Raleigh", Population = 10_800_000, Area = 53_819, Highest = new HighestElevation("Mount Mitchell", 6_684) },
    new State { Name = "North Dakota", Capital = "Bismarck", Population = 780_000, Area = 70_704, Highest = new HighestElevation("White Butte", 3_506) },
    new State { Name = "Ohio", Capital = "Columbus", Population = 11_760_000, Area = 44_825, Highest = new HighestElevation("Campbell Hill", 1_549) },
    new State { Name = "Oklahoma", Capital = "Oklahoma City", Population = 4_000_000, Area = 69_899, Highest = new HighestElevation("Black Mesa", 4_973) },
    new State { Name = "Oregon", Capital = "Salem", Population = 4_300_000, Area = 98_381, Highest = new HighestElevation("Mount Hood", 11_249) },
    new State { Name = "Pennsylvania", Capital = "Harrisburg", Population = 13_079_000, Area = 46_056, Highest = new HighestElevation("Mount Davis", 3_213) },
    new State { Name = "Rhode Island", Capital = "Providence", Population = 1_100_000, Area = 1_545, Highest = new HighestElevation("Jerimoth Hill", 812) },
    new State { Name = "South Carolina", Capital = "Columbia", Population = 5_300_000, Area = 32_020, Highest = new HighestElevation("Sassafras Mountain", 3_554) },
    new State { Name = "South Dakota", Capital = "Pierre", Population = 900_000, Area = 77_116, Highest = new HighestElevation("Black Elk Peak", 7_242) },
    new State { Name = "Tennessee", Capital = "Nashville", Population = 7_100_000, Area = 42_143, Highest = new HighestElevation("Clingmans Dome", 6_643) },
    new State { Name = "Texas", Capital = "Austin", Population = 31_291_000, Area = 268_596, Highest = new HighestElevation("Guadalupe Peak", 8_751) },
    new State { Name = "Utah", Capital = "Salt Lake City", Population = 3_500_000, Area = 84_899, Highest = new HighestElevation("Kings Peak", 13_528) },
    new State { Name = "Vermont", Capital = "Montpelier", Population = 650_000, Area = 9_616, Highest = new HighestElevation("Mount Mansfield", 4_393) },
    new State { Name = "Virginia", Capital = "Richmond", Population = 8_600_000, Area = 42_775, Highest = new HighestElevation("Mount Rogers", 5_729) },
    new State { Name = "Washington", Capital = "Olympia", Population = 7_900_000, Area = 71_298, Highest = new HighestElevation("Mount Rainier", 14_411) },
    new State { Name = "West Virginia", Capital = "Charleston", Population = 1_800_000, Area = 24_230, Highest = new HighestElevation("Spruce Knob", 4_863) },
    new State { Name = "Wisconsin", Capital = "Madison", Population = 5_900_000, Area = 65_496, Highest = new HighestElevation("Timms Hill", 1_951) },
    new State { Name = "Wyoming", Capital = "Cheyenne", Population = 580_000, Area = 97_813, Highest = new HighestElevation("Gannett Peak", 13_810) }
};

var sales = new List<SaleRecord>
{
    new SaleRecord { County = "Yakima", City = "Yakima", State = "WA", PostalCode = 98901, Year = 2019, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Kitsap", City = "Port Orchard", State = "WA", PostalCode = 98367, Year = 2024, Make = "JEEP", Model = "WRANGLER" },
    new SaleRecord { County = "Snohomish", City = "Lynnwood", State = "WA", PostalCode = 98036, Year = 2022, Make = "KIA", Model = "NIRO" },
    new SaleRecord { County = "King", City = "Auburn", State = "WA", PostalCode = 98001, Year = 2017, Make = "BMW", Model = "X5" },
    new SaleRecord { County = "Skagit", City = "Mount Vernon", State = "WA", PostalCode = 98273, Year = 2013, Make = "NISSAN", Model = "LEAF" },
    new SaleRecord { County = "Snohomish", City = "Marysville", State = "WA", PostalCode = 98270, Year = 2016, Make = "NISSAN", Model = "LEAF" },
    new SaleRecord { County = "Chelan", City = "Manson", State = "WA", PostalCode = 98831, Year = 2016, Make = "TESLA", Model = "MODEL S" },
    new SaleRecord { County = "Snohomish", City = "Bothell", State = "WA", PostalCode = 98021, Year = 2023, Make = "TESLA", Model = "MODEL Y" },
    new SaleRecord { County = "Snohomish", City = "Edmonds", State = "WA", PostalCode = 98020, Year = 2015, Make = "NISSAN", Model = "LEAF" },
    new SaleRecord { County = "Snohomish", City = "Everett", State = "WA", PostalCode = 98208, Year = 2016, Make = "PORSCHE", Model = "CAYENNE" },
    new SaleRecord { County = "Kitsap", City = "Port Orchard", State = "WA", PostalCode = 98366, Year = 2019, Make = "TESLA", Model = "MODEL S" },
    new SaleRecord { County = "Snohomish", City = "Monroe", State = "WA", PostalCode = 98272, Year = 2021, Make = "BMW", Model = "X5" },
    new SaleRecord { County = "Snohomish", City = "Everett", State = "WA", PostalCode = 98208, Year = 2017, Make = "CHEVROLET", Model = "BOLT EV" },
    new SaleRecord { County = "Yakima", City = "Yakima", State = "WA", PostalCode = 98901, Year = 2019, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Snohomish", City = "Bothell", State = "WA", PostalCode = 98012, Year = 2021, Make = "POLESTAR", Model = "PS2" },
    new SaleRecord { County = "Snohomish", City = "Edmonds", State = "WA", PostalCode = 98026, Year = 2020, Make = "KIA", Model = "NIRO" },
    new SaleRecord { County = "Spokane", City = "Spokane", State = "WA", PostalCode = 99223, Year = 2018, Make = "NISSAN", Model = "LEAF" },
    new SaleRecord { County = "Snohomish", City = "Snohomish", State = "WA", PostalCode = 98290, Year = 2013, Make = "NISSAN", Model = "LEAF" },
    new SaleRecord { County = "Snohomish", City = "Everett", State = "WA", PostalCode = 98204, Year = 2023, Make = "NISSAN", Model = "ARIYA" },
    new SaleRecord { County = "Snohomish", City = "Everett", State = "WA", PostalCode = 98203, Year = 2018, Make = "HONDA", Model = "CLARITY" },
    new SaleRecord { County = "Skagit", City = "Anacortes", State = "WA", PostalCode = 98221, Year = 2024, Make = "KIA", Model = "NIRO" },
    new SaleRecord { County = "Snohomish", City = "Bothell", State = "WA", PostalCode = 98012, Year = 2023, Make = "TESLA", Model = "MODEL Y" },
    new SaleRecord { County = "Yakima", City = "Yakima", State = "WA", PostalCode = 98901, Year = 2024, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Kitsap", City = "Bremerton", State = "WA", PostalCode = 98337, Year = 2019, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Fairfax", City = "Burke", State = "VA", PostalCode = 22015, Year = 2019, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Thurston", City = "Olympia", State = "WA", PostalCode = 98513, Year = 2025, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Yakima", City = "Yakima", State = "WA", PostalCode = 98901, Year = 2020, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Snohomish", City = "Bothell", State = "WA", PostalCode = 98021, Year = 2020, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Snohomish", City = "Everett", State = "WA", PostalCode = 98208, Year = 2018, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Thurston", City = "Olympia", State = "WA", PostalCode = 98502, Year = 2018, Make = "BMW", Model = "I3" },
    new SaleRecord { County = "Chelan", City = "Cashmere", State = "WA", PostalCode = 98815, Year = 2013, Make = "NISSAN", Model = "LEAF" },
    new SaleRecord { County = "Thurston", City = "Olympia", State = "WA", PostalCode = 98513, Year = 2020, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Chelan", City = "Manson", State = "WA", PostalCode = 98831, Year = 2023, Make = "TESLA", Model = "MODEL Y" },
    new SaleRecord { County = "Spokane", City = "Spokane", State = "WA", PostalCode = 99203, Year = 2021, Make = "VOLVO", Model = "XC90" },
    new SaleRecord { County = "Snohomish", City = "Everett", State = "WA", PostalCode = 98208, Year = 2014, Make = "NISSAN", Model = "LEAF" },
    new SaleRecord { County = "Snohomish", City = "Bothell", State = "WA", PostalCode = 98012, Year = 2024, Make = "TESLA", Model = "CYBERTRUCK" },
    new SaleRecord { County = "Snohomish", City = "Snohomish", State = "WA", PostalCode = 98296, Year = 2017, Make = "BMW", Model = "I3" },
    new SaleRecord { County = "Snohomish", City = "Bothell", State = "WA", PostalCode = 98021, Year = 2020, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Snohomish", City = "Sultan", State = "WA", PostalCode = 98294, Year = 2019, Make = "TESLA", Model = "MODEL S" },
    new SaleRecord { County = "Kittitas", City = "Ellensburg", State = "WA", PostalCode = 98926, Year = 2017, Make = "CHEVROLET", Model = "BOLT EV" },
    new SaleRecord { County = "Thurston", City = "Olympia", State = "WA", PostalCode = 98501, Year = 2025, Make = "VOLVO", Model = "XC60" },
    new SaleRecord { County = "King", City = "Issaquah", State = "WA", PostalCode = 98027, Year = 2021, Make = "AUDI", Model = "E-TRON" },
    new SaleRecord { County = "Snohomish", City = "Mukilteo", State = "WA", PostalCode = 98275, Year = 2013, Make = "NISSAN", Model = "LEAF" },
    new SaleRecord { County = "Skagit", City = "Sedro-Woolley", State = "WA", PostalCode = 98284, Year = 2013, Make = "NISSAN", Model = "LEAF" },
    new SaleRecord { County = "Snohomish", City = "Mill Creek", State = "WA", PostalCode = 98012, Year = 2022, Make = "FORD", Model = "ESCAPE" },
    new SaleRecord { County = "Skagit", City = "Anacortes", State = "WA", PostalCode = 98221, Year = 2019, Make = "AUDI", Model = "E-TRON" },
    new SaleRecord { County = "Snohomish", City = "Lynnwood", State = "WA", PostalCode = 98036, Year = 2019, Make = "AUDI", Model = "E-TRON" },
    new SaleRecord { County = "Thurston", City = "Lacey", State = "WA", PostalCode = 98516, Year = 2023, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Thurston", City = "Olympia", State = "WA", PostalCode = 98501, Year = 2020, Make = "TESLA", Model = "MODEL Y" },
    new SaleRecord { County = "Snohomish", City = "Snohomish", State = "WA", PostalCode = 98290, Year = 2015, Make = "CHEVROLET", Model = "VOLT" },
    new SaleRecord { County = "Snohomish", City = "Edmonds", State = "WA", PostalCode = 98020, Year = 2022, Make = "AUDI", Model = "Q5" },
    new SaleRecord { County = "Thurston", City = "Olympia", State = "WA", PostalCode = 98506, Year = 2014, Make = "FIAT", Model = "500" },
    new SaleRecord { County = "Snohomish", City = "Mukilteo", State = "WA", PostalCode = 98275, Year = 2020, Make = "JAGUAR", Model = "I-PACE" },
    new SaleRecord { County = "Snohomish", City = "Edmonds", State = "WA", PostalCode = 98026, Year = 2017, Make = "NISSAN", Model = "LEAF" },
    new SaleRecord { County = "Snohomish", City = "Lynnwood", State = "WA", PostalCode = 98036, Year = 2020, Make = "KIA", Model = "NIRO" },
    new SaleRecord { County = "Whitman", City = "Pullman", State = "WA", PostalCode = 99163, Year = 2018, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Yakima", City = "Selah", State = "WA", PostalCode = 98942, Year = 2025, Make = "TESLA", Model = "MODEL Y" },
    new SaleRecord { County = "Whitman", City = "Pullman", State = "WA", PostalCode = 99163, Year = 2018, Make = "TESLA", Model = "MODEL 3" },
    new SaleRecord { County = "Snohomish", City = "Bothell", State = "WA", PostalCode = 98021, Year = 2015, Make = "TESLA", Model = "MODEL S" },
    new SaleRecord { County = "Snohomish", City = "Mukilteo", State = "WA", PostalCode = 98275, Year = 2021, Make = "POLESTAR", Model = "PS2" },
    new SaleRecord { County = "Snohomish", City = "Edmonds", State = "WA", PostalCode = 98026, Year = 2025, Make = "BMW", Model = "I7" },
    new SaleRecord { County = "Yakima", City = "Moxee", State = "WA", PostalCode = 98936, Year = 2012, Make = "CHEVROLET", Model = "VOLT" },
    new SaleRecord { County = "Whitman", City = "Pullman", State = "WA", PostalCode = 99163, Year = 2024, Make = "MAZDA", Model = "CX-90" },
    new SaleRecord { County = "Grant", City = "Moses Lake", State = "WA", PostalCode = 98837, Year = 2015, Make = "FORD", Model = "FUSION" }
};

app.MapGet("/states/json", () =>
{
    return Results.Json(states);
});

app.MapGet("/states/csv", () =>
{
    var csv = new StringBuilder();
    csv.AppendLine("Name,Capital,Population,Area, HighestLocation,HighestElevation");
    foreach (var s in states)
    {
        csv.AppendLine($"{s.Name},{s.Capital},{s.Population},{s.Area},{s.Highest.Location},{s.Highest.Elevation}");
    }

    return Results.Text(csv.ToString(), "text/csv");
});

app.MapGet("/states/population", () =>
{
    // The categorical data needs to be in format of,
    //  {
    //    "labels": [ "January", "February", "March", "April", "May", "June", "July" ],
    //    "dataset_1": [ 3, 2.5, 1.2, 3, 4, 5, 1 ],
    //    "dataset_2": [ 1, 1.33, 2.5, 2, 3, 1.8, 0.4 ],
    //    ...
    //  }
    var labels = string.Join(',', states.Select(s => $"\"{s.Name}\""));
    var population = string.Join(',', states.Select(s => s.Population.ToString()));
    var text = $"{{ \"labels\": [{labels}], \"population\": [{population}] }}";
    return Results.Text(text, "text/json");
});

app.MapGet("/states/area", () =>
{
    // The categorical data needs to be in format of,
    //  {
    //    "labels": [ "January", "February", "March", "April", "May", "June", "July" ],
    //    "dataset_1": [ 3, 2.5, 1.2, 3, 4, 5, 1 ],
    //    "dataset_2": [ 1, 1.33, 2.5, 2, 3, 1.8, 0.4 ],
    //    ...
    //  }
    var labels = string.Join(',', states.Select(s => $"\"{s.Name}\""));
    var area = string.Join(',', states.Select(s => s.Area.ToString()));
    var text = $"{{ \"labels\": [{labels}], \"area\": [{area}] }}";
    return Results.Text(text, "text/json");
});

app.MapGet("/sales/json", () =>
{
    return Results.Json(sales);
});

app.MapGet("/sales/csv", () =>
{
    var csv = new StringBuilder();
    csv.AppendLine("County,City,State,PostalCode,Year,Make,Model");
    foreach (var s in sales)
    {
        csv.AppendLine($"{s.County},{s.City},{s.State},{s.PostalCode},{s.Year},{s.Make},{s.Model}");
    }

    return Results.Text(csv.ToString(), "text/csv");
});

app.Run();
