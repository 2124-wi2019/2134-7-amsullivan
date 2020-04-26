/*  Anna Sullivan
  script.js
  INFO2134WW
  Thoendel
  4/25/2020
*/

window.addEventListener("load", (event) => {//event listener on page load
    const left = document.getElementById("left");
    const right = document.getElementById("right");
    const errorHolder = document.getElementById("errorHolder");
    const airportCode = document.getElementById("airportCode");
    const actionGetWeather = document.getElementById("actionGetWeather");
    const airportDIV = document.createElement("div");
    const wrapper = document.getElementById("wrapper");

    actionGetWeather.addEventListener("click", (e)=> {
        if(checkAirportCode()){//if checkAirportCode is valid
            
            displayLoading(right, "Loading content...");
            let url = `https://w1.weather.gov/xml/current_obs/display.php?stid=K${airportCode.value}`; //const url weather adding airportcode values

            fetch(url)
            .then( (response) => {//response value in then
                if(response.ok) { //if response is ok
                    return response; //return response
                }
                throw new Error("Error: " + response.statusText); //throw error log status txt
            })
            .then(response => response.text()) //change response into text
                .then(clearLoading()) //clear right div
                    .then(text => displayData(text)) //displayData called to show text from response return
                        .catch(error => console.log(error));
        }
    }); //end of actionGetWeather

    //Begin Step 2

    airportCode.addEventListener("blur", (e) => {//event listener on airportCode id on lose focus
        if(checkAirportCode() === false){//if checkAirportCode = false
            e.preventDefault(); //prevent default action
            airportCode.focus(); //focus on input field of airportCode
        } else {
            clearErrorHolder(); //clearErrorHolder function
        }

    }); //end of airportCode

    //End Step 2

    //Begin Step 3 part 1
    //const airportCodes with array of codes
    const airportCodes = ["anw", "bvn", "aia", "auh", "bie", "bta", "hte", "bbw", "cdr", 
    "olu", "fnb", "fet", "gri", "hsi", "hjh", "iml", "ear", "ibm", "lxn", "lnk", "mck", 
    "mle", "afk", "ofk", "lbf", "onl", "oga", "off", "oma", "odx", "pmv", "bff", "sny", "tqe", "tif", "vtn", "ahq", "lcg", "jyr"];

    document.body.insertBefore(airportDIV, wrapper); //add before wrapper in document body

    let airportString = "Note -- One of the following airport codes must be choosen: \n\n"; //let telling codes input info
    let entryCounter = 0; //let entryCounter set to 0
    for(let code of airportCodes){//for loop through array
        airportString += (code); 
        entryCounter++; //add to let of 0
        if(code !== "jyr"){
            airportString += ", "; //adding comma and space if not last in array
        }
        if(entryCounter == 7){//seven codes on a row
            airportString += "\n"; //add new line
            entryCounter = 0; //reset counter to 0 after adding new line
        }

    }//end of for loop

    airportDIV.innerText = airportString; //innerText string 
    //End Step 3

    function displayLoading(side, loadingText){
        if(loadingText === undefined){//if loadingText is undefined
            loadingText = "Loading content..."; //set loadingText
        }
        if(side != left && side != right){//if both sides not found
            throw new Error("displayLoading() only accepts left or right as a parameter");
        }else {
            let loadingP = document.createElement("p"); //create a p element called loadingP
            let loadingDiv = document.createElement("div"); //create a div called loadingDiv

            loadingP.innerHTML = loadingText; //putting loadingText into the p element
            side.appendChild(loadingP); //append

            loadingDiv.classList.add("loading"); //add loading class to div created
            loadingDiv.classList.add("centered");//add centered class to div created
            side.appendChild(loadingDiv); //append loading to side picked
        }
    }//end of displayLoading
    
    function clearLoading(){//function clearLoading start
        right.innerHTML = ""; //right innerHtml to blank
    }//end of clearLoading

    //Begin Step 3 part 2
    function checkAirportCode(){//function checkAirportCode to check input code
        let codeInput = airportCode.value; //variable set to input
        if(codeInput.length !== 3){//length of input is not 3
            clearErrorHolder(); //clear errorholder
            createErrorMessage("Airport code can only contain three (3) letters"); //error message
            return false;
        } else if (compareArray(codeInput) === false){//if false in function
            clearErrorHolder(); //clear errorholder
            createErrorMessage("Airport code must match a three (3) digit code listed below:"); //error message
            return false;
        }else {
            return true;//return true if passed both ifs
        }
    }//end of checkAirportCode function

    function compareArray(inputCode){
        for(let code of airportCodes){//for loop through airport code array
            if(inputCode.toLowerCase() === code.toLowerCase()){//if input matches array
                return true;
            }else{//no match return false
                return false;
            }
        }
    }//end of compareArray function

    function clearErrorHolder(){//function clearErrorHolder to clear holder
        errorHolder.innerHTML = ""; //set to blank
        errorHolder.setAttribute("class", "hidden"); //set class of errorHolder to hidden
    }//end of clearErrorHolder function

    function createErrorMessage(errorString){//function createErrorMessage to add msg onto divs
        errorHolder.innerHTML = ""; //set to blank
        errorHolder.innerHTML = errorString; //adds string to errorholder
        errorHolder.setAttribute("class", "visible");//set errorHodler class to visible
        errorHolder.classList.add("error");//add error class to errorholder
        errorHolder.classList.add("errorBox");//add errorBox class to errorholder
    }//end of createErrorMessage function

    //End of Step 3 part 2

    //Begin Step 4
    function displayData(xmlString){
        let parser = new DOMParser(); //parser = new DOMParser object
        let xmlDoc = parser.parseFromString(xmlString, "text/xml"); //setting xmlDoc to the text file parsed
        console.log(xmlDoc); //ouput to console xml file

        //setting items from xml file to let variables
        let location = xmlDoc.getElementsByTagName("location")[0].innerHTML;
        let temp_f = xmlDoc.getElementsByTagName("temp_f")[0].innerHTML;
        let temp_c = xmlDoc.getElementsByTagName("temp_c")[0].innerHTML;
        let windchill_f = xmlDoc.getElementsByTagName("windchill_f")[0].innerHTML;
        let windchill_c = xmlDoc.getElementsByTagName("Windchill_c")[0].innerHTML;
        let visibility_mi = xmlDoc.getElementsByTagName("visibility_mi")[0].innerHTML;
        let wind_mph = xmlDoc.getElementsByTagName("wind_mph")[0].innerHTML;

        //creating elements with certain text
        let h1Element = createElement("h1", "Current Weather");
        let h2Element = createElement("h2", location);
        let ulElement = createElement("ul", "");
        let li1 = createElement("li", `${temp_f}${"&#176"}F (${temp_c}${"&#176"}C)`);
        let li2 = createElement("li", `Wind Speed: ${wind_mph} MPH`);
        let li3 = createElement("li", `Visibility: ${visibility_mi} Miles`);
        

        //Begin Step 6
        clearLoading(); //clear value of right
        //End Step 6

        //append elements to the right side div below
        right.appendChild(h1Element);
        right.appendChild(h2Element);
        right.appendChild(ulElement);

        //append element li to the ul
        ulElement.appendChild(li1);
        ulElement.appendChild(li2);
        ulElement.appendChild(li3);

        //Begin Step 5 
        let imageElement = document.createElement("img");//img created
        right.appendChild(imageElement); //add imageElement to right div
        fetchWeatherIcon(imageElement, xmlDoc);//fetch weather icon and add

        
    }//end of displayData function

    function createElement(elementChoice, textChoice){//function to create element using innerHTML
        let element = document.createElement(elementChoice); //create elementChoice picked
        element.innerHTML = textChoice; //element set to text value
        return element; //return elment
    }//end of createElement function

    //End Step 4

    //Step 5 cont - 
    function fetchWeatherIcon(elementName, xmlDoc){//function to fetch icon weather
        //Begin Step 6
        let siteURL = "http://forecast.weather.gov/images/wtf/large/"; //variable let siteURL to URL size large
        //End Step 6

        let iconURL = xmlDoc.getElementsByTagName("icon_url_name")[0].innerHTMLl //let iconURL that was fetched 
        let compURL = `${siteURL}${iconURL}`; //temp literal with both URLs
        
        fetch(compURL, {
            method: "GET", //recieve data with GET
            mode: "cors", //allow outside domain
            redirect: "follow" //follow the redirect
        })
        .then((response) => {//then after a response
            if(response.ok){//if response = ok
                console.log(response); //log to console response testing
                return response.blob(); //return response as a blob
            }
            throw new Error(response.statusText); //throw error with status text
        })
            .then(blob => {
                console.log(blob); //log to console the blob testing
                elementName.src = URL.createObjectURL(blob); //set src to the return value of blob
            })
                .catch(error => console.log("Eerror retrieving icon: " + error)); //error log to console

    }//end of fetchWeatherIcon function

    //End Step 5


}); //end of event listener on page load