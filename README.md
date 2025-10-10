 <a id="readme-top"></a>

<div align="center">

[![Contributors](https://img.shields.io/github/contributors/abhiishhekk/Complaint_Tracking_System.svg?style=for-the-badge)](https://github.com/abhiishhekk/Complaint_Tracking_System/graphs/contributors)&nbsp;[![Forks](https://img.shields.io/github/forks/abhiishhekk/Complaint_Tracking_System.svg?style=for-the-badge)](https://github.com/abhiishhekk/Complaint_Tracking_System/network/members)&nbsp;[![Stargazers](https://img.shields.io/github/stars/abhiishhekk/Complaint_Tracking_System.svg?style=for-the-badge)](https://github.com/abhiishhekk/Complaint_Tracking_System/stargazers)&nbsp;[![Issues](https://img.shields.io/github/issues/abhiishhekk/Complaint_Tracking_System.svg?style=for-the-badge)](https://github.com/abhiishhekk/Complaint_Tracking_System/issues)&nbsp;[![MIT License](https://img.shields.io/github/license/abhiishhekk/Complaint_Tracking_System.svg?style=for-the-badge)](https://github.com/abhiishhekk/Complaint_Tracking_System/blob/main/LICENSE.txt)&nbsp;

</div>
<br />
<div align="center">
  <a href="https://github.com/abhiishhekk/Complaint_Tracking_System">
    <img src="assets/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Urban Resolve © 2025</h3>
  <p align="center">
    A comprehensive municipal complaint management platform for citizens and municipal authorities.

    <br />
    <br />
    <a href="https://urban-resolve-client.vercel.app/dashboard?page=1" ><strong style="text-decoration: underline; color: #0366d6;">View Demo »</strong></a>
    <br />
    <a href="https://github.com/abhiishhekk/Complaint_Tracking_System/issues" style="text-decoration: underline; color: #0366d6;">Report Bug</a>
    ·
    <a href="https://github.com/abhiishhekk/Complaint_Tracking_System/issues" style="text-decoration: underline; color: #0366d6;">Request Feature</a>
  </p>
</div>


<details class="toc">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#-screenshots--demo">Screenshots & Demo</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

## About The Project

**Urban Resolve** is a comprehensive digital platform designed to simplify and streamline the process of reporting, managing, and resolving municipal complaints. Citizens can easily raise complaints, attach images or documents, and monitor the progress of their issues in real-time. Municipal officers and administrators have dedicated dashboards to handle, assign, and track complaints efficiently.

## Key Features: ##

### Key Features

* **Citizen Complaint Portal:** File complaints with categories (e.g., Road, Water, Electricity, Garbage) and attach media.

* **Secure & Role-Based Access:** JWT-based authentication for citizens, staff members, and admins.

* **Complaint Lifecycle:**
  1. **Pending** — When a citizen submits a new complaint and it awaits review.
  2. **In Progress** — When municipal staff starts working on resolving the issue.
  3. **Resolved** — When the issue has been successfully addressed.
  4. **Rejected** — If the complaint is invalid, duplicate, or lacks sufficient information.

* **Complaint Analytics Dashboard:**
  - View complaint distribution by **type**, **region**, **city**, **pincode**, and **resolution status**.
  - Filter complaints and analytics by **monthly trends** to monitor recurring issues and performance efficiency.

* **Monthly Reports for Admins:** Admins can generate comprehensive reports for the current month including complaint counts, types, resolution rates, and region-wise summaries.

* **Media Upload Support:** Citizens can attach relevant images for complaints to help municipal staff assess issues accurately.

* **Notification System:** Automated email alerts for complaint status updates and resolutions.

* **Secure & Scalable:** Built with Node.js, Express, MongoDB, and React.js with proper role-based access and JWT authentication.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is built with a modern, scalable, and robust tech stack.

* [![React][React.js]][React-url]
* [![Node][Node.js]][Node-url]
* [![Express][Express.js]][Express-url]
* [![MongoDB][MongoDB]][Mongo-url]
* [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
* **Authentication:** JSON Web Tokens (JWT)
* **Media Storage:** Cloudinary

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 📸 Screenshots & Demo

### Screenshots

![Project Dashboard](assets/dashboard.png)
![Project Profile Page](assets/profile.png)

### Video Demo
For the video, a great approach is to upload it to a service like YouTube or Loom and link it here. You can make a thumbnail image clickable.

[![Urban Resolve Video Demo](assets/logo.png)](https://drive.google.com/file/d/1C9R_wtKDtVnYiXyUblwNIcUlwVJdWWmj/view?usp=drive_link)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed on your local development machine:
* Node.js (v18.x or later)
* npm
    ```sh
    npm install npm@latest -g
    ```
* A MongoDB database (local or a cloud instance from MongoDB Atlas)

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/your-username/Municipal_Complaint_Tracking_System.git
    ```

2.  **Backend Setup**
    * Navigate to the backend directory:
        ```sh
        cd Complaint_Tracking_System/backend
        ```
    * Install NPM packages (this will install all dependencies from `package.json`):
        ```sh
        npm install
        ```
    * Create a `.env` file in the `backend` directory and add the following variables:
        ```env
        # Server Configuration
        NODE_ENV=development
        PORT=8000
        
        # Database
        MONGODB_URI=your_mongodb_connection_string
        
        # JWT Secrets
        ACCESS_JWT_TOKEN_SECRET=your_super_secret_access_token
        REFRESH_JWT_TOKEN_SECRET=your_super_secret_refresh_token
        
        # Cookie Settings
        COOKIE_SECURE=false
        COOKIE_SAMESITE=lax
        
        # URLs
        FRONTEND_URL=http://localhost:5173
        BACKEND_URL=http://localhost:8000
        
        # Email Service (for notifications)
        EMAIL_SERVICE=gmail
        EMAIL_PORT=587
        EMAIL_USER=your_email@gmail.com
        EMAIL_PASS=your_gmail_app_password
        EMAIL_ADMIN=municipal_admin_email@example.com
        
        # Cloudinary API Credentials (for complaint image uploads)
        CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
        CLOUDINARY_API_KEY=your_cloudinary_api_key
        CLOUDINARY_API_SECRET=your_cloudinary_api_secret
        ```

3.  **Frontend Setup**
    * Navigate to the frontend directory:
        ```sh
        cd ../client
        ```
    * Install NPM packages:
        ```sh
        npm install
        ```
    * Create a `.env` file in the `frontend` directory and add the backend URL:
        ```env
        VITE_API_BASE_URL=http://localhost:8000/api/v1
        ```

4.  **Run the application**
    * Start the backend server (from the `/backend` directory):
        ```sh
        npm run dev
        ```
    * Start the frontend server (from the `/frontend` directory):
        ```sh
        npm run dev
        ```

After successful startup:
* The **backend API** will run at → `http://localhost:8000`
* The **frontend** will run at → `http://localhost:5173`

---

Now you can register as a citizen, staff member or admin, log in, file new complaints, and view complaint analytics by type, region, city, pincode, and monthly trend.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Usage

Once running, the application allows users to:
1. **Sign Up/Log In:** Citizens can create an account or log in with existing credentials. Municipal staff and admin roles are pre-assigned.
2. **File a Complaint:** Navigate to the complaints section, describe the issue, attach photos or media if necessary, and submit.
3. **Browse & Filter:** Use the dashboard to view existing complaints and filter them by **status** (Pending, In Progress, Resolved, Rejected), **type**, **region**, **city**, or **pincode**.
4. **View Complaint Analytics:** Admins can see complaint distribution by type, region, resolution status, and monthly trends to monitor municipal performance.
5. **Generate Monthly Reports:** Admins can export comprehensive reports for the current month, including complaint counts, types, resolution rates, and region-wise summaries.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion to improve this project, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! ⭐ Thanks!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/abhiishhekk/Complaint_Tracking_System](https://github.com/abhiishhekk/Complaint_Tracking_System)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[Mongo-url]: https://www.mongodb.com/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/