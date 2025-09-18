import random
import bcrypt

# --- simplified IT + Hospital roles from our last refinements ---
it_roles = {
    "Developer": ["Front-End", "Back-End", "Full-Stack"],
    "Engineer": ["Front-End", "Back-End", "Full-Stack", "Cloud"],
    "Designer": ["UI/UX"],
    "Scientist": ["Data"],
    "HR": ["HR"],
    "DevOps Engineer": ["Automation"],
    "Cloud Engineer": ["Cloud"],
    "Intern": ["Front-End", "Back-End", "Full-Stack"],
    "CEO": ["Management"]
}

hospital_roles = {
    "Doctor": [
        "Pediatrics (Kids)", "Cardiology (Heart)", "Pulmonology (Lungs)",
        "Neurology (Brain)", "Oncology (Cancer)", "Dermatology (Skin)"
    ],
    "Nurse": [
        "Children''s Nursing", "Intensive Care Nursing",
        "Emergency Room Nursing", "Cancer Nursing"
    ],
    "Surgeon": [
        "Heart Surgery", "Brain Surgery", "Orthopedic Surgery",
        "ENT Surgery", "Plastic Surgery"
    ]
}

names = ["John Smith", "Jane Doe", "Omar Abdallah", "Sara Kamel", "Michael Brown",
         "Hany Aziz", "Laura Santiago", "Khaled Naguib", "Nada Fahmy", "Tarek Ismail",
         "Mona Ali", "Fatma Hassan", "Youssef Gamal", "Mariam Kamal",
         "David Wilson", "Jessica White", "Ramy Amin", "Lara Khalil",
         "Ziad Fouad", "Mai Kamal", "Hana Saad", "Amr Halim"]

def random_email(name):
    base = name.lower().replace(" ", ".")
    return f"{base}{random.randint(10,9999)}@gmail.com"

def random_password():
    return bcrypt.hashpw(b"123456", bcrypt.gensalt()).decode("utf-8")

def generate_insert(table="employees", count=200, start_id=1000):
    values = []
    for i in range(count):
        emp_id = start_id + i
        name = random.choice(names)

        if random.random() < 0.3:  # 30% hospital staff
            title = random.choice(list(hospital_roles.keys()))
            specialty = random.choice(hospital_roles[title])
        else:  # IT staff
            title = random.choice(list(it_roles.keys()))
            specialty = random.choice(it_roles[title])

        email = random_email(name)
        password = random_password()

        values.append(
            f"({emp_id},'{name}','{title}','{specialty}','{email}','{password}')"
        )

    sql = f"INSERT INTO `{table}` (emp_id, emp_name, emp_title, emp_specialty, emp_email, emp_password) VALUES\n"
    sql += ",\n".join(values) + ";"
    return sql

if __name__ == "__main__":
    sql_data = generate_insert(count=200)

    # Save to file in the same directory
    with open("employees_inserts.sql", "w", encoding="utf-8") as f:
        f.write(sql_data)

    # Also print first part so you know it worked
    print("✅ File employees_inserts.sql created with 200 records")
    print(sql_data[:500] + " ...")  # preview
