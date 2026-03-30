# HHCC Platform — Business Requirements

---

## Objective

Helping Hands Childcare (HHCC) currently has a minimal web application that allows potential customers to:

- View static photos of individual Care Centers
- Create a profile
- Schedule pick-up and drop-off times
- Submit payments

While HHCC has faced some local competition, both the Corporate and Community care center models have been widely successful. The company has set its sights on more ambitious growth goals, including:

- Breaking into new markets such as pet care and elderly care
- Expanding nationally
- Becoming a global business within the next three years

---

## Why Capgemini Was Engaged

Helping Hands has hired Capgemini to assist with:

- Scaling and improving the user experience of their digital application
- Expanding the business model (e.g., pet care, elderly care) and differentiating from local competition
- Developing a strategy to enter global markets within a 3-year timeline

---

## Requirement Use Cases

### UC#1 — Home Screen

**Description:** The home screen serves as the entry point for unregistered or logged-out users. It displays an overview of services, unique selling points (USPs), and provides easy navigation to other sections of the app.

| | |
|---|---|
| **Actors** | Unregistered Users, Potential Customers |
| **Preconditions** | User is on the app's home screen (not logged in). |
| **Postconditions** | User can explore services, learn about the app's features, and navigate to registration or service pages. |

---

### UC#2 — User Registration

**Description:** Users can register by providing their personal information to create an account.

| | |
|---|---|
| **Actors** | Potential Customers |
| **Preconditions** | User is on the registration page. |
| **Postconditions** | User account is created and stored in the database. |

---

### UC#3 — Add Family Member

**Description:** Registered users can add family members to their profile for easy management.

| | |
|---|---|
| **Actors** | Registered Users |
| **Preconditions** | User is logged in and on the family management page. |
| **Postconditions** | Family member information is added to the user's profile. |

---

### UC#4 — Manage Family Members

**Description:** Users can update or delete family member information to keep their profile current.

| | |
|---|---|
| **Actors** | Registered Users |
| **Preconditions** | User is logged in and on the family management page. |
| **Postconditions** | Family member information is updated or deleted. |

---

### UC#5 — Add Pet

**Description:** Users can add pets to their profile for easy management of their pet-related services.

| | |
|---|---|
| **Actors** | Registered Users |
| **Preconditions** | User is logged in and on the pet management page. |
| **Postconditions** | Pet information is added to the user's profile. |

---

### UC#6 — Manage Pets

**Description:** Users can update or delete pet information to keep their profile up to date.

| | |
|---|---|
| **Actors** | Registered Users |
| **Preconditions** | User is logged in and on the pet management page. |
| **Postconditions** | Pet information is updated or deleted. |

---

### UC#7 — Schedule Pick-Up and Drop-Off Times for Family Members

**Description:** Users can schedule pick-up and drop-off times for their family members.

| | |
|---|---|
| **Actors** | Registered Users |
| **Preconditions** | User is logged in and on the scheduling page. |
| **Postconditions** | Scheduling information is saved in the database. |

---

### UC#8 — Schedule Pick-Up and Drop-Off Times for Pets

**Description:** Users can schedule pick-up and drop-off times for their pets.

| | |
|---|---|
| **Actors** | Registered Users |
| **Preconditions** | User is logged in and on the scheduling page. |
| **Postconditions** | Scheduling information for pets is saved in the database. |

---

### UC#9 — Make Payment

**Description:** Users can make payments for services booked through the app.

| | |
|---|---|
| **Actors** | Registered Users |
| **Preconditions** | User is logged in and on the payment page. |
| **Postconditions** | Payment information is processed securely and recorded in the database. |

---

### UC#10 — Send Email Notification

**Description:** The system sends email notifications to users for various events (e.g., registration confirmation, scheduling updates).

| | |
|---|---|
| **Actors** | System |
| **Preconditions** | Relevant event (e.g., user registration, scheduling update) occurs. |
| **Postconditions** | Email notification is sent to the user's registered email address. |

---

### UC#11 — Feedback and Support Screen

**Description:** The system allows users to provide feedback, rate services, and access customer support options (chat, email, phone).

| | |
|---|---|
| **Actors** | Registered Users, Unregistered Users, Customer Support Team |
| **Preconditions** | User is logged in or accessing support as a guest. |
| **Postconditions** | Feedback is collected, and users are directed to appropriate support resources. |

---

### UC#12 — Admin Dashboard

**Description:** The system provides administrators with tools to manage app content, users, services, and generate reports on user engagement and service usage.

| | |
|---|---|
| **Actors** | Admins |
| **Preconditions** | Admin is logged in with appropriate credentials. |
| **Postconditions** | Admin can view, edit, and manage content, users, services, and access analytical reports. |