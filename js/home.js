let empList;
window.addEventListener('DOMContentLoaded', (event) => {
    empList = getEmpListFromLocalStorage();
    document.querySelector(".emp-count").textContent = empList.length;
    createInnerHTML();
    localStorage.removeItem('editEmp')
})

function getEmpListFromLocalStorage(){
    return localStorage.getItem('EmployeeList') ? JSON.parse(localStorage.getItem('EmployeeList')) : [];
}

const createInnerHTML = () => {
    const headerHtml = "<th></th><th>Emp Name</th><th>Gender</th><th>Department</th><th>Salary</th>"
                        +"<th>Start Date</th><th>Actions</th>";
    //if(empList.length == 0) return;
    let innerHtml =  `${headerHtml}`;
    for(const emp of empList){
        innerHtml = `${innerHtml}
        <tr>
            <td><img src="${emp._profile}" alt="" class="profile"></td>
            <td>${emp._name}</td>   
            <td>${emp._gender}</td>
            <td>${getDeptHtml(emp._department)}</td>    
            <td>${emp._salary}</td>
            <td>${stringifyDate(emp._startDate)}</td>
            <td>
                <img id="${emp.id}" onclick="remove(this)" alt="delete" src="../assets//icons/delete-black-18dp.svg">
                <img id="${emp.id}" onclick="update(this)" alt="edit" src="../assets/icons/create-black-18dp.svg">  
            </td>
        </tr>
        `;
    }
    document.querySelector('#display').innerHTML = innerHtml;
}

function getDeptHtml(deptList){
    let deptHtml = '';
    for(const dept of deptList){
        deptHtml = `${deptHtml} <div class='dept-label'>${dept}</div>`
    }
    return deptHtml
}

function remove(obj) {
    let empRemove = empList.find(empData => empData.id == obj.id)
    if(!empRemove) return;
    const index = empList.map(empData => empData.id).indexOf(empRemove.id);
    empList.splice(index,1)
    localStorage.setItem('EmployeeList', JSON.stringify(empList))
    document.querySelector(".emp-count").textContent = empList.length;
    createInnerHTML();
}

const update = (obj) => {
    let empUpdate = empList.find(emp => emp.id == obj.id)
    if(!empUpdate) return;
    localStorage.setItem('editEmp', JSON.stringify(empUpdate))
    window.location.replace(site_properties.add_employee_page);
}