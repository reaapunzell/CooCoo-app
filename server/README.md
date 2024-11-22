# Group Buying Platform Backend

This is the backend for the Group Buying Platform, developed using Django and Django REST Framework (DRF). It provides API endpoints for user authentication, group buying features, notifications, and real-time communication.

---

## **Features**

### 1. **User Authentication**
- **Signup**: Register users with email and password.
- **Login**: Authenticate users and generate JWT tokens.
- **Email Verification**: Send a One-Time Password (OTP) for email verification.
- **Resend OTP**: Allow users to request a new OTP if the previous one expires.

### 2. **Group Buying**
- **Create Group**: Organizers can create a group for a specific product.
- **Join Group**: Users can join an existing group.
- **Track Progress**: Monitor the group's current progress toward its target goal.

### 3. **Notifications**
- **Email Notifications**: Notify users and organizers at critical stages (e.g., when joining a group or reaching the target goal).
- **SMS Notifications**: (Optional) Notify users via SMS for time-sensitive updates.
- **Real-Time Notifications**: Use WebSockets for in-app updates.

### 4. **Chat Feature**
- Real-time group chat for group members and organizers.
- WebSocket-based communication for seamless interaction.

---

## **Setup Instructions**

### **Prerequisites**
- Python 3.8 or higher
- PostgreSQL or SQLite
- Redis (for WebSocket communication)
- Node.js (optional for testing frontend 

---

### **Installation**
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/group-buying-platform.git
   cd server
----

### **Create a Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

### ***Install Dependencies
 ```bash
pip install -r requirements.txt


###***Run Migrations

bash
python manage.py makemigrations
python manage.py migrate

###***Start the Development Server
python manage.py runserver

###***Accessing the API Documentation

The project uses Swagger for API documentation.
You can access the documentation at the following endpoint:
http://127.0.0.1:8000/swagger/

