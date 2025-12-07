// ---------------- DATA ----------------
let students = [
    {id:"STU001", name:"Venkatesh", branch:"CSE", dept:"AI", password:"1234", marks:0, grade:"N/A", attendance:0, faculty:"Prakash"},
    {id:"STU002", name:"Manohar", branch:"CSE", dept:"ML", password:"1234", marks:0, grade:"N/A", attendance:0, faculty:"Prakash"},
    {id:"STU003", name:"Jaswanth", branch:"ECE", dept:"IoT", password:"1234", marks:0, grade:"N/A", attendance:0, faculty:"Prakash"},
    {id:"STU004", name:"Abraar", branch:"EEE", dept:"Power", password:"1234", marks:0, grade:"N/A", attendance:0, faculty:"Prakash"}
];
let faculty = [{id:"FAC001", password:"fac123", name:"Prakash"}];

let currentStudent = null;

// ---------------- PAGE FUNCTIONS ----------------
function showPage(id){
    document.querySelectorAll(".center-box").forEach(d=>{
        d.classList.remove("show");
        d.classList.add("hidden");
    });
    let page = document.getElementById(id);
    page.classList.remove("hidden");
    setTimeout(()=> page.classList.add("show"), 50);
}
function logout(){ showPage('homePage'); currentStudent=null; }

// ---------------- STUDENT REGISTRATION ----------------
function registerStudent(){
    let name = document.getElementById("regName").value.trim();
    let branch = document.getElementById("regBranch").value.trim();
    let dept = document.getElementById("regDept").value.trim();
    let pass = document.getElementById("regPass").value.trim();
    if(!name || !pass || !branch || !dept){ alert("Fill all fields!"); return; }

    let id = "STU" + String(students.length+1).padStart(3,'0');
    let assignedFaculty = faculty[Math.floor(Math.random()*faculty.length)].name;

    students.push({
        id,
        name,
        password: pass,
        branch,
        dept,
        marks: 0,
        grade: "N/A",
        attendance: 0,
        faculty: assignedFaculty
    });

    alert(`Registered successfully! Your Student ID: ${id}`);
    showPage("studentLogin");
}

// ---------------- STUDENT LOGIN ----------------
function studentLogin(){
    let id = document.getElementById("stuId").value.trim();
    let pass = document.getElementById("stuPass").value.trim();
    let stu = students.find(s=>s.id===id && s.password===pass);
    if(stu){
        currentStudent = stu;
        showPage('studentDash');
        document.getElementById("stuWelcome").innerText = stu.name;
        document.getElementById("stuIdDisplay").innerText = stu.id;
        document.getElementById("stuBranch").innerText = stu.branch;
        document.getElementById("stuDept").innerText = stu.dept;
        document.getElementById("stuFaculty").innerText = stu.faculty;
        document.getElementById("stuAttendance").innerText = stu.attendance + "%";
        document.getElementById("stuMarks").innerText = stu.marks;
        document.getElementById("stuGrade").innerText = stu.grade;
    } else {
        alert("Invalid Student Credentials!");
    }
}

// ---------------- FACULTY LOGIN ----------------
function facultyLogin(){
    let id = document.getElementById("facId").value.trim();
    let pass = document.getElementById("facPass").value.trim();
    let fac = faculty.find(f=>f.id===id && f.password===pass);
    if(fac){ showPage('facultyDash'); loadStudentTable(); }
    else alert("Invalid Faculty Credentials!");
}

// ---------------- FACULTY DASHBOARD ----------------
function loadStudentTable(){
    let rows = "";
    students.forEach(s=>{
        rows+=`<tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.branch}</td>
            <td>${s.dept}</td>
            <td>${s.marks}</td>
            <td>${s.grade}</td>
            <td>${s.attendance}%</td>
        </tr>`;
    });
    document.getElementById("studentRows").innerHTML = rows;
}

function viewStrength(){ alert(`Total Students: ${students.length}`); }

// ---------------- ATTENDANCE POPUP ----------------
function postAttendance() {
    let container = document.createElement("div");
    container.className = "modal-container";
    let box = document.createElement("div");
    box.className = "modal-box";

    let html = `<h2>Post Attendance</h2><form id="attendanceForm">
                <table style="width:100%;border-collapse:collapse">
                <tr><th>Present</th><th>Student ID</th><th>Name</th><th>Branch</th></tr>`;
    students.forEach((s,i)=>{
        html += `<tr>
                    <td><input type="checkbox" name="stu${i}" ${s.attendance>0?'checked':''}></td>
                    <td>${s.id}</td>
                    <td>${s.name}</td>
                    <td>${s.branch}</td>
                 </tr>`;
    });
    html += `</table><br>
             <button type="submit">Submit Attendance</button>
             <button type="button" id="cancelAttendance">Cancel</button>
             </form>`;
    box.innerHTML = html;
    container.appendChild(box);
    document.body.appendChild(container);

    document.getElementById("attendanceForm").onsubmit = function(e){
        e.preventDefault();
        students.forEach((s,i)=>{
            let chk = document.querySelector(`input[name=stu${i}]`);
            if(chk.checked){ s.attendance += 3; if(s.attendance>100) s.attendance=100;}
            else { s.attendance -=1; if(s.attendance<0)s.attendance=0;}
        });
        loadStudentTable();
        document.body.removeChild(container);
        alert("Attendance updated successfully!");
    };
    document.getElementById("cancelAttendance").onclick = ()=>document.body.removeChild(container);
}

// ---------------- MARKS POPUP ----------------
function updateMarks() {
    let container = document.createElement("div");
    container.className = "modal-container";
    let box = document.createElement("div");
    box.className = "modal-box";

    let html = `<h2>Update Marks</h2><form id="marksForm">
                <table style="width:100%;border-collapse:collapse">
                <tr><th>ID</th><th>Name</th><th>Branch</th><th>Marks</th></tr>`;
    students.forEach((s,i)=>{
        html+=`<tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.branch}</td>
                <td><input type="number" name="mark${i}" value="${s.marks}" min="0" max="100" style="width:60px"></td>
               </tr>`;
    });
    html += `</table><br>
             <button type="submit">Submit Marks</button>
             <button type="button" id="cancelMarks">Cancel</button>
             </form>`;
    box.innerHTML = html;
    container.appendChild(box);
    document.body.appendChild(container);

    document.getElementById("marksForm").onsubmit = function(e){
        e.preventDefault();
        students.forEach((s,i)=>{
            let val = parseInt(document.querySelector(`input[name=mark${i}]`).value);
            s.marks = isNaN(val)?0:val;
            if(s.marks>=90)s.grade="A+";
            else if(s.marks>=80)s.grade="A";
            else if(s.marks>=70)s.grade="B";
            else if(s.marks>=60)s.grade="C";
            else s.grade="D";
        });
        loadStudentTable();
        document.body.removeChild(container);
        alert("Marks updated successfully!");
    };
    document.getElementById("cancelMarks").onclick = ()=>document.body.removeChild(container);
}
