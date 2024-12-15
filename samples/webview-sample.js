var count = 0;

function onClick1()
{
    if (lsb == null)
    {
        alert("lsb is null");
    }
    else if (lsb.sendValue == null)
    {
        alert("lsb.sendValue is null");
    }
    else if (count > 0)
    {
        lsb.sendValue("SimpleValue", "This have been {0} clicks on the button.".format(count + 1));
        count ++;
    }
    else
    {
        lsb.showInformation("This is the first click and it triggers this message dialog.\nStarting from next click, it will send value out.");
        count = 1;
    }
    
    document.getElementById('count').innerHTML = count;
}

function onClick2()
{
    lsb.sendObject({
        SimpleValue: count + 1,
        ComplexValue: "{ a: 1, b: 'string' }"
    });
    
    if (count > 0) count ++;
    document.getElementById('count').innerHTML = count;
}

function onClick3()
{
    lsb.sendData({
        BooleanValue: true,
        NumberValue: (count + 1) * (count + 1),
        StringValue: "{ a: " + count + ", b: 'string' }"
    });
    
    if (count > 0) count ++;
    document.getElementById('count').innerHTML = count;

    lsb.sendValue("DataReady", true);
}
