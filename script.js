const gradePoints = {
    'O': 9.5,      
    'D+': 8.45,    
    'D': 7.7,      
    'A+': 7.2,     
    'A': 6.45,     
    'B': 5.45,     
    'C': 4.45,     
    'U': 0         
};
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});
let gpaCourses = [{ id: 1, name: '', credits: '', grade: '' }];
let gpaCourseIdCounter = 1;
function renderGpaCourses() {
    const container = document.getElementById('gpaCourses');
    container.innerHTML = '';
    gpaCourses.forEach(course => {
        const courseRow = document.createElement('div');
        courseRow.className = 'course-row';
        const nameRow = document.createElement('div');
        nameRow.className = 'course-name-row';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'course-name';
        nameInput.placeholder = 'Enter course name';
        nameInput.value = course.name;
        nameInput.oninput = (e) => {
            course.name = e.target.value;
        };
        nameRow.appendChild(nameInput);
        if (gpaCourses.length > 1) {
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = '✕';
            delBtn.onclick = () => {
                gpaCourses = gpaCourses.filter(c => c.id !== course.id);
                renderGpaCourses();
            };
            nameRow.appendChild(delBtn);
        }
        const inputsRow = document.createElement('div');
        inputsRow.className = 'course-inputs';
        const creditsInput = document.createElement('input');
        creditsInput.type = 'number';
        creditsInput.className = 'course-input';
        creditsInput.placeholder = 'Credits';
        creditsInput.min = '0';
        creditsInput.step = '0.5';
        creditsInput.value = course.credits;
        creditsInput.oninput = (e) => {
            course.credits = e.target.value;
            updateGpaDisplay();
        };
        const gradeSelect = document.createElement('select');
        gradeSelect.className = 'course-input';
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Select Grade';
        gradeSelect.appendChild(opt);
        Object.keys(gradePoints).forEach(g => {
            const option = document.createElement('option');
            option.value = g;
            option.textContent = g;
            if (course.grade === g) option.selected = true;
            gradeSelect.appendChild(option);
        });
        gradeSelect.onchange = (e) => {
            course.grade = e.target.value;
            updateGpaDisplay();
        };
        inputsRow.appendChild(creditsInput);
        inputsRow.appendChild(gradeSelect);
        courseRow.appendChild(nameRow);
        courseRow.appendChild(inputsRow);
        container.appendChild(courseRow);
    });
    updateGpaDisplay();
}
function updateGpaDisplay() {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const course of gpaCourses) {
        const credits = parseFloat(course.credits) || 0;
        const points = gradePoints[course.grade] || 0;
        totalPoints += credits * points;
        totalCredits += credits;
    }
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    document.getElementById('gpaValue').textContent = gpa;
    document.getElementById('gpaCredits').textContent = totalCredits.toFixed(1);
}
document.getElementById('addGpaCourse').onclick = () => {
    gpaCourseIdCounter++;
    gpaCourses.push({ id: gpaCourseIdCounter, name: '', credits: '', grade: '' });
    renderGpaCourses();
};
let semesters = [{ id: 1, courses: [{ id: 1, name: '', credits: '', grade: '' }] }];
let semesterIdCounter = 1;
function calculateSemesterGPA(semester) {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const course of semester.courses) {
        const credits = parseFloat(course.credits) || 0;
        const points = gradePoints[course.grade] || 0;
        totalPoints += credits * points;
        totalCredits += credits;
    }
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
}
function calculateCGPA() {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const semester of semesters) {
        for (const course of semester.courses) {
            const credits = parseFloat(course.credits) || 0;
            const points = gradePoints[course.grade] || 0;
            totalPoints += credits * points;
            totalCredits += credits;
        }
    }
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
}
function updateCgpaDisplay() {
    document.getElementById('cgpaValue').textContent = calculateCGPA();
    let totalCredits = 0;
    for (const semester of semesters) {
        for (const course of semester.courses) {
            totalCredits += parseFloat(course.credits) || 0;
        }
    }
    document.getElementById('totalCredits').textContent = totalCredits.toFixed(1);
}
function renderSemesters() {
    const grid = document.getElementById('semestersGrid');
    grid.innerHTML = '';
    semesters.forEach((semester, s) => {
        const card = document.createElement('div');
        card.className = 'semester-card';
        const header = document.createElement('div');
        header.className = 'semester-header';
        const titleGroup = document.createElement('div');
        const title = document.createElement('div');
        title.className = 'semester-title';
        title.textContent = 'Semester ' + (s + 1);
        const gpa = document.createElement('div');
        gpa.className = 'semester-gpa';
        gpa.textContent = 'GPA: ' + calculateSemesterGPA(semester);
        gpa.id = 'gpa-' + semester.id;
        titleGroup.appendChild(title);
        titleGroup.appendChild(gpa);
        header.appendChild(titleGroup);
        if (semesters.length > 1) {
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = '✕';
            delBtn.onclick = () => {
                semesters = semesters.filter(s => s.id !== semester.id);
                renderSemesters();
            };
            header.appendChild(delBtn);
        }
        card.appendChild(header);
        semester.courses.forEach(course => {
            const courseRow = document.createElement('div');
            courseRow.className = 'course-row';
            const nameRow = document.createElement('div');
            nameRow.className = 'course-name-row';
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.className = 'course-name';
            nameInput.placeholder = 'Enter course name';
            nameInput.value = course.name;
            nameInput.oninput = (e) => {
                course.name = e.target.value;
            };
            nameRow.appendChild(nameInput);
            if (semester.courses.length > 1) {
                const delCBtn = document.createElement('button');
                delCBtn.className = 'delete-btn';
                delCBtn.textContent = '✕';
                delCBtn.onclick = () => {
                    semester.courses = semester.courses.filter(c => c.id !== course.id);
                    renderSemesters();
                };
                nameRow.appendChild(delCBtn);
            }
            const inputsRow = document.createElement('div');
            inputsRow.className = 'course-inputs';
            const creditsInput = document.createElement('input');
            creditsInput.type = 'number';
            creditsInput.className = 'course-input';
            creditsInput.placeholder = 'Credits';
            creditsInput.min = '0';
            creditsInput.step = '0.5';
            creditsInput.value = course.credits;
            creditsInput.oninput = (e) => {
                course.credits = e.target.value;
                updateCgpaDisplay();
                document.getElementById('gpa-' + semester.id).textContent = 'GPA: ' + calculateSemesterGPA(semester);
            };
            const gradeSelect = document.createElement('select');
            gradeSelect.className = 'course-input';
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'Select Grade';
            gradeSelect.appendChild(opt);
            Object.keys(gradePoints).forEach(g => {
                const option = document.createElement('option');
                option.value = g;
                option.textContent = g;
                if (course.grade === g) option.selected = true;
                gradeSelect.appendChild(option);
            });
            gradeSelect.onchange = (e) => {
                course.grade = e.target.value;
                updateCgpaDisplay();
                document.getElementById('gpa-' + semester.id).textContent = 'GPA: ' + calculateSemesterGPA(semester);
            };
            inputsRow.appendChild(creditsInput);
            inputsRow.appendChild(gradeSelect);
            courseRow.appendChild(nameRow);
            courseRow.appendChild(inputsRow);
            card.appendChild(courseRow);
        });
        const addBtn = document.createElement('button');
        addBtn.className = 'add-btn';
        addBtn.textContent = '+ Add Course';
        addBtn.onclick = () => {
            const newId = semester.courses.length > 0 ? Math.max(...semester.courses.map(c => c.id)) + 1 : 1;
            semester.courses.push({ id: newId, name: '', credits: '', grade: '' });
            renderSemesters();
        };
        card.appendChild(addBtn);
        grid.appendChild(card);
    });
    updateCgpaDisplay();
}
document.getElementById('addSemesterBtn').onclick = () => {
    semesterIdCounter++;
    semesters.push({ id: semesterIdCounter, courses: [{ id: 1, name: '', credits: '', grade: '' }] });
    renderSemesters();
};
let gpaInputs = [{ id: 1, gpa: '', credits: '' }];
let gpaInputIdCounter = 1;
function renderGpaInputs() {
    const container = document.getElementById('gpaInputs');
    container.innerHTML = '';
    gpaInputs.forEach((input, index) => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'course-row';
        const nameRow = document.createElement('div');
        nameRow.className = 'course-name-row';
        const label = document.createElement('div');
        label.className = 'semester-title';
        label.textContent = 'Semester ' + (index + 1);
        label.style.flex = '1';
        nameRow.appendChild(label);
        if (gpaInputs.length > 1) {
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = '✕';
            delBtn.onclick = () => {
                gpaInputs = gpaInputs.filter(i => i.id !== input.id);
                renderGpaInputs();
            };
            nameRow.appendChild(delBtn);
        }
        const inputsRow = document.createElement('div');
        inputsRow.className = 'course-inputs';
        const gpaInput = document.createElement('input');
        gpaInput.type = 'number';
        gpaInput.className = 'course-input';
        gpaInput.placeholder = 'GPA';
        gpaInput.min = '0';
        gpaInput.max = '10';
        gpaInput.step = '0.01';
        gpaInput.value = input.gpa;
        gpaInput.oninput = (e) => {
            input.gpa = e.target.value;
            updateConvertedCgpa();
        };
        const creditsInput = document.createElement('input');
        creditsInput.type = 'number';
        creditsInput.className = 'course-input';
        creditsInput.placeholder = 'Credits';
        creditsInput.min = '0';
        creditsInput.step = '0.5';
        creditsInput.value = input.credits;
        creditsInput.oninput = (e) => {
            input.credits = e.target.value;
            updateConvertedCgpa();
        };
        inputsRow.appendChild(gpaInput);
        inputsRow.appendChild(creditsInput);
        inputGroup.appendChild(nameRow);
        inputGroup.appendChild(inputsRow);
        container.appendChild(inputGroup);
    });
    updateConvertedCgpa();
}
function updateConvertedCgpa() {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const input of gpaInputs) {
        const gpa = parseFloat(input.gpa) || 0;
        const credits = parseFloat(input.credits) || 0;
        totalPoints += gpa * credits;
        totalCredits += credits;
    }
    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    document.getElementById('convertedCgpa').textContent = cgpa;
}
document.getElementById('addGpaInput').onclick = () => {
    gpaInputIdCounter++;
    gpaInputs.push({ id: gpaInputIdCounter, gpa: '', credits: '' });
    renderGpaInputs();
};
renderGpaCourses();
renderSemesters();
renderGpaInputs();