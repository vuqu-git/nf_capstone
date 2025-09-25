// this vite static filepath with the default value; value is set in deploy-to-render.yml

// const relativePathForDockerDeployment = "";
const relativePathForDockerDeployment = "/static-files/bilder/filmbilder/"
export const staticFilePathFrontend = relativePathForDockerDeployment || 'https://www.pupille.org/bilder/filmbilder/';

// export const staticFilePathFrontend = import.meta.env.VITE_STATIC_FILEPATH_FRONTEND || 'https://www.pupille.org/bilder/filmbilder/';
