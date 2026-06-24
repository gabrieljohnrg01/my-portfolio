# Gabriel John Goc-ong - Personal Portfolio

A sleek, terminal-inspired, and interactive web portfolio showcasing my experience as an IT & Networks Major and Tech Troubleshooter. 

## Features

- **Terminal/Hacker Aesthetic:** A custom UI built with a blend of Tailwind CSS, Bootstrap, and custom CSS for a unique, tech-focused vibe.
- **Boot Sequence Animation:** Simulates a Linux-style kernel boot log upon page load.
- **Live Dynamic Widgets:** Displays live time, a simulated hardware latency graph, and system language proficiency bars.
- **GitHub API Integration:** Automatically fetches and displays the latest public repositories directly from my GitHub profile.
- **Verified Credentials:** A categorized, responsive image grid using a lightbox to display certificates, event participation, and cloud badges.
- **Interactive Terminal Emulator:** A mini built-in terminal interface ready for basic interaction.
- **Secret Root Dashboard:** A hidden "SysAdmin" dashboard showing simulated WISP clients, firewall traffic, and network load.

## Technologies Used

- **Markup & Style:** HTML5, CSS3, Tailwind CSS (via CDN), Bootstrap 5
- **Functionality:** Vanilla JavaScript (ES6)
- **Deployment:** Rendered and optimized for GitHub Pages

## Local Setup & Usage

Since this is a static website, getting it running locally is incredibly simple:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/gabrieljohnrg01/my-portfolio.git
   ```
2. Navigate to the project folder:
   ```bash
   cd my-portfolio
   ```
3. Open the `index.html` file in any modern web browser.

*Note: While you can just double-click `index.html` to view the site, it is highly recommended to use a local development server (like the "Live Server" extension in VS Code) to ensure the GitHub API integration fetches repositories without running into local file CORS restrictions.*

## Managing Certificates

To add or update certificates in the **Verified Credentials** section:
1. Place your new certificate images (e.g., `new-cert.png`) inside the `assets/` directory.
2. Open `index.html` and search for the `Verified_Credentials` section.
3. Add a new `div` for your required category/event, and update the `<img>` tags to point to your new relative assets (e.g., `src="assets/new-cert.png"`).

## Author

**Gabriel John R. Goc-ong**
- 
- General Santos City
- **Email:** gabrieljohnrg01@gmail.com
- **GitHub:** [@gabrieljohnrg01](https://github.com/gabrieljohnrg01)
