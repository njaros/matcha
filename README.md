# Matcha

## 🚀 About the project 

This project aims to create a dynamic dating website, guiding users from the initial registration process to the final, exciting encounter. Our platform is enriched with features such as video chat to provide a more interactive and engaging user experience.

### Under the hood, Matcha is powered by a robust tech stack

- We've leveraged Flask, a lightweight yet powerful Python web framework, for our backend. In an effort to optimize database interactions and maintain full control over our queries, we've chosen not to use an Object-Relational Mapping (ORM) system. Instead, we've written all SQL queries manually using Psycopg, a popular PostgreSQL adapter for Python. This approach allows us to handle user requests efficiently and securely, while ensuring maximum flexibility and performance in our database operations.

- To enable real-time data transfer, we've also implemented WebSockets. This technology allows us to establish a two-way communication channel between the client and the server, ensuring instant data transfer and enhancing the responsiveness of our application.

- On the frontend, we've chosen React with TypeScript to build a responsive, user-friendly interface. To enhance the visual appeal and usability of our application, we've utilized Chakra UI, a simple, modular and accessible component library that provides a range of customizable UI elements. TypeScript provides a static type system, enhancing code quality and maintainability.

- We've chosen PostgreSQL as our database management system due to its reliability, robust feature set, and strong community support. Here is a small schema of our database.

![](https://raw.githubusercontent.com/jreverdy/matcha/main/readme_assets/image/database.png)

## How to Install and Run the Project

```docker compose up --build```

For local use, please update the host IP in your .env file to 'localhost'

## How to Use the Project

![](https://raw.githubusercontent.com/jreverdy/matcha/main/readme_assets/image/login_page.png)
![](https://raw.githubusercontent.com/jreverdy/matcha/main/readme_assets/image/signup_page.png)

[settings.webm](https://github.com/user-attachments/assets/d78136b5-4ebf-4180-9854-637897db1833)

[swipe.webm](https://github.com/user-attachments/assets/cf6df347-3805-4a3a-9a98-5eb9ff970a33)

[video_chat.webm](https://github.com/user-attachments/assets/0bb10723-3743-494b-beb4-264adfab3f34)

## The end.

If you have any questions feel free to ask !
