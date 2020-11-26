//setting global variables
let isUpdate = false;
let employeePayrollObj = {};

window.addEventListener('DOMContentLoaded', (event) => {
    const name = document.querySelector('#name')
    const textError = document.querySelector('.text-Error')
    name.addEventListener('input', function() {
        if(name.value.length == 0) {
            textError.textContent = ""
            return;
        }
        try {
            checkName(name.value);
            textError.textContent = "";
        } catch (e){
            textError.textContent = e;
        }
    });

    const date = document.querySelector("#date")
    const dateError = document.querySelector('.date-error')
    date.addEventListener('input', function() {
        let startDate = new Date(Date.parse(document.querySelector('#Day').value + " " + document.querySelector('#month').value +
                                 " " + document.querySelector('#year').value));
        try{
            checkStartDate(new Date(Date.parse(startDate)))
            dateError.textContent = "";
        }catch(e){
            dateError.textContent = e;
        }
    })
    
    const salary = document.querySelector('#salary')
    const salary_op = document.querySelector('.salary-output-text')
    salary_op.textContent = salary.value
    salary.addEventListener('input', function() {
        salary_op.textContent = salary.value
    });

    document.querySelector('#cancelButton').href = site_properties.home_page;
    checkForUpdate();
});

function checkName(name) {
    let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
    if(!nameRegex.test(name)) throw 'Incorrect Name';
}

function checkStartDate(startDate) {
    let now = new Date();
    if(startDate > now) throw 'Future Date';
    var diff = Math.abs(now.getTime() - startDate.getTime());
    if( diff / (1000 * 60 * 60 * 24) > 30) throw 'Start Date is beyond 30 Days';
}

// save an employee object details
const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try{
        populateEmployeeObject();
        createAndUpdateLocalStorage();
        reset();
        window.location.replace(site_properties.home_page);        
    }catch (e){
        return;
    }
}

function populateEmployeeObject(){
    if(!isUpdate && site_properties.use_local_storage.match("true")){
        employeePayrollObj.id = createNewEmployeeId();
    }

    employeePayrollObj._name = document.querySelector('#name').value;
    employeePayrollObj._profile = getSelectedValues(document.getElementsByName('profile'))
    employeePayrollObj._gender = getSelectedValues(document.getElementsByName('gender'));
    employeePayrollObj._department = getSelectedValues(document.getElementsByName('department'));
    employeePayrollObj._salary = document.querySelector('#salary').value;
    employeePayrollObj._note = document.querySelector('#notes').value;
    let date = document.querySelector('#Day').value + " " + document.querySelector('#month').value + " " + document.querySelector('#year').value;
    employeePayrollObj._startDate = date;
}

function createAndUpdateLocalStorage() {
    let empList = JSON.parse(localStorage.getItem("EmployeeList"))
    if(empList){
        let emp = empList.find( empData => empData.id == employeePayrollObj.id)
        if(!emp){
            empList.push(employeePayrollObj)
        }else{
            const index = empList.map( empData => empData.id).indexOf(emp.id);
            empList.splice(index, 1, employeePayrollObj);
        }
    }else{
        empList = [employeePayrollObj]
    }
    localStorage.setItem("EmployeeList", JSON.stringify(empList));
}

function createEmployeePayrollData(id) {
    let emp = new Employee();
    if(!id) emp.id = createNewEmployeeId();
    else emp.id = id;

    setEmployeePayrollData(emp);
    return emp;
}

function createNewEmployeeId() {
    let empID = localStorage.getItem("EmployeeID")
    empID = !empID ? 1 : (parseInt(empID) + 1).toString();
    localStorage.setItem("EmployeeID", empID)
    return empID
}

function setEmployeePayrollData(emp) {
    try{
        emp.name = employeePayrollObj._name
    }catch(e){
        document.querySelector('.text-Error').textContent = e;
        throw e;
    }
    emp.profile = employeePayrollObj._profile;
    emp.gender = employeePayrollObj._gender;
    emp.department = employeePayrollObj._department;
    emp.salary = employeePayrollObj._salary;
    emp.note = employeePayrollObj._note;
    try{
        emp.startDate = new Date(Date.parse(employeePayrollObj._startDate))
    }catch (e){
        document.querySelector('date-error').textContent = e;
        throw e;
    }
    alert(emp.toString())
}

function getSelectedValues(propertyValue){
    let setItems = [];
    for(let i=0; i<propertyValue.length; i++){
        if(propertyValue[i].checked){
            setItems.push(propertyValue[i].value)
        }
    }
    return setItems;
}

// reset form to default values
function reset(){
    document.querySelector('#name').value = '';
    setDefaultSelectedValues(document.getElementsByName('profile'))
    setDefaultSelectedValues(document.getElementsByName('gender'))
    setDefaultSelectedValues(document.getElementsByName('department'))
    document.querySelector('#salary').value = '';
    document.querySelector('#notes').value = '';
    document.querySelector('#Day').value = '1';
    document.querySelector('#month').value = 'January';
    document.querySelector('#year').value = '2020';    
}

function setDefaultSelectedValues(propertyValue){
    for(let i=0; i<propertyValue.length; i++){
        propertyValue[i].checked = false;
    }
    return;
}

// updating an employee record
function checkForUpdate() {
    let empJson = localStorage.getItem('editEmp')
    isUpdate = empJson ? true : false;
    if(!isUpdate) return;
    employeePayrollObj = JSON.parse(empJson);
    setForm();
}

function setForm() {
    document.querySelector('#name').value = employeePayrollObj._name;
    setSelectedValues('[name=profile]', employeePayrollObj._profile)
    setSelectedValues('[name=gender]', employeePayrollObj._gender)
    setSelectedValues('[name=department]', employeePayrollObj._department)
    document.querySelector('#salary').value = employeePayrollObj._salary;
    document.querySelector('.salary-output-text').textContent = employeePayrollObj._salary;
    document.querySelector('#notes').value = employeePayrollObj._note;
    let date = stringifyDate(employeePayrollObj._startDate).split(" ")
    document.querySelector('#Day').value = date[0];
    document.querySelector('#month').value = date[1];
    document.querySelector('#year').value = date[2];
}
function setSelectedValues(propertyValue, value) {
    let allItems = document.querySelectorAll(propertyValue)
    allItems.forEach(item => {
        if(Array.isArray(value)) {
            if(value.includes(item.value)){
                item.checked = true;
            }
        }else if(item.value === value){
            item.checked = true;
        }
    }); 
}