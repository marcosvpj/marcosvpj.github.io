# Personal Blog

This is the source code for my personal blog. It is built with [Hugo](https://gohugo.io/) and automatically deployed to GitHub Pages.

## Getting Started

### Prerequisites

Make sure you have [Hugo](https://gohugo.io/getting-started/installing/) installed on your local machine.

### Running Locally

1. Clone this repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd blog
   ```
3. Start the Hugo server:
   ```sh
   hugo server
   ```
The site will be available at `http://localhost:1313/`.

## Creating a New Post

To create a new blog post, run the following command:

```sh
hugo new posts/my-new-post.md
```

This will create a new Markdown file in the `content/posts` directory. You can then edit this file to add your content.

## Deployment

This project is automatically deployed to GitHub Pages whenever new changes are pushed to the `src` branch.

There is also a manual deployment script available:

```sh
./deploy.sh
```
This script will build the site and push the `public` directory to the `master` branch.
