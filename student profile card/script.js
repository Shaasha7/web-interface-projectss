const student = {
    name: "Shalini Udayakumar",
    age: 22,
    department: "Artificial Intelligence & Data Science",
    year: "2nd Year",
    college: "Prince Dr. K. Vasudevan College of Engineering and Technology",
    email: "shalinishamili132005@example.com",
    phone: "7339485184",
    location: "Hyderabad",
    image: "shalini.jpeg"
};
const studentCard = document.getElementById("studentCard");


studentCard.innerHTML = `
    <div class="card">

        <img 
            src="${student.image}" 
            alt="${student.name}"
            class="profile-img"
        >

        <h2>${student.name}</h2>

        <p class="role">${student.department}</p>

        <div class="details">

            <p>
                <strong>Age:</strong> 
                ${student.age}
            </p>

            <p>
                <strong>Year:</strong> 
                ${student.year}
            </p>

            <p>
                <strong>College:</strong> 
                ${student.college}
            </p>

            <p>
                <strong>Email:</strong> 
                ${student.email}
            </p>

            <p>
                <strong>Phone:</strong> 
                ${student.phone}
            </p>

            <p>
                <strong>Location:</strong> 
                ${student.location}
            </p>

        </div>

    </div>
`;