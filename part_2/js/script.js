/*  Anna Sullivan
  script.js
  INFO2134WW
  Thoendel
  4/25/2020
*/

window.addEventListener("load", (event) => {//start of event listener of page load
    const errorHolder = document.getElementById("errorHolder"); //const of errorHolder div
    const wrapper = document.getElementById("wrapper"); //const of wrapper div
    const right = document.getElementById("right"); //const of right div
    const left = document.getElementById("left"); //const of left div

    //Begin Step 1
    displayLoading(left, "Loading employee list..."); //function to display left loading content
    const listURL = "https://www.mccinfo.net/epsample/employees"; //const with url of list

    fetch(listURL)
        .then((response) => {//response received
            if(response.ok){//response is ok
                return response.json(); //return the response as a json
            }
                throw new Error(response.statusText); //throws an error of response
        })
            .then((employees) => {//json data returned used
                console.log(employees); //log to console

                let elementP = document.createElement("p"); //create p element
                elementP.innerHTML = "Select an employee from the list below:"; //setting text into the p element

                let employeeList = document.createElement("select"); //create select element
                employeeList.id = "employeeList"; //set id of select created

                let option = document.createElement("option"); //create option element
                option.value = ""; //set value of option to blank
                option.innerHTML = "-- Select an option --"; //set text of option element
                employeeList.appendChild(option); //apend option to select option

                for(let employee of employees){//for loop through json data
                    option = document.createElement("option"); //create option per loop
                    option.value = employee.id; //set id to option value
                    option.innerHTML = `${employee.first_name} ${employee.last_name} (${employee.department.name})`; //string literal with employee first last and depatment name 
                    employeeList.appendChild(option); //append option created to employeelist
                }
                clearContainer(left); //envoke function clearContainer left div
                left.appendChild(elementP); //append p element to left div
                left.appendChild(employeeList); //append employeelist to left div
                employeeList.addEventListener("change", onChange); //when change of employeelist changes log to onChange
            })
                .catch(error => console.log("Error: " + error));//catch error and log to console

    function clearContainer(side){//function to clear side 
    side.innerHTML = ""; //set side to clear
    }//end of clearContainer function

    function displayLoading(side, text){//function to display text of loading
        if(text === undefined){//text not specified
            text = "Loading content..."; //set text to loading content
        }
        if(side != left && side != right){//side is not left or right
            throw new Error("Side parameter must be left or right!"); //throws error
        }else {//side was left or right
            let loadingP = document.createElement("p"); //create p element
            let newDiv = document.createElement("div"); //create div element

            loadingP.innerText = text; //set innertext of text variable
            side.appendChild(loadingP); //append chield to side specified
            newDiv.classList.add("loading");//adds loading class to div
            newDiv.classList.add("centered");//adds centered class to div
            side.appendChild(newDiv); //appends div to specified side
        }
    }
    //End Step 1

    //Begin Step 2
    function onChange(eventObject){//function onChange log value of select option
        console.log(eventObject.target.value); //log target value of eventObject
        let employeeURL = listURL + `/${eventObject.target.value}`; //set employeeURL to listURL with employee record

        if(event.target.value !== ""){//if not blank
            clearContainer(right); //clear right container
            displayLoading(right, "Loading content..."); //display loading text
            fetch(employeeURL) //fetch employee url
            .then((response) => {//response recieved
                if(response.ok){//status is ok
                    console.log(response); //log response to console 
                    return response.json(); //return   response as json
                }
                throw new Error(response.statusText); //throw error 
            })
            .then((employee) => {//employee json returned data used
                let elementH1 = document.createElement("h1"); //create h1 element
                let elementH2 = document.createElement("h2"); //create h2 element
                let elementP1 = document.createElement("p"); //create p element
                let elementP2 = document.createElement("p"); //create p element

                elementH1.innerHTML = `${employee.first_name} ${employee.last_name}`; //h1 element with first and last name
                elementH2.innerHTML = `Department: ${employee.department.name}`; //h2 element department name
                elementP1.innerHTML = `Annual Salary: ${employee.annual_salary}`; //p1 element annual salary
                elementP2.innerHTML = `Hire Date: ${employee.hire_date}`;//p2 element hire date

                clearContainer(right); //clear right container before adding data
                right.appendChild(elementH1);
                right.appendChild(elementH2);
                right.appendChild(elementP1);
                right.appendChild(elementP2);

                //Begin Step 3
                fetchIMG(employee.image_filename);//call function fetchIMG
                //End Step 3

                //Begin Step 4
                addURL();//call function addAnchor
                let deptURL = document.getElementById("deptAnchor"); //deptURL variable to id deptAnchor
                deptURL.addEventListener("click", ()=> {//event listener when lick deptAnchor id
                    getDepartmentList(employee); //invoke function getDepartmentList
                });
                //End Step 4
            })
                .catch(error => {
                    console.log("Error during fetch: " + error); //log o console error
                });

        }else {//if value is blank
            clearContainer(right); //clear right container
        }
    }//end of onChange Function
    //End Step 2

    //Begin Step 3
    function fetchIMG(imgURL){//function to fetch image
        fetch(imgURL, {
            method: "GET", //recieve data with GET
            mode: "cors", //allow outside domain
            redirect: "follow" //follow the redirect
        })
        .then((response) => {//response received
            if(response.ok){
                console.log(response); //log the response to console
                return response.blob(); //return as a blob
            }
            throw new Error(response.statusText); //throw error of response
        })
        .then((blob) => {
            let elementIMG = new Image(); //create img element
            elementIMG.src = URL.createObjectURL(blob); //set src of img element to blob
            right.appendChild(elementIMG); //append img to right div
        })
        .catch(error => console.log("Error when fetching image: " + error));
    }
    //End Step 3

    //Begin Step 4
    function addURL(){//function addURL to add url to doc
        let deptURL = document.createElement("a"); //create url element
        let tagIMG = document.getElementsByTagName("img")[0]; //img by tag name
        deptURL.innerText = "View Department"; //inner text of url element
        deptURL.id = "deptURL"; //set id 
        right.insertBefore(deptURL, tagIMG); //put url before img
                            
    }//end of addURL function

    function getDepartmentList(employee) {//function to manage department list
        let empID = employee.department.id; //department id value
        fetch(listURL)
        .then((response) => {
            if(response.ok){//response recieved
                console.log(response); //log response 
                return response.json();
            }
            throw new Error(response.statusText()); //throw error from response
        })
        .then((employees) => {
            let departmentUl = document.createElement("ul"); //create ul element
            let elementH4 = document.createElement("h4"); //create h4 element
            let elementH5 = document.createElement("h5"); //create h5 element
            let elementHR = document.createElement("hr"); //create hr element

            elementH4.innerHTML = `Department: ${employee.department.name}`; //h4 text
            elementH5.innerHTML = `Employees`; //h5 text
            
            right.appendChild(elementH4); //append element h4
            right.appendChild(elementH5); //append element h5
            right.appendChild(elementHR); //append element hr

            for(let employee of employees){//for loop of employees
                if(employee.department.id === empID){//if id of employee matches id
                    let departmentLi = document.createElement("li"); //create deparment li
                    departmentLi.innerHTML = `${employee.first_name} ${employee.last_name}`; //innerHRML employye first and last name
                    departmentUl.appendChild(departmentLi); //append li to ul 
                }
            }
            right.appendChild(departmentUl); //append ul to right div
        })
        .catch(error => {
            console.log("Error during fetch: " + error); //log o console error
        });
    }
    //End Step 4

}); //end of event listener of page load