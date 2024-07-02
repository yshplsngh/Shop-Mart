<div id="top"></div>

<br />
<div align="center">
  <a href="https://github.com/yshplsngh/shop-mart">
    <img src="client/public/image/logo_white.jpg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Urban Elegance</h3>

  <p align="center">
    An awesome online shop application based on website
    <br />
    <a href="https://github.com/yshplsngh/shop-mart"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/yshplsngh/shop-mart">View Demo</a>
    ·
    <a href="https://github.com/yshplsngh/shop-mart/issues">Report Bug</a>
    ·
    <a href="https://github.com/yshplsngh/shop-mart/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

Welcome to the **Urban Elegance** Github repository! Here, you'll find the source code for our sleek and sophisticated online shop application. Built with modern technologies and a focus on user experience, our application aims to provide customers with an effortless shopping experience.

<p align="right"><a href="#top">back to top</a></p>

### Built With

Main technology used to built this application are listed below:

* [Typescript](https://www.typescriptlang.org/)
* [React.js](https://www.reactjs.org/)
* [Tailwind CSS](https://www.tailwindcss.com/)
* [Node.js](https://www.nodejs.org/)
* [Express.js](https://www.expressjs.com/)
* [MongoDB](https://www.mongodb.com/cloud/atlas/)
* [Docker](https://www.docker.com/)

<p align="right"><a href="#top">back to top</a></p>

## Getting Started

To get started with this project locally, follow below steps:

### Prerequisites
Make sure you have Docker, and package manager (either npm or yarn) installed

>**FYI**: This project uses **yarn** as the client package manager, but you're free to use **npm** too.
### Installation

Below steps will guide you through the local installation process of this application

1. Clone the repo
  ```git clone https://github.com/yshplsngh/shop-mart.git```
   2. Complete the .env variable at /server directory
Rename .env.example file at ```/config``` directory become ```.env```, then fill the value for every key. Below is the guideline for filling the .env value:<br/>
    | Key | What to Fill | Example Value |
    | :---: | :---: | :---: |
    | PORT | Your server port | 5000 |
    | MONGO_URL | Your MongoDB connection URL | mongodb+srv://username:password@main.14znatw.mongodb.net/DBName?retryWrites=true&w=majority |
    | ACCESS_TOKEN_SECRET | Your JWT access token secret | NzeWG39JJNWASRKTeM85Ki77yZbdXZapvfIfepxz7d2WG |
    | REFRESH_TOKEN_SECRET | Your JWT refresh token secret | KS3VuMkQkGzzQ5BhMyxgpGV2xelxR7B7UummWAG5r5c |
    | XENDIT_API_KEY | Your <a href="https://www.xendit.co/">Xendit</a> API key | xnd_development_jdsfkdskfdkkkdkkk222: |
3. Complete the key.ts variabel at /client directory
Rename key.example.ts file at ```/config``` directory become ```key.ts```, then fill the value for every key. Below is the guideline for filling the key.ts value:<br/>
    | Key | What to Fill | Example Value |
    | :---: | :---: | :---: |
    | LOCATION_API_KEY | Your <a href="https://www.goapi.io/api-wilayah-indonesia/">GoAPI</a> API key | 5abc6de7-9a11-9b11-1822-18saj212 |
    | BITESHIP_AUTHORIZATION_KEY | Your <a href="https://www.biteship.com/">Biteship</a> authorization key | biteship_live.hhjkkhkjihi78 |
    | XENDIT_API_KEY | Your <a href="https://www.xendit.co/">Xendit</a> API key | xnd_development_jdsfkdskfdkkkdkkk222: |
    | CLOUDINARY_PRODUCTS_FOLDER_ID | Your <a href="https://www.cloudinary.com/">Cloudinary</a> "products" folder ID for this project | abcdefgh |
    | CLOUDINARY_USERS_FOLDER_ID | Your <a href="https://www.cloudinary.com/">Cloudinary</a> "users" folder ID for this project | abcdefgh |
    | CLOUDINARY_CLOUD_NAME | Your <a href="https://www.cloudinary.com/">Cloudinary</a> cloud name | abcd8efgh |
4. Go to ```docker-compose.yml``` at root directory and replace the ```ports``` value at the ```server``` section to the port value at yout .env file. For example, your PORT value at .env is 5000, so the ```ports``` value at the docker-compose.yml is ```5000:5000```
5. Go to ```package.json``` at ```/client``` directory and replace the ```proxy``` port to the port value at your .env file. For example, your PORT value at .env is 5000, so the ```proxy``` value is ```http://server:5000```
6. Open your terminal, and ```cd``` to the root directory, then run ```docker-compose build``` command
7. Lastly, run ```docker-compose up``` command at your terminal to start the application

<p align="right"><a href="#top">back to top</a></p>

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right"><a href="#top">back to top</a></p>

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right"><a href="#top">back to top</a></p>


