
var ctx = canvas.getContext("2d");
var table = document.getElementById("myTable");
var rows = table.rows
var pizza, selectionHeight, mousePos, order, points, angles;

function onOpen() {
    document.onmousemove = handleMouseMove;
    ctx = canvas.getContext("2d");
    pizza = new Pizza();
    order = new Order();
    points = randomPoints(200, 0, 130);
    veggiePoints = randomPoints(200, 0, 130);
    angles = randomAngles(100, 0, 360);
    mousePos = {};
    window.onscroll(scrolled());
    var body = document.body;
    canvas.height = body.clientHeight;
    canvas.width = body.scrollWidth / 2;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setInterval(update, 40);
}

function handleMouseMove(event) {

    mousePos = {
        x: event.pageX,
        y: event.pageY
    };

}
//d
function update() {
    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //redraw pizza
    order.draw(mousePos.y);    
}

function tallyOrder() {    
    order = new Order();
    
    //Get Size ordererd
    var size = document.getElementsByName('size');
    for (var i = 0, length = size.length; i < length; i++) {        
        if (size[i].checked) {
            //order size gets type and price
            order.size = [size[i].value, parseInt(size[i].getAttribute("data-value"))];   
            break;
        } 
    }
    rows[0].cells[0].innerHTML = order.size[0];
    rows[0].cells[1].innerHTML = "$" + parseFloat(order.size[1]).toFixed(2);

    //Get Sauce ordererd
    var sauce = document.getElementsByName('sauce');
    for (var i = 0, length = sauce.length; i < length; i++) {
        if (sauce[i].checked) {
            //order size gets type and price
            order.sauce = [sauce[i].value, parseInt(sauce[i].getAttribute("data-value"))];

            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    rows[4].cells[0].innerHTML = order.sauce[0];
    rows[4].cells[1].innerHTML = "+$" + parseFloat(order.sauce[1]).toFixed(2);

    //Get cheese ordererd
    var cheese = document.getElementsByName('cheese');
    for (var i = 0, length = cheese.length; i < length; i++) {
        if (cheese[i].checked) {
            order.cheese = [cheese[i].value, parseInt(cheese[i].getAttribute("data-value"))];
            break;
        }
    }
    rows[2].cells[0].innerHTML = order.cheese[0];
    rows[2].cells[1].innerHTML = "+$" + parseFloat(order.cheese[1]).toFixed(2);

    //Get Meats ordererd
    var meats = document.getElementsByName('meat');
    for (var i = 0, length = meats.length; i < length; i++) {
        if (meats[i].checked) {
            console.log("pushing meat");
            order.meats.push(meats[i]);
        }
    }

    var cell = "";
    for(var i = 0; i < order.meats.length; i++)
    {
        if(i != 0)
            cell = cell + ", " + order.meats[i].value;
        else cell = order.meats[i].value;
      
    }
    rows[3].cells[1].innerHTML = "+$" + parseFloat(order.getMeatsPrice()).toFixed(2);
    rows[3].cells[0].innerHTML = cell;

    //Get Crust ordererd
    var crust = document.getElementsByName('crust');
    for (var i = 0, length = crust.length; i < length; i++) {
        if (crust[i].checked) {
            order.crust = [crust[i].value, parseInt(crust[i].getAttribute("data-value"))];
        }
    }
    rows[1].cells[0].innerHTML = order.crust[0];
    rows[1].cells[1].innerHTML = "+$" + parseFloat(order.crust[1]).toFixed(2);

    //Get Veggies ordererd
    var veggies = document.getElementsByName('veggie');
    for (var i = 0, length = veggies.length; i < length; i++) {
        if (veggies[i].checked) {
            order.veggies.push(veggies[i]);
        }
    }
    var cell = "";
    for(var i = 0; i < order.veggies.length; i++)
    {
        if(i != 0)
            cell = cell + ", " + order.veggies[i].value;
        else cell = order.veggies[i].value;
      
    }
    rows[5].cells[1].innerHTML = "+$" + parseFloat(order.getVeggiesPrice()).toFixed(2);
    rows[5].cells[0].innerHTML = cell;

    console.log(order.toString());
    rows[6].cells[1].innerHTML = "$" + calcPrice();    
}

function randomPoints(count, low, high) {
    var local_points = [];
    for (var i = 0; i < count; i++) {
        var point = {
            x: (Math.floor(Math.random() * (high - low + 1) + low)),
            y: (Math.floor(Math.random() * (high - low + 1) + low))
        };
        local_points.push(point);
    }
    return local_points;
}

function randomAngles(count, low, high) {
    var angles = [];
    for (var i = 0; i < count; i++) {
        angle = Math.floor(Math.random() * (high - low + 1) + low);
        angles.push(angle);
    }
    return angles;
}

function submitOrder() {
    //tally everything one last time
    tallyOrder();
    //calculate price with current rates
    calcPrice(order);
    //if every option selected, display the recipt
    if(order.sauce.length > 0 && order.size.length > 0 && order.cheese.length > 0 && order.crust.length > 0 && order.meats.length > 0 && order.veggies.length > 0)
        table.style.visibility = "visible";
    else
        alert("Please make a selection in every field.");

}

function calcPrice() {
    //size price
    var size = parseFloat(order.getSizePrice()).toFixed(2);

    //sauce price
    var sauce = parseFloat(order.getSaucePrice()).toFixed(2);

    //cheese price
    var cheese = parseFloat(order.getCheesePrice()).toFixed(2);

    //meats price
    var meats = parseFloat(order.getMeatsPrice()).toFixed(2);

    //crust price
    var crust = parseFloat(order.getCrustPrice()).toFixed(2);

    //veggies price
    var veggies = parseFloat(order.getVeggiesPrice()).toFixed(2);

    //total
    var total = parseFloat(size) + parseFloat(sauce) + parseFloat(meats) + parseFloat(cheese) + parseFloat(crust) + parseFloat(veggies);

    return parseFloat(total).toFixed(2);
}

class Order {
    constructor() {
        this.size = [];
        this.sauce = [];
        this.cheese = [];
        this.meats = [];
        this.crust = [];
        this.veggies = [];
    }


    //draw pizza being ordered on the canvas
    draw(height) {

        var zzaRadius = 100;
        //draw pizza outline circle
        ctx.beginPath();
        ctx.arc(200, height, zzaRadius, 0, 2 * Math.PI);
        ctx.stroke();

        //draw dough
        ctx.beginPath();
        ctx.arc(200, height, zzaRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "gold";
        ctx.fill();

        //draw sauce
        if (this.sauce.length > 0) {
            ctx.beginPath();
            ctx.arc(200, height, 90, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
        }

        //draw cheese
        if (this.cheese.length > 0) {
            for (var i = 0; i < points.length; i++) {
                //draw cheese squares randomly on pizza
                ctx.fillStyle = "white";


                ctx.fillRect(points[i].x + 130, points[i].y + height - 70, 4, 16);
            }
        }

        //draw meats
        if (this.meats.length > 0) {
            for (var i = 0; i < 30; i++) {


                ctx.beginPath();
                ctx.arc(points[i].x + 130, points[i].y + height - 70, 5, 0, 2 * Math.PI);
                ctx.fillStyle = "darkred";
                ctx.fill();
            }
        }

        //draw veggies
        if (this.veggies.length > 0) {
            for (var i = 0; i < 60; i++) {


                ctx.beginPath();
                ctx.arc(veggiePoints[i].x + 130, veggiePoints[i].y + height - 70, 2, 0, 2 * Math.PI);
                ctx.fillStyle = "green";
                ctx.fill();
            }
        }
    }

    getSizePrice() {
        return parseFloat(this.size[1]).toFixed(2);
    }

    getSaucePrice() {
        return parseFloat(0).toFixed(2);
    }

    getCheesePrice() {
        console.log("checking for extra cheese: " + this.cheese[0]);
        if (this.cheese[0] == "Extra Cheese") {
            console.log("Extra cheeseyyy returning 3");
            return 3;
            
        }
        return 0;
    }

    getMeatsPrice() {
        var total = 0;
        var price = 1;
        //first topping free, tally the rest
        for (var i = 0; i < this.meats.length; i++) {
            if (i > 0)
                total = total + price;
        }

        return parseFloat(total).toFixed(2);

    }

    getCrustPrice() {
        return parseInt(this.crust[1]) + 0.00;
    }

    getVeggiesPrice() {
        var total = 0;
        var price = 1;
        //first topping free, tally the rest
        for (var i = 0; i < this.veggies.length; i++) {
            if (i > 0)
                total = total + price;
        }
        return total + 0.00;

    }

    toString() {
        var out = "Size: " + this.size[0] + ": " + this.size[1] + "$" + "\n" +
            "Sauce: " + this.sauce[0] + ": " + this.sauce[1] + "$" + "\n" +
            "Cheese: " + this.cheese[0] + ": " + this.cheese[1] + "$" + "\n";

        var meatOut = "Meats: \n";

        for (var i = 0; i < this.meats.length; i++) {
            meatOut = meatOut + this.meats[i].value + "\n";
        }

        var crustOut = this.crust[0] + ": " + this.crust[1] + "$" + "\n";

        var veggieOut = "Veggies: \n";
        for (var i = 0; i < this.veggies.length; i++) {
            veggieOut = veggieOut + this.veggies[i].value + "\n";
        }
        return out + meatOut + crustOut + veggieOut;
    }
}

class Pizza {
    constructor() {
        this.size = [];
        this.sauce = [];
        this.cheese = [];
        this.meats = [];
        this.crust = [];
        this.veggies = [];
    }


}
