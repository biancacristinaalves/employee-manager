function searchEmployee() {
    const searchField = document.getElementById("searchField").value.trim();

    fetch("employees.json")
        .then(response => response.json())
        .then(employees => {
            let results = employees.filter(
                emp =>
                    emp.empId.toString().includes(searchField) ||
                    emp.empLastname.toLowerCase().includes(searchField.toLowerCase()) ||
                    emp.empLevel.toString().includes(searchField)
            );

            if (!searchField) results = employees;

            if (results.length > 0) {
                document.getElementById("searchMessage").innerHTML = "";

                let tableHTML = `
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th>Id</th>
                  <th>Firstname</th>
                  <th>Lastname</th>
                  <th>Salary</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
          `;

                results.forEach(emp => {
                    tableHTML += `
              <tr>
                <td>${emp.empId}</td>
                <td>${emp.empFirstname}</td>
                <td>${emp.empLastname}</td>
                <td>$${emp.empSalary.toLocaleString()}</td>
                <td>${emp.empLevel}</td>
              </tr>
            `;
                });

                tableHTML += "</tbody></table>";
                document.getElementById("searchResults").innerHTML = tableHTML;
            } else {
                document.getElementById("searchMessage").innerHTML =
                    '<div class="alert alert-warning">No records found.</div>';
                document.getElementById("searchResults").innerHTML = "";
            }
        })
        .catch(() => {
            document.getElementById("searchMessage").innerHTML =
                '<div class="alert alert-danger">An error occurred while loading data.</div>';
        });
}

function addEmployee() {
    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const salary = parseFloat(document.getElementById("salary").value);

    if (!firstname || !lastname || isNaN(salary)) {
        document.getElementById("addMessage").innerHTML =
            '<div class="alert alert-danger">All fields are required!</div>';
        return;
    }

    const level = salary < 30000 ? 1 : salary < 60000 ? 2 : 3;

    fetch("add_employee.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            empFirstname: firstname,
            empLastname: lastname,
            empSalary: salary,
            empLevel: level
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("addMessage").innerHTML =
                    '<div class="alert alert-success">Employee added successfully!</div>';
            } else {
                document.getElementById("addMessage").innerHTML =
                    `<div class="alert alert-danger">Error: ${data.error}</div>`;
            }
        })
        .catch(() => {
            document.getElementById("addMessage").innerHTML =
                '<div class="alert alert-danger">An error occurred while adding the employee.</div>';
        });
}
